from django.contrib.sitemaps import Sitemap
from django.conf import settings
from agency.models import Tour


class StaticViewSitemap(Sitemap):
    priority = 1.0
    changefreq = "weekly"

    def items(self):
        return [
            "",
            "/search",
            "/login",
            "/register",
        ]

    def location(self, item):
        return f"{settings.SITE_URL}{item}"


class TourSitemap(Sitemap):
    priority = 0.9
    changefreq = "daily"

    def items(self):
        return Tour.objects.filter(status="published")

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"{settings.SITE_URL}/details/{obj.pk}"