from celery import Celery
from celery.schedules import crontab
import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "backend.settings",
)

app = Celery("backend")

app.config_from_object(
    "django.conf:settings",
    namespace="CELERY",
)

app.autodiscover_tasks()


app.conf.beat_schedule = {
    "delete-expired-departures": {
        "task": "agency.tasks.delete_expired_departures",
        "schedule": crontab(minute="*/30"),
    },
}