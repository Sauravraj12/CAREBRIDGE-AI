from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    preferred_language = Column(String(50), default="zh-Hant")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    consent_records = relationship("ConsentRecord", back_populates="user")
    checkins = relationship("CheckIn", back_populates="user")


class ElderlyProfile(Base):
    __tablename__ = "elderly_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    preferred_language = Column(String(50), default="zh-Hant")
    emergency_contact = Column(String(255))
    consent_status = Column(String(50), default="granted")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FamilyRelationship(Base):
    __tablename__ = "family_relationships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    elder_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    family_member_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    relationship = Column(String(100), default="family")
    created_at = Column(DateTime, default=datetime.utcnow)


class CaregiverProfile(Base):
    __tablename__ = "caregiver_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization = Column(String(255), default="CareBridge")
    specialty = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    version = Column(String(50), nullable=False)
    granted = Column(Boolean, default=True)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="consent_records")


class CheckIn(Base):
    __tablename__ = "checkin_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    scheduled_for = Column(DateTime, nullable=False)
    status = Column(String(50), default="pending")
    response_text = Column(Text)
    mood = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="checkins")


class CareTask(Base):
    __tablename__ = "care_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    due_date = Column(DateTime)
    status = Column(String(50), default="pending")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    kind = Column(String(100), default="info")
    delivery_status = Column(String(50), default="pending")
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class EscalationEvent(Base):
    __tablename__ = "escalation_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    summary = Column(Text, nullable=False)
    source = Column(String(255), default="system")
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(255), nullable=False)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
