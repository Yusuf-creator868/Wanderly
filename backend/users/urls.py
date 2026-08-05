from django.urls import path
from .views import *
from .admin_views import *


urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CusromRefreshTokenView.as_view(), name="token_refresh"),
    path("logout/", logout, name="logout"),
    path("register/", register),
    path("authenticated/", is_authenticated),
    path("add_favorite/", add_favorite),
    path("remove_favorite/", remove_favorite),
    path("get_favorites/", get_favorites),
    path("get_tours/", get_tours),
    path('tour/', tours),
    path('bookings/', booking_tour),
    path('get_tour_details_users/<uuid:pk>/', get_tour_details_users),
    path("user-info/", post_user_info),
    path("booking_detail/", my_bookings),
    path("google-login/", google_login),
    path("verify-email/<str:uid>/<str:token>/", verify_email, name="verify-email"),
    
]

urlpatterns += [

    path("admin/dashboard/", dashboard),

    path("admin/users/", get_users),

    path("admin/agencies/", get_agencies),
    
    path( "admin/agencies/<int:pk>/verification/", change_agency_verification_status),

    path("admin/tours/", get_admin_tours),

    path("admin/bookings/", get_bookings),

]