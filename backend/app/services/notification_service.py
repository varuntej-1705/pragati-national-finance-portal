from typing import Dict, Any, List

class NotificationService:
    @staticmethod
    async def send_sms_alert(phone: str, message: str) -> bool:
        # Mock or Twilio/MSG91 fallback
        return True

    @staticmethod
    async def send_push_notification(device_token: str, title: str, body: str) -> bool:
        # FCM integration stub
        return True
