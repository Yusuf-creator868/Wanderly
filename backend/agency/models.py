from django.db import models
from django.utils.text import slugify
from django.conf import settings
import uuid
from django.core.validators import RegexValidator
from django.contrib.postgres.indexes import GinIndex

class Agency(models.Model):
    
    PLAN_CHOICES = [
        ("free", "Free"),
        ("starter", "Starter"),
        ("pro", "Pro"),
        ("enterprise", "Enterprise"),
    ]
    
    VERIFICATION_STATUS = [
        ("pending", "Pending"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    ]
    
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="agency")
    agency_name = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(
        unique=True,
    )
    logo = models.ImageField(
        upload_to="img",
        blank=True,
        null=True
    )
    description = models.TextField(
        blank=True,
        null=True
    )
    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )
    email = models.EmailField(
        blank=True,
        null=True
    )
    telegram = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    telegram_chat_id = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    instagram = models.URLField(blank=True, null=True)
    address = models.TextField(
        blank=True,
        null=True
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    country = models.CharField(
        max_length=100,
        default="Uzbekistan"
    )
    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default="free"
    )
    published = models.BooleanField(
        default=False
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS,
        default="pending"
    )
    is_active = models.BooleanField(
        default=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        ordering = ["-created_at"]
    
    
    def __str__(self):
        return f'{self.agency_name}'
    
    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.agency_name)
            unique_slug = self.slug
            counter = 1
            while Agency.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{self.slug}-{counter}"
                counter += 1
            self.slug = unique_slug

        super().save(*args, **kwargs)
    
    
    
    

# Tour -------------------->

class Tour(models.Model):
    
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("ru", "Russian"),
        ("uz", "Uzbek"),
    ]
    
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
    ]
    
    CATEGORY = [
        ("luxury", "Luxury"),
        ("adventure", "Adventure"),
        ("beach", "Beach"),
        ("honeymoon", "Honeymoon"),
        ("family", "Family"),
        ("cultural", "Cultural"),
    ]
    id = models.UUIDField( primary_key=True, default=uuid.uuid4, editable=False )
    source_language = models.CharField( max_length=2, choices=LANGUAGE_CHOICES, default="en", )
    
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    
    from_country = models.CharField(max_length=100, blank=True)
    from_city = models.CharField(max_length=100, blank=True)
    
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    category = models.CharField( max_length=20, choices=CATEGORY, default="family" )


    duration = models.PositiveIntegerField(null=True, blank=True)
    nights = models.PositiveIntegerField(null=True, blank=True)
    cover_image = models.ImageField(upload_to="cover", null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    
    flight_included = models.BooleanField(default=False)
    meals_included = models.BooleanField(default=False)
    hotel_included = models.BooleanField(default=True)
    car = models.BooleanField(default=False)
    guide_included = models.BooleanField(default=False)
    rating = models.DecimalField( max_digits=2, decimal_places=1, default=0 )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            GinIndex(
                name='country_trgm',
                fields=['country'],
                opclasses=['gin_trgm_ops']
            ),
            GinIndex(
                name='city_trgm',
                fields=['city'],
                opclasses=['gin_trgm_ops']
            ),
            GinIndex(
                name='title_trgm',
                fields=['title'],
                opclasses=['gin_trgm_ops']
            ),
            models.Index(fields=['country']),
            models.Index(fields=['city']),
            models.Index(fields=['category']),
            models.Index(fields=['flight_included']),
        ]
    
    def __str__(self):
        return f'Tour {self.title} from {self.agency} agency'
    
    
class Included(models.Model):

    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name="included_items"
    )

    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title
    
    
class Excluded(models.Model):

    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name="excluded_items"
    )

    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    
    
class TourImage(models.Model):
    tour = models.ForeignKey( Tour, on_delete=models.CASCADE, related_name="images" )
    image = models.ImageField(upload_to="gallery")
    
    
    
    

# Hotel -------------------->

class Hotel(models.Model):
    
    MEAL_PLAN_CHOICES = [
    ("breakfast", "Breakfast Only"),
    ("half_board", "Half Board"),
    ("full_board", "Full Board"),
    ("all_inclusive", "All Inclusive"),
]

    tour = models.ForeignKey( Tour, on_delete=models.CASCADE, related_name="hotels" )

    name = models.CharField(max_length=255, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)

    stars = models.PositiveIntegerField( blank=True, null=True )

    room_type = models.CharField( max_length=255, blank=True, null=True )

    meal_plan = models.CharField( max_length=50, choices=MEAL_PLAN_CHOICES, blank=True, null=True )

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['price']),
            models.Index(fields=['stars']),
            models.Index(fields=['meal_plan']),
        ]

    def __str__(self):
        return self.name
    
    
    
    
class HotelImage(models.Model):

    hotel = models.ForeignKey( Hotel, on_delete=models.CASCADE, related_name="images" )
    cover_image = models.ImageField(upload_to="hotel_images", null=True, blank=True)
    image = models.ImageField( upload_to="hotel_images", null=True, blank=True)
    
    
    


# Itinerary ------------------->

class Itinerary(models.Model):
    tour = models.ForeignKey( Tour, on_delete=models.CASCADE, related_name="itinerary" )

    day_number = models.PositiveIntegerField(null=True, blank=True)

    title = models.CharField(max_length=255, blank=True)

    description = models.TextField(blank=True)
    
    
    
    
    
 
# Departure ------------------->
    
class Departure(models.Model):
    tour = models.ForeignKey( Tour, on_delete=models.CASCADE, related_name="departures" )

    departure_date = models.DateField(null=True, blank=True)
    departure_time = models.TimeField(null=True, blank=True)
    
    return_date = models.DateField(null=True, blank=True)
    return_time = models.TimeField(null=True, blank=True)
    
    available_seats = models.PositiveIntegerField(null=True, blank=True)


    
    class Meta:
        indexes = [
            models.Index(fields=['departure_date']),
        ]


class TourView(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="tour_views")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'User {self.user} viewed tour {self.tour}'


class Review(models.Model):

    RATING_CHOICES = [
        (1, "1 Star"),
        (2, "2 Stars"),
        (3, "3 Stars"),
        (4, "4 Stars"),
        (5, "5 Stars"),
    ]

    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    rating = models.PositiveIntegerField(
        choices=RATING_CHOICES
    )

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} review for {self.tour}"