from celery import shared_task

from agency.models import Tour

from .services import (
    build_tour_payload,
    translate_payload,
    save_translations,
)


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def translate_tour_task(self, tour_id):
    
    tour = (
        Tour.objects
        .prefetch_related(
            "hotels",
            "itinerary",
            "included_items",
            "excluded_items",
        )
        .get(id=tour_id)
    )

    payload = build_tour_payload(tour)

    translations = translate_payload(payload)

    for language, translated in translations.items():

        save_translations(
            tour=tour,
            translated=translated,
            language=language,
        )