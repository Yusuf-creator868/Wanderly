from rest_framework import serializers
from django.utils.timesince import timesince
from .models import *
from django.contrib.auth import get_user_model
from users.models import *
import json
from translations.mixins import TranslationMixin
from django.db.models import Sum
User = get_user_model()


#  AgencySerializer -------->

class AgencyVerificationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyVerificationDocument
        fields = "__all__"
        read_only_fields = ["agency", "uploaded_at"]
        
        
class AgencySerializer(serializers.ModelSerializer):

    verification_documents = AgencyVerificationDocumentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Agency
        fields = "__all__"
        read_only_fields = [
            "slug",
            "plan",
            "verification_status",
            "published",
            "created_at",
        ]
        



class IncludedSerializer( serializers.ModelSerializer):
    

    class Meta:
        model = Included
        fields = '__all__'
        

        
        
#  AgencySerializer -------->
class ExcludedSerializer( serializers.ModelSerializer):
    

    
    class Meta:
        model = Excluded
        fields = '__all__'

    
        
#  TourImageSerializer ---------->
class TourImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = TourImage
        fields = '__all__'
        
        
        
        
#  HotelImageSerializer -------->
class HotelImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = HotelImage
        fields = "__all__"
               


# HotelSerializer ------->    
class HotelSerializer( serializers.ModelSerializer):
    

    images = HotelImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Hotel
        fields = "__all__"
        


# ItinerarySerializer----->
class ItinerarySerializer( serializers.ModelSerializer):
    

    class Meta:
        model = Itinerary
        fields = "__all__"
        


        
# DepartureSerializer----->
class DepartureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Departure
        fields = "__all__"
        



# TourSerializer---------->
class TourSerializer( serializers.ModelSerializer):
    included_items = IncludedSerializer(many=True)

    excluded_items = ExcludedSerializer(many=True)

    images = TourImageSerializer(many=True, read_only=True)

    hotels = HotelSerializer( many=True, read_only = True)
    
    itinerary = ItinerarySerializer(many = True, read_only = True)
    

    departures = DepartureSerializer( many=True, read_only = True)
    
    agency = serializers.SerializerMethodField()
    
    # title = serializers.SerializerMethodField()
    # description = serializers.SerializerMethodField()
    

    class Meta:
        model = Tour

        fields = [
            "id",
            "source_language",
            'agency',
            "title",
            "description",
            'from_country',
            'from_city',
            "country",
            "city",
            "category",
            'nights',
            "duration",
            'flight_included',
            'meals_included',
            'hotel_included',
            'car',
            'guide_included',
            'rating',
            'included_items',
            'excluded_items',
            'status',
            'cover_image',
            "images",
            "hotels",
            "itinerary",
            "departures",
        ]
    
    def get_agency(self, obj):
        agency = obj.agency
        
        if not agency:
            return None
        
        return {
            "agency_name": agency.agency_name,
            "tel": agency.phone,
            "email": agency.email,
        }
        
    def update(self, instance, validated_data):

        # REMOVE NESTED FIELDS
        validated_data.pop("included_items", None)
        validated_data.pop("excluded_items", None)

        # PARSE JSON
        included_data = json.loads(
            self.initial_data.get(
                "included_items",
                "[]"
            )
        )

        excluded_data = json.loads(
            self.initial_data.get(
                "excluded_items",
                "[]"
            )
        )

        # UPDATE TOUR
        instance = super().update( instance, validated_data )

        # INCLUDED
        instance.included_items.all().delete()

        for item in included_data:

            Included.objects.create(
                tour=instance,
                title=item["title"]
            )

        # EXCLUDED
        instance.excluded_items.all().delete()

        for item in excluded_data:

            Excluded.objects.create(
                tour=instance,
                title=item["title"]
            )

        return instance
    
        

