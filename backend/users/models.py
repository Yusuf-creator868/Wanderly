from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from agency.models import *

class Users(AbstractUser):

    ROLE_CHOICES = [
    ("admin", "Admin"),
    ("traveler", "Traveler"),
    ("agency", "Agency"),
]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="traveler"
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)   # <-- add this
    is_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    def __str__(self):
        return f'{self.username}'
    
    
class FavoriteCart(models.Model):
    fav_code = models.CharField(max_length=11, unique=True)

    def __str__(self):
        return self.fav_code
    

class FavoriteItems(models.Model):
    favcart = models.ForeignKey(FavoriteCart, related_name="items", on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} * {self.homes.district} in favcart {self.favcart.id}"
    
    
# -----------------------------
#  Booking system
# -----------------------------
    
class Booking(models.Model):

    STATUS = [
        ("pending", "Pending"),
        # ("paid", "Paid"),
        ("cancelled", "Cancelled"),
        ("confirmed", "Confirmed"),
    ]

    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    departure = models.ForeignKey(Departure, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)

    travelers = models.PositiveIntegerField(default=1)

    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    
    
class BookingTraveler(models.Model):

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="travelers_info"
    )

    full_name = models.CharField(max_length=255)
    passport_number = models.CharField(max_length=100)
    birth_date = models.DateField()

    nationality = models.CharField(max_length=100)
    
    
class Payment(models.Model):

    STATUS = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    provider = models.CharField(max_length=50)

    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)