import nested_admin
from django.contrib import admin
from .models import *


admin.site.register([ Agency, AgencyVerificationDocument])


class TourView(nested_admin.NestedTabularInline):
    model = TourView
    extra = 1
    
class IncludedInline(nested_admin.NestedTabularInline):
    model = Included
    extra = 1
    
class ExludedInline(nested_admin.NestedTabularInline):
    model = Excluded
    extra = 1

class HotelImageInline(nested_admin.NestedTabularInline):
    model = HotelImage
    extra = 1   
    
class HotelInline(nested_admin.NestedStackedInline):
    model = Hotel
    extra = 1
    classes = ["collapse"]

    inlines = [HotelImageInline]

class TourImageInline(nested_admin.NestedTabularInline):
    model = TourImage
    extra = 1


class ItineraryInline(nested_admin.NestedTabularInline):
    model = Itinerary
    extra = 1


class DepartureInline(nested_admin.NestedTabularInline):
    model = Departure
    extra = 1
    
@admin.register(Tour)
class TourAdmin(nested_admin.NestedModelAdmin):

    list_display = (
        "title",
        "agency",
        "from_country",
        "from_city",
        "country",
        "city",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "country",
    )

    search_fields = (
        "title",
        "city",
        "country",
    )

    inlines = [
        IncludedInline,
        ExludedInline,
        TourImageInline,
        HotelInline,
        ItineraryInline,
        DepartureInline,
        TourView,
    ]