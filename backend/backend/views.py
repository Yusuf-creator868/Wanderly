from django.http import HttpResponse
from agency.models import Tour


def sitemap(request):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    pages = [
        "https://wanderly.uz/",
        "https://wanderly.uz/search",
    ]

    for page in pages:
        xml.append(f"""
        <url>
            <loc>{page}</loc>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>
        """)

    for tour in Tour.objects.filter(status="published"):
        xml.append(f"""
        <url>
            <loc>https://wanderly.uz/details/{tour.pk}</loc>
            <lastmod>{tour.created_at.date()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
        </url>
        """)

    xml.append("</urlset>")

    return HttpResponse(
        "\n".join(xml),
        content_type="application/xml",
    )