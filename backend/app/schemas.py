from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "family"
    preferred_language: str = "zh-Hant"


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    preferred_language: str
    is_active: bool


class LoginRequest(BaseModel):
    email: str
    password: str


class ElderlyProfileCreate(BaseModel):
    full_name: str
    preferred_language: Optional[str] = "zh-Hant"
    emergency_contact: Optional[str] = None
    consent_status: Optional[str] = "granted"


class CheckInCreate(BaseModel):
    user_id: UUID
    scheduled_for: datetime
    response_text: Optional[str] = None
    mood: Optional[str] = None


class CheckInResponse(BaseModel):
    response_text: str
    mood: Optional[str] = None


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    status: str = "pending"
    notes: Optional[str] = None


class NotificationAck(BaseModel):
    id: UUID


class AIChatRequest(BaseModel):
    message: str
    role: str = "elderly"
    language: str = "zh-Hant"


class AIChatResponse(BaseModel):
    response: str
    mode: str = "demo"


class DailySummaryRequest(BaseModel):
    user_id: UUID
    summary: str


class AnalyticsResponse(BaseModel):
    total_users: int
    elderly_users: int
    family_accounts: int
    caregivers: int
    active_check_ins: int
    pending_notifications: int
    unacknowledged_escalations: int
    task_completion_rate: float
