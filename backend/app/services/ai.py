from __future__ import annotations

import re
from datetime import datetime


def safe_ai_response(message: str, role: str = "elderly", language: str = "zh-Hant") -> str:
    text = message.strip()
    if not text:
        return "請告訴我您今天想做什麼，我可以幫您聯絡家人、提醒任務或協助簡單日常安排。" if language == "zh-Hant" else "Please tell me what you need today. I can help with family contact, reminders, or simple daily assistance."

    lowered = text.lower()
    if any(keyword in lowered for keyword in ["help", "unsafe", "urgent", "trouble", "feeling unwell", "pain", "hurt", "dizzy"]):
        return "我很在意您的需求。若您現在有緊急狀況，請立即聯絡緊急服務或您信任的家人。若您需要人類協助，我可以協助建立聯絡請求。" if language == "zh-Hant" else "I want to take this seriously. If this is an emergency, please contact emergency services or a trusted family member right away. If you want human assistance, I can help create a contact request."

    if any(keyword in lowered for keyword in ["lonely", "sad", "alone", "miss family"]):
        return "謝謝您分享。您想要我幫您聯絡家人，或是安排一個簡單的陪伴提醒嗎？" if language == "zh-Hant" else "Thank you for sharing that. Would you like me to help you contact a family member or set a simple companionship reminder?"

    if any(keyword in lowered for keyword in ["check-in", "feeling", "how are you"]):
        return "感謝您與我分享。今天的狀態已記錄，若您願意，我可以幫您安排家人通知或簡單提醒。" if language == "zh-Hant" else "Thank you for sharing that. Your check-in has been recorded; I can also help schedule a family notification or a simple reminder."

    if re.search(r"(family|daughter|son|wife|husband|home)", lowered):
        return "我可以協助建立家人聯絡請求，並在您確認後通知授權聯絡人。" if language == "zh-Hant" else "I can help create a family-contact request and notify an authorized contact after your confirmation."

    return "我已記住您的訊息。若您想聯絡家人、查看今天的提醒或請求協助，我可以幫您處理。" if language == "zh-Hant" else "I have noted your message. If you want to contact family, review reminders, or request help, I can help with that."


def generate_daily_summary(user_response: str, checkin_time: str | None = None) -> str:
    summary_lines = [
        "DAILY CARE SUMMARY",
        f"- Check-in completed at {checkin_time or datetime.utcnow().strftime('%H:%M %p')}",
        "- User statement recorded from direct interaction.",
        f"- User shared: {user_response}",
        "- System event: reminder and follow-up workflow remain active.",
        "- Outcome: family visibility is limited to authorized contacts and consent rules.",
        "- Uncertainty noted where a user response is brief or unclear.",
    ]
    return "\n".join(summary_lines)
