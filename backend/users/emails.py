import resend
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

resend.api_key = settings.RESEND_API_KEY


def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

    resend.Emails.send({
        "from": "Wanderly <noreply@wanderly.uz>",  # switch to your verified domain later, e.g. "noreply@yourapp.com"
        "to": [user.email],
        "subject": "Verify your email",
        "html": f"""
            <p>Hi {user.username},</p>
            <p>Click the link below to verify your account:</p>
            <p><a href="{verify_link}">{verify_link}</a></p>
        """,
    })