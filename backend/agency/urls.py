from django.urls import path
from .views import *

urlpatterns = [
    path("my-agency/", my_agency),
    path("agency/bookings/", get_agency_bookings),
    path("agency/bookings/<int:booking_id>/approve/", approve_booking),
    path("agency/bookings/<int:booking_id>/cancel/", cancel_booking),
    
    
    path("agency/<slug:slug>/", agencyinfo),
    path('create_tour/', create_tour),
    
    path('tour_info/<uuid:pk>/', tour_info),
    path('upload_images/<uuid:pk>/', upload_images),
    path("tour-images/<int:pk>/delete/", delete_tour_image),
    
    path('create_hotel/<uuid:pk>/', create_hotel),
    path("hotels/<int:pk>/", update_hotel),
    path("hotels/<int:pk>/delete/", delete_hotel),
    path("hotel-images/<int:pk>/delete/", delete_hotel_image),
    
    path('create_itinerary/<uuid:pk>/', create_itinerary),
    path("itinerary/<int:pk>/", update_itinerary),
    path("itinerary/<int:pk>/delete/", delete_itinerary),

    path('create_departure/<uuid:pk>/', create_departure),
    path("departures/<int:pk>/", update_departure),
    path("departures/<int:pk>/delete/", delete_departure),
    
    path('publish_tour/<uuid:pk>/publish/', publish_tour_view),
    
    path('get_agency_tour/', get_agency_tour),
    path('delete_tour/<uuid:pk>', delete_tour),
    path('get_mytour_data', get_mytour_data),
    path('get_tour/<uuid:pk>/', get_tour),
    path('tour_details/<uuid:pk>/', tour_details),
    
    
    
]