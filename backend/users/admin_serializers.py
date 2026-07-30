from rest_framework import serializers
from django.db.models import Min

from users.models import Users, Booking
from agency.models import Agency, Tour


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone_number",
            "is_verified",
            "is_active",
            "date_joined",
        ]


class AdminAgencySerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="owner.full_name")

    total_tours = serializers.SerializerMethodField()

    class Meta:
        model = Agency
        fields = [
            "id",
            "agency_name",
            "owner",
            "country",
            "verification_status",
            "published",
            'email',
            'phone',
            "is_active",
            "total_tours",
            "created_at",
        ]

    def get_total_tours(self, obj):
        return obj.tour_set.count()


class AdminTourSerializer(serializers.ModelSerializer):
    agency = serializers.CharField(source="agency.agency_name")
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Tour
        fields = [
            "id",
            "title",
            "agency",
            "country",
            "city",
            "category",
            "price",
            "status",
            "created_at",
        ]


class AdminBookingSerializer(serializers.ModelSerializer):
    traveler = serializers.CharField(source="user.full_name")
    tour = serializers.CharField(source="tour.title")
    agency = serializers.CharField(source="tour.agency.agency_name")

    class Meta:
        model = Booking
        fields = [
            "id",
            "traveler",
            "tour",
            "agency",
            "travelers",
            "total_price",
            "status",
            "created_at",
        ]