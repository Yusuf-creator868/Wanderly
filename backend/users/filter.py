import django_filters
from datetime import timedelta
from django.utils import timezone
from calendar import monthrange

from agency.models import Tour


class TourFilter(django_filters.FilterSet):

    # ----------------------------
    # PRICE
    # ----------------------------

    min_price = django_filters.NumberFilter(
        field_name='hotels__price',
        lookup_expr='gte'
    )

    max_price = django_filters.NumberFilter(
        field_name='hotels__price',
        lookup_expr='lte'
    )

    # ----------------------------
    # DURATION
    # ----------------------------

    min_duration = django_filters.NumberFilter(
        field_name='duration',
        lookup_expr='gte'
    )

    max_duration = django_filters.NumberFilter(
        field_name='duration',
        lookup_expr='lte'
    )

    # ----------------------------
    # DATES
    # ----------------------------

    departure_date = django_filters.CharFilter(
        method="filter_departure_date"
    )


    # ----------------------------
    # HOTEL STARS
    # ----------------------------

    hotel_stars = django_filters.NumberFilter(
        field_name='hotels__stars',
        lookup_expr='gte'
    )

    # ----------------------------
    # MEAL PLAN
    # ----------------------------

    meal_plan = django_filters.CharFilter(
        field_name='hotels__meal_plan',
        lookup_expr='exact'
    )

    class Meta:
        model = Tour

        fields = [

            # DESTINATION
            'country',
            'city',

            # CATEGORY
            'category',

            # FLIGHT INCLUDED
            'flight_included',
        ]
        
    def filter_departure_date(self, queryset, name, value):

        today = timezone.localdate()

        if value == "this_week":
            start = today - timedelta(days=today.weekday())  # Monday
            end = start + timedelta(days=6)                  # Sunday

        elif value == "next_week":
            start = (
            today
                - timedelta(days=today.weekday())
                + timedelta(days=7)
            )                                                # Next Monday
            end = start + timedelta(days=6)      

        elif value == "this_month":
            start = today
            last_day = monthrange(today.year, today.month)[1]
            end = today.replace(day=last_day)

        elif value == "next_month":

            if today.month == 12:
                year = today.year + 1
                month = 1
            else:
                year = today.year
                month = today.month + 1

            start = today.replace(year=year, month=month, day=1)
            last_day = monthrange(year, month)[1]
            end = start.replace(day=last_day)

        elif value == "next_3_months":
            start = today
            end = today + timedelta(days=90)

        else:
            return queryset

        return queryset.filter(
            departures__departure_date__range=(start, end)
        )