from django.shortcuts import render
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from agency.models import *
import requests
from .serializer import *
from .utils import *
from .models import *
from django.shortcuts import get_object_or_404
from django.db.models import Exists, OuterRef, Max
from django.contrib.postgres.search import *
from django.db.models import Q, Case, When, Value, IntegerField, OuterRef, Subquery
from .filter import *
from translations.models import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.pagination import PageNumberPagination
from .emails import *
from .pagination import TourPagination
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
User = get_user_model()
from django.core.cache import cache

def get_client_ip(request):

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]

    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip

class CustomTokenObtainPairView(TokenObtainPairView):
    
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens["access"]
        refresh_token = tokens["refresh"]

        remember_me = request.data.get("remember_me", False)

        res = Response()
        res.data = {"success": True}

        cookie_settings = {
            "httponly": True,
            "secure": True,  # True in production
            "samesite": "None",
            "path": "/"
        }

        # remember for 7 days
        if remember_me:
            cookie_settings["max_age"] = 60 * 60 * 24 * 7

        res.set_cookie(
            key="access_token",
            value=access_token,
            **cookie_settings
        )

        res.set_cookie(
            key="refresh_token",
            value=refresh_token,
            **cookie_settings
        )

        return res

    
    

    

class CusromRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token
            
            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,          # 🔥 MUST be True in production
                samesite="None",      # 🔥 CRITICAL
                path="/"
            )
            return res



@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get("token")

    if not token:
        return Response(
            {"error": "No token provided"},
            status=400,
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        # print("GOOGLE ERROR:", e)
        return Response(
            {"error": str(e)},
            status=400,
        )

    email = idinfo["email"]
    name = idinfo.get("name", "")
    google_id = idinfo["sub"]

    user = User.objects.filter(email=email).first()

    if not user:
        username = email.split("@")[0]

        # Make username unique
        original_username = username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{original_username}{counter}"
            counter += 1

        user = User.objects.create(
            email=email,
            username=username,
        )

        user.set_unusable_password()
        user.save()

    response = Response({
        "success": True,
    })

    return set_jwt_cookies(response, user)
        

@api_view(["POST"])
def logout(request):
    try:
        res = Response()
        res.data = {"success": True}
        res.delete_cookie("access_token", path="/")
        res.delete_cookie("refresh_token", path="/")
        return res
    except:
        return Response({"success": False})
    

    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    if request.user.is_authenticated:
        return Response({
            "authenticated": True,
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "username": request.user.username,
                "role": request.user.role,
            }
        })

    return Response({
        "authenticated": False,
        "user": None,
    })


# @api_view(["POST"])
# def register(request):
#     serializer = UserRegistrationSerializer(data=request.data)

#     serializer.is_valid(raise_exception=True)  # 🔥 IMPORTANT

#     user = serializer.save()

#     return Response({
#         "id": user.id,
#         "username": user.username,
#         "email": user.email,
#     })


@api_view(["POST"])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.is_active = True        # keep them active if you still want them to browse
        user.is_verified = False     # explicit, though it's already the default
        user.save()

        send_verification_email(user)

        return Response({
            "registered": True,
            "message": "Check your email to verify your account before logging in.",
        })

    return Response(serializer.errors, status=400)


@api_view(["GET"])
def verify_email(request, uid, token):
    try:
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Invalid link"}, status=400)

    if default_token_generator.check_token(user, token):
        user.is_verified = True
        user.save(update_fields=["is_verified"])
        return Response({"success": True, "message": "Email verified. You can now log in."})

    return Response({"error": "Invalid or expired token"}, status=400)


