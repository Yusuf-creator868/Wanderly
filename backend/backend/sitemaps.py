from django.contrib.sitemaps import Sitemap
from agency.models import Tour
from django.conf import settings


class StaticViewSitemap(Sitemap):
    priority = 1.0
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return [
            "",
            "/search",
            "/login",
            "/register",
        ]

    def location(self, item):
        return item

    def get_urls(self, page=1, site=None, protocol=None):
        urls = super().get_urls(page=page, site=site, protocol=protocol)
        for url in urls:
            url["location"] = f"{settings.SITE_URL}{url['location']}"
        return urls


class TourSitemap(Sitemap):
    priority = 0.9
    changefreq = "daily"
    protocol = "https"

    def items(self):
        return Tour.objects.filter(status="published")

    def lastmod(self, obj):
        return obj.created_at

    def location(self, obj):
        return f"/details/{obj.pk}"

    def get_urls(self, page=1, site=None, protocol=None):
        urls = super().get_urls(page=page, site=site, protocol=protocol)
        for url in urls:
            url["location"] = f"{settings.SITE_URL}{url['location']}"
        return urls