from openai import OpenAI
from django.conf import settings
from django.db import transaction
from .models import (
    TourTranslation,
    IncludedTranslation,
    ExcludedTranslation,
)


from agency.models import (
    Included,
    Excluded,
)

import json
from .utils import SUPPORTED_LANGUAGES


client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)



# translations/services.py

def build_tour_payload(tour):
    """
    Convert a Tour into a JSON object for OpenAI.
    """
    print("TITLE:", repr(tour.title))
    print("DESCRIPTION:", repr(tour.description))

    return {
        "title": tour.title,
        "description": tour.description,
        "country": tour.country,
        "city": tour.city,


        "included": [
            {
                "id": item.id,
                "title": item.title,
            }
            for item in tour.included_items.all()
        ],

        "excluded": [
            {
                "id": item.id,
                "title": item.title,
            }
            for item in tour.excluded_items.all()
        ],

    }
    
    
def translate_payload(payload):
    """
    Translate the complete tour into English, Russian and Uzbek.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={"type": "json_object"},
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """
You are a professional tourism translator.

Translate the provided tour into ALL THREE languages:
- English (en)
- Russian (ru)
- Uzbek (uz)

Return ONLY valid JSON in exactly this format:

{
  "en": {
    "title": "",
    "description": "",
    "country": "",
    "city": "",
    "included": [
      {
        "id": 1,
        "title": ""
      }
    ],
    "excluded": [
      {
        "id": 1,
        "title": ""
      }
    ]
  },

  "ru": {
    "title": "",
    "description": "",
    "country": "",
    "city": "",
    "included": [],
    "excluded": []
  },

  "uz": {
    "title": "",
    "description": "",
    "country": "",
    "city": "",
    "included": [],
    "excluded": []
  }
}

Rules:

- Translate every text field.
- Keep all ids exactly the same.
- Never rename JSON keys.
- Never change the JSON structure.

- Hotel names, company names and people's names MUST NOT be translated.

- Country names MUST be translated into their standard localized names.
  Example:
  Turkey → Турция → Turkiya
  Germany → Германия → Germaniya

- City names should use the standard localized spelling for each language.
  Example:
  Moscow → Москва → Moskva
  Paris → Париж → Parij
  Istanbul → Стамбул → Istanbul

- Use official, commonly used geographic names.
- Use natural tourism language.
- Return JSON only.
"""
            },
            {
                "role": "user",
                "content": json.dumps(
                    payload,
                    ensure_ascii=False,
                ),
            },
        ],
    )

    return json.loads(
        response.choices[0].message.content
    )
    
    
    
def save_translations( tour, translated, language, ):
    """
    Save translated JSON into translation tables.
    """
    

    # -------------------------------------------------
    # TOUR
    # -------------------------------------------------

    TourTranslation.objects.update_or_create(
        tour=tour,
        language=language,
        defaults={
            "title": translated.get("title", ""),
            "description": translated.get("description", ""),
            "country": translated.get("country", ""),
            "city": translated.get("city", ""),
        },
    )





    for item in translated.get("included", []):

        included = Included.objects.get(
            id=item["id"],
            tour = tour,
        )

        IncludedTranslation.objects.update_or_create(
            included=included,
            language=language,
            defaults={
                "title": item["title"],
            },
        )

    # -------------------------------------------------
    # EXCLUDED
    # -------------------------------------------------

    for item in translated.get("excluded", []):

        excluded = Excluded.objects.get(
            id=item["id"],
            tour = tour,
        )

        ExcludedTranslation.objects.update_or_create(
            excluded=excluded,
            language=language,
            defaults={
                "title": item["title"],
            },
        )

    # -------------------------------------------------
    # ITINERARY
    # -------------------------------------------------


    


@transaction.atomic
def publish_tour(tour):
    from .tasks import translate_tour_task

    tour.status = "published"

    tour.save(update_fields=["status"])

    translate_tour_task.delay(str(tour.id))

    return tour