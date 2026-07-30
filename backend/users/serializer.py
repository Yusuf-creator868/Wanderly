from rest_framework import serializers
from django.utils.timesince import timesince
from .models import *
from agency.models import *
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from agency.serializer import *
User = get_user_model()
from django.utils.text import slugify

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    agency_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)  # now holds the "full name" text from frontend
    role = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ["agency_name", "username", "email", "password", "role"]

    def create(self, validated_data):
        agency_name = validated_data.pop("agency_name", None)
        role = validated_data.get("role", "traveler")
        display_name = validated_data.pop("username", None)  # this is really the full name typed in

        full_name = agency_name if role == "agency" else display_name

        # auto-generate a SAFE, unique username (no spaces/special chars)
        base = slugify(full_name) if full_name else validated_data["email"].split("@")[0]
        base = base.replace("-", "") or "user"
        username = base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1

        password = validated_data.pop("password")
        user = User(
            username=username,
            email=validated_data["email"],
            role=role,
            full_name=full_name or "",
        )
        user.set_password(password)
        user.save()
        
        if role == "agency":
            Agency.objects.create(
                owner=user,
                agency_name=agency_name,
            )

        return user
    
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            raise AuthenticationFailed("No account found with this email.")

        if not user.is_verified:
            raise AuthenticationFailed("Please verify your email before logging in.")

        return super().validate(attrs)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = "email"

    
    


class FavoriteCartItemSerializer(serializers.ModelSerializer):
    tour = TourSerializer(read_only = True)
    class Meta:
        model = FavoriteItems
        fields = ["id", "tour"]



class FavoritCartSerializer(serializers.ModelSerializer):
    items = FavoriteCartItemSerializer(read_only = True, many = True)
    class Meta:
        model = FavoriteCart
        fields = ["id", "fav_code", "items",]
        
        

        
class BookingTravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingTraveler
        exclude = ["booking"]
        
class BookingSerializer(serializers.ModelSerializer):
    travelers_info = BookingTravelerSerializer(many=True)

    class Meta:
        model = Booking
        fields = [
            "tour",
            "departure",
            "hotel",
            "travelers",
            "travelers_info",
            "total_price",
        ]

    def create(self, validated_data):
        request = self.context["request"]

        travelers_data = validated_data.pop("travelers_info")


        booking = Booking.objects.create(
            user=request.user,
            **validated_data,
        )

        BookingTraveler.objects.bulk_create([
            BookingTraveler(
                booking=booking,
                **traveler
            )
            for traveler in travelers_data
        ])


        return booking


class TourShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ["id", "title", "cover_image", "country", "city"]
        
        
        
class HotelShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ["id", "name", "stars"]
        
class DepartureShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = ["id", "departure_date", 'departure_time', 'return_date', 'return_time']
        
        

class BookingDetailSerializer(serializers.ModelSerializer):
    tour = TourShortSerializer(read_only=True)
    hotel = HotelShortSerializer(read_only=True)
    departure = DepartureShortSerializer(read_only=True)
    travelers_info = BookingTravelerSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "tour",
            "departure",
            "hotel",
            "travelers",
            "travelers_info",
            "total_price",
            "status",
            "created_at",
        ]


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Users
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "role",
        ]
        read_only_fields = ["id", "email", "role"]