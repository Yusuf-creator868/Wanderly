from translations.utils import get_translation


class TranslationMixin:

    def get_translated_field(self, obj, field):

        request = self.context.get("request")

        if not request:
            return getattr(obj, field)

        lang = request.query_params.get("lang", "en")

        translation = get_translation(obj, lang)

        if translation:
            value = getattr(translation, field, None)
            if value:
                return value

        # Fallback to original database value
        return getattr(obj, field)