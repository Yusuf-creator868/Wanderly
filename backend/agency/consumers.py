import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class AgencyDashboard(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        agency_id = await self.get_agency_id()

        self.group_name = f"agency_{agency_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

    @database_sync_to_async
    def get_agency_id(self):
        return self.user.agency.id

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        pass

    async def new_booking(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_booking",
            "booking": event["booking"],
        }))