from django.contrib import admin

from .models import (
    TourTranslation,

    IncludedTranslation,
    ExcludedTranslation,

)

admin.site.register(TourTranslation)
admin.site.register(IncludedTranslation)
admin.site.register(ExcludedTranslation)
