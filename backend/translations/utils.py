from django.db.models import Model

SUPPORTED_LANGUAGES = (
    ("en", "English"),
    ("ru", "Russian"),
    ("uz", "Uzbek"),
)


def get_translation(instance: Model, language: str):
    """
    Return translated object for requested language.
    """

    if language not in ["en", "ru", "uz"]:
        return None

    return instance.translations.filter(
        language=language
    ).first()