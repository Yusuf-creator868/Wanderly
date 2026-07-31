from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from django.contrib.auth.models import AnonymousUser
from users.models import Users
from urllib.parse import parse_qs


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        token = None

    # ------------------------
    # 1. Try query parameter
    # ------------------------
        query_string = parse_qs(scope["query_string"].decode())

        token = query_string.get("token", [None])[0]

    # ------------------------
    # 2. Fallback to cookie
    # ------------------------
        if not token:

            headers = dict(scope["headers"])

            cookie_header = headers.get(
                b"cookie",
                b""
            ).decode()

            for c in cookie_header.split("; "):

                if c.startswith("access_token="):
                    token = c.split("=", 1)[1]
                    break

    # ------------------------
    # Authenticate
    # ------------------------

        if token:

            try:
                validated_token = UntypedToken(token)

                user_id = validated_token["user_id"]

                user = await self.get_user(user_id)

                scope["user"] = user

            except (InvalidToken, TokenError):

                scope["user"] = AnonymousUser()

        else:

            scope["user"] = AnonymousUser()

        return await super().__call__(
            scope,
            receive,
            send
        )

    @database_sync_to_async
    def get_user(self, user_id):

        try:
            return Users.objects.get(id=user_id)

        except Users.DoesNotExist:
            return AnonymousUser()