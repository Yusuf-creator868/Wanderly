from celery import shared_task
from django.utils import timezone
from agency.models import Departure, Tour


@shared_task
def delete_expired_departures():

    today = timezone.localdate()

    deleted, _ = Departure.objects.filter(
        departure_date__lt=today
    ).delete()
    
        # Delete tours that no longer have any departures
    unpublished = Tour.objects.filter(
        departures__isnull=True,
        status="published",
    ).update(status="draft")

    print(f"Deleted {deleted} departures")
    print(f"Unpublished tours: {unpublished}")

    return deleted