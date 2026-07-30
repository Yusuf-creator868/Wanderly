from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Min, Count
from users.models import Users
from agency.models import Agency
from agency.models import Tour
from users.models import Booking
from .permissions import IsSuperAdmin
from .admin_serializers import (
    AdminUserSerializer,
    AdminAgencySerializer,
    AdminTourSerializer,
    AdminBookingSerializer,
)
from .user_pagination import *

@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def dashboard(request):
    return Response({
        "users": Users.objects.count(),
        "agencies": Agency.objects.count(),
        "tours": Tour.objects.count(),
        "bookings": Booking.objects.count(),
    })


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def get_users(request):
    users = Users.objects.order_by("-date_joined")

    paginator = AdminPagination()

    page = paginator.paginate_queryset(users, request)

    serializer = AdminUserSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def get_agencies(request):
    agencies = (
        Agency.objects
        .select_related("owner")
        .annotate(total_tours=Count("tour"))
        .order_by("-created_at")
    )

    paginator = AdminPagination()

    page = paginator.paginate_queryset(agencies, request)

    serializer = AdminAgencySerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def get_admin_tours(request):
    
    tours = (
        Tour.objects
        .select_related("agency")
        .annotate(price=Min("hotels__price"))
        .order_by("-created_at")
    )

    paginator = AdminPagination()

    page = paginator.paginate_queryset(tours, request)

    serializer = AdminTourSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def get_bookings(request):
    bookings = (
        Booking.objects
        .select_related(
            "user",
            "tour",
            "tour__agency",
        )
        .order_by("-created_at")
    )

    paginator = AdminPagination()

    page = paginator.paginate_queryset(bookings, request)

    serializer = AdminBookingSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)