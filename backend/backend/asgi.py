"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()
from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from agency.routing import websocket_urlpatterns
from agency.middleware import JWTAuthMiddleware
from channels.security.websocket import OriginValidator

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": OriginValidator(
        JWTAuthMiddleware(
            URLRouter(websocket_urlpatterns),
        ),
        [
            "https://wanderly-ebon.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
    ),
})