class AgencyTourListSerializer(serializers.ModelSerializer):
    total_seats = serializers.SerializerMethodField()
    class Meta:
        model = Tour
        fields = ['id', 'title', 'country', 'city', 'duration', 'cover_image', 'total_seats', 'status']
        
    def get_total_seats(self, obj):
        return (
            obj.departures.aggregate(
                total=Sum("available_seats")
            )["total"] or 0
        )
        
        
class GetToursSerializer(TranslationMixin, serializers.ModelSerializer):
    is_favorite = serializers.BooleanField(read_only=True)
    price = serializers.SerializerMethodField()
    tour_views = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    total_seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Tour
        fields = ['id', 'title', 'from_country', 'from_city', 'country', 'city', "total_seats", 'flight_included', 'meals_included', 'tour_views', 'rating', 'car', 'hotel_included', 'guide_included', 'duration', 'nights', 'cover_image', 'category', 'price', "is_favorite"]
    
    def get_price(self, obj):

        cheapest_hotel = obj.hotels.order_by("price").first()

        if cheapest_hotel:
            return cheapest_hotel.price

        return None
    
    
    def get_tour_views(self, obj):
        return obj.tour_views.count()
    
    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_total_seats(self, obj):
        return (
            obj.departures.aggregate(
                total=Sum("available_seats")
            )["total"] or 0
        )








# ------------> Here is get serializer of tour details 












class GetIncludedSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = Included
        fields = "__all__"

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")
    
    
class GetExcludedSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = Excluded
        fields = "__all__"

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")
    
    
    
class GetHotelSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = "__all__"


    
    
    
    
class GetTourDetailSerializer(TranslationMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    included_items = GetIncludedSerializer(many=True, read_only=True)
    excluded_items = GetExcludedSerializer(many=True, read_only=True)
    images = TourImageSerializer(many=True, read_only=True)
    hotels = GetHotelSerializer(many=True, read_only=True)
    departures = DepartureSerializer(many=True, read_only=True)
    total_seats = serializers.SerializerMethodField()

    agency = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "id",
            "source_language",
            "agency",
            "title",
            "description",
            "from_country",
            "from_city",
            "country",
            "city",
            "total_seats",
            "category",
            "nights",
            "duration",
            "flight_included",
            "meals_included",
            "hotel_included",
            "car",
            "guide_included",
            "rating",
            "included_items",
            "excluded_items",
            "status",
            "cover_image",
            "images",
            "hotels",
            "itinerary",
            "departures",
        ]

    def get_title(self, obj):
        return self.get_translated_field(obj, "title")

    def get_description(self, obj):
        return self.get_translated_field(obj, "description")

    def get_agency(self, obj):
        agency = obj.agency
        if not agency:
            return None
        
        request = self.context.get("request")

        logo = None
        if agency.logo:
            if request:
                logo = request.build_absolute_uri(agency.logo.url)
            else:
                logo = agency.logo.url

        return {
            "agency_name": agency.agency_name,
            'agency_logo': logo,
            "tel": agency.phone,
            'agency_city': agency.city,
            "email": agency.email,
            'verification_status': agency.verification_status,
        }
        
    def get_total_seats(self, obj):
        return (
            obj.departures.aggregate(
                total=Sum("available_seats")
            )["total"] or 0
        )
        
class BookingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["username", "phone_number"]        
        
        
class AgencyDepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = [
            "id",
            "departure_date",
            "departure_time",
            "return_date",
            "return_time",
            "available_seats",
        ]

class GetTravelersInfo(serializers.ModelSerializer):
    class Meta:
        model = BookingTraveler
        fields = '__all__'
        
class GetBookingSerializer(serializers.ModelSerializer):
    user = BookingUserSerializer(read_only=True)
    tour = serializers.CharField(source="tour.title")
    hotel = serializers.CharField(source="hotel.name")
    departure = AgencyDepartureSerializer(read_only=True)
    travelers_info = GetTravelersInfo(many = True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "tour",
            "departure",
            "hotel",
            "travelers",
            "total_price",
            "status",
            "created_at",
            'travelers_info'
        ]