@api_view(["POST"])
def add_favorite(request):
    try:
        fav_code = request.data.get("fav_code")
        tour_id = request.data.get("tour_id")

        cart, created = FavoriteCart.objects.get_or_create(fav_code = fav_code )
        tour= Tour.objects.get(id=tour_id)

        cartitem, created = FavoriteItems.objects.get_or_create(favcart = cart, tour = tour )
        

        serializer = FavoriteCartItemSerializer(cartitem)

        return Response({"data": serializer.data, "message": "Favorite added successfully!"} )
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(["DELETE"])
def remove_favorite(request):
    try:
        fav_code = request.data.get("fav_code")
        tour_id = request.data.get("tour_id")

        favorite = FavoriteItems.objects.filter(
            favcart__fav_code=fav_code,
            tour_id=tour_id
        ).first()

        if not favorite:
            return Response(
                {"error": "Favorite not found"},
                status=404
            )

        favorite.delete()

        return Response({
            "message": "Favorite removed successfully!"
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=400
        )


@api_view(['GET'])
def get_tour_details_users(request, pk):
    tour = Tour.objects.get(id = pk)
    ip = request.META.get("REMOTE_ADDR")
    
    if request.user.is_authenticated:
        already_viewed = TourView.objects.filter(
            tour = tour,
            user = request.user,
        ).exists()
        
        if not already_viewed:
            TourView.objects.create(
                tour = tour,
                user = request.user,
                ip_address = ip
            )
    
    else: 
        
        already_viewed = TourView.objects.filter(
            tour = tour,
            ip_address = ip,
        ).exists()
        
        if not already_viewed:
             TourView.objects.create(
                tour = tour,
                ip_address = ip
            )
             
    serializer = GetTourDetailSerializer(tour, context={"request": request})
    return Response(serializer.data)



@api_view(["GET"])
def get_favorites(request):
    fav_code = request.query_params.get('fav_code')

    favorite_qs = FavoriteItems.objects.filter(
        favcart__fav_code=fav_code,
        tour=OuterRef("pk")
    )

    favorites = Tour.objects.filter(
        favoriteitems__favcart__fav_code=fav_code,
        status='published'
    ).annotate(
        is_favorite=Exists(favorite_qs)
    ).distinct()

    serializer = GetToursSerializer(
        favorites,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)





@api_view(["GET"])
def get_tours(request):
    fav_code = request.query_params.get("fav_code")


    favorite_qs = FavoriteItems.objects.filter(
        favcart__fav_code=fav_code,
        tour=OuterRef("pk")
    )

    tours = (
        Tour.objects.filter(status="published")
        .annotate(
            is_favorite=Exists(favorite_qs),
        )
    )

    paginator = TourPagination()
    page = paginator.paginate_queryset(tours, request)

    serializer = GetToursSerializer(
        page,
        many=True,
        context={"request": request}
    )

    return paginator.get_paginated_response(serializer.data)





@api_view(['GET'])
def tours(request):
    fav_code = request.GET.get("fav_code")
    query = request.GET.get("q", "")
    print("RAW QUERY REPR:", repr(query))
    print("RAW QUERY BYTES:", query.encode('utf-8', errors='replace'))

    favorite_qs = FavoriteItems.objects.filter(
    favcart__fav_code=fav_code,
    tour=OuterRef("pk")
)
    
    # ------------------------
    # USER LOCATION
    # ------------------------

    city = None
    country = None

    try:
        ip = get_client_ip(request)

        location = cache.get(f"ip_location:{ip}")

        if location is None:
            response = requests.get(
                f"https://ipapi.co/{ip}/json/",
                timeout=2,
            )

        location = response.json()

        cache.set(
            f"ip_location:{ip}",
            location,
            60 * 60 * 24,  # 24 hours
        )

        city = location.get("city")
        country = location.get("country_name")

    except Exception as e:
        print("Location Error:", e)
        
    # ------------------------
    # BASE QUERYSET
    # ------------------------


    queryset = Tour.objects.filter(
        status="published"
    ).annotate(

        location_boost=Case(

            When( from_city__iexact=city, then=Value(3) ),

            When( from_country__iexact=country, then=Value(2) ),

            default=Value(0),

            output_field=IntegerField()

        ),
        is_favorite=Exists(favorite_qs),
    )
    
    

    # ------------------------
    # SEARCH
    # ------------------------

    query = request.GET.get("q", "")
    lang = request.GET.get("lang", "en")

    if query:

        vector = (
        SearchVector("country", weight="A", config = "simple") +
        SearchVector("city", weight="A", config = "simple") +
        SearchVector("title", weight="B", config = "simple") +

        SearchVector( "translations__country", weight="A", config = "simple") +

        SearchVector( "translations__city", weight="A", config = "simple") +

        SearchVector( "translations__title", weight="B", config = "simple")
    )

        search_query = SearchQuery(query, config = "simple")

        queryset = queryset.filter(
            Q(translations__language=lang) |
            Q(translations__isnull=True)
            ).annotate(
            
            rank=SearchRank(vector, search_query),

            similarity = (
                    TrigramSimilarity("country", query) +
                    TrigramSimilarity("city", query) +
                    TrigramSimilarity("title", query) +

                    TrigramSimilarity("translations__country", query) +
                    TrigramSimilarity("translations__city", query) +
                    TrigramSimilarity("translations__title", query)
                )

        ).filter(
            Q(rank__gt=0.1) |
            Q(similarity__gt=0.3)
        ).order_by(
            '-location_boost',
            '-rank',
            '-similarity'
        )
        
    else:
        queryset = queryset.order_by(
            '-location_boost',
            '-created_at'
        )

    # ------------------------
    # FILTERS
    # ------------------------

    filterset = TourFilter(
        request.GET,
        queryset=queryset
    )
    
    # request.GET that one field contains URL query params
    # queryset actual data that should be filtered queryset = Tour.objects.filter(status="published")

    queryset = filterset.qs

    # qs means filtered queryset
    
    # ------------------------
    # ORDERING
    # ------------------------


    ordering = request.GET.get("ordering")

    allowed_ordering = [
        "-created_at",
        "-rating",
        "departures__price",
        "-departures__price",
    ]

    queryset = queryset.annotate(
        hotel_stars=Max("hotels__stars")
    )
    
    if ordering in allowed_ordering:
        queryset = queryset.order_by("hotel_stars", ordering)
    else:
        queryset = queryset.order_by("hotel_stars")
        
    queryset = queryset.distinct()

    # ------------------------
    # SERIALIZER
    # ------------------------

    serializer = GetToursSerializer(
        queryset,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)



@api_view(["POST"])
def booking_tour(request):
    if not request.user.is_authenticated:
        return Response(
            {
                "authenticated": False,
                "message": "Authentication required."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    serializer = BookingSerializer(
        data=request.data,
        context={"request": request},
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking = serializer.save()
    
     # Notify the agency
    channel_layer = get_channel_layer()
    
    booking_data = GetBookingSerializer(booking).data
    

    async_to_sync(channel_layer.group_send)(
        f"agency_{booking.tour.agency.id}",
        {
            "type": "new_booking",
            "booking": booking_data,
        }
    )

    return Response(
        BookingSerializer(booking).data,
        status=status.HTTP_201_CREATED,
    )
    
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def post_user_info(request):
    user = request.user

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    serializer = UserSerializer(
        user,
        data=request.data,
        partial=True,   # allows updating only provided fields
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
   
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = (
        Booking.objects.filter(user=request.user)
        .select_related("tour", "departure", "hotel")
        .prefetch_related("travelers_info")
        .order_by("-created_at")
    )

    serializer = BookingDetailSerializer(bookings, many=True)
    return Response(serializer.data)