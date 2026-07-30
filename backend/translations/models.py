from django.db import models
from .utils import SUPPORTED_LANGUAGES
from agency.models import ( Tour, Included, Excluded, )





# --------------------------------------------------
# Tour
# --------------------------------------------------

class TourTranslation(models.Model):

    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name="translations",
    )

    language = models.CharField(
        max_length=2,
        choices=SUPPORTED_LANGUAGES,
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )
    
    country = models.CharField(
        max_length=120,
        blank=True,
    )

    city = models.CharField(
        max_length=120,
        blank=True,
    )

    class Meta:
        unique_together = ("tour", "language")
        ordering = ["language"]

    def __str__(self):
        return f"{self.tour.title} ({self.language})"





# --------------------------------------------------
# Included
# --------------------------------------------------

class IncludedTranslation(models.Model):

    included = models.ForeignKey(
        Included,
        on_delete=models.CASCADE,
        related_name="translations",
    )

    language = models.CharField(
        max_length=2,
        choices=SUPPORTED_LANGUAGES,
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    class Meta:
        unique_together = ("included", "language")
        ordering = ["language"]

    def __str__(self):
        return f"{self.included.title} ({self.language})"


# --------------------------------------------------
# Excluded
# --------------------------------------------------

class ExcludedTranslation(models.Model):

    excluded = models.ForeignKey(
        Excluded,
        on_delete=models.CASCADE,
        related_name="translations",
    )

    language = models.CharField(
        max_length=2,
        choices=SUPPORTED_LANGUAGES,
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    class Meta:
        unique_together = ("excluded", "language")
        ordering = ["language"]

    def __str__(self):
        return f"{self.excluded.title} ({self.language})"