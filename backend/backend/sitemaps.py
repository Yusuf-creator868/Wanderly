from django.contrib.sitemaps import Sitemap
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
        return item


class TourSitemap(Sitemap):
    priority = 0.9
    changefreq = "daily"

    def items(self):
        return Tour.objects.filter(status="published")

    def lastmod(self, obj):
        return obj.created_at

    def location(self, obj):
        return f"/details/{obj.pk}"