from __future__ import annotations

from datetime import datetime, timedelta

from argon2 import PasswordHasher
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import ENVIRONMENT
from app.db import Base, SessionLocal, engine, get_db
from app.models import AISummary, AuditLog, CareTask, CheckIn, ConsentRecord, ElderlyProfile, EscalationEvent, Notification, User
from app.schemas import (
    AIChatRequest,
    AIChatResponse,
    CheckInCreate,
    CheckInResponse,
    DailySummaryRequest,
    ElderlyProfileCreate,
    LoginRequest,
    TaskCreate,
    UserCreate,
    UserOut,
)
from app.services.ai import generate_daily_summary, safe_ai_response

ph = PasswordHasher()
app = FastAPI(title="CareBridge AI API", version="0.1.0", description="Demo backend for the CareBridge AI elderly care coordination platform.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def user_to_schema(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        preferred_language=user.preferred_language,
        is_active=user.is_active,
    )


def create_demo_user(db: Session, email: str, full_name: str, role: str, password: str, language: str = "zh-Hant") -> User:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return existing
    user = User(
        email=email,
        password_hash=ph.hash(password),
        full_name=full_name,
        role=role,
        preferred_language=language,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    if role == "elderly":
        elder_profile = ElderlyProfile(
            user_id=user.id,
            full_name=full_name,
            preferred_language=language,
            emergency_contact="David Lin",
            consent_status="granted",
        )
        db.add(elder_profile)
    if role == "family":
        db.add(ConsentRecord(user_id=user.id, version="v1.0", granted=True, summary="Family consent for routine updates and care coordination."))
    db.add(Notification(user_id=user.id, message=f"Welcome to CareBridge AI, {full_name}.", kind="welcome", delivery_status="sent"))
    db.add(AuditLog(user_id=user.id, action="account_created", details=f"{role} account created"))
    db.commit()
    return user


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "environment": ENVIRONMENT}


@app.post("/api/auth/register", response_model=UserOut)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> UserOut:
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")
    user = create_demo_user(db, payload.email, payload.full_name, payload.role, payload.password, payload.preferred_language)
    return user_to_schema(user)


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not ph.verify(user.password_hash, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    return {"access_token": "demo-token", "token_type": "bearer", "user": user_to_schema(user).model_dump()}


@app.post("/api/auth/logout")
def logout() -> dict:
    return {"status": "logged_out"}


@app.get("/api/auth/me")
def get_me(authorization: str | None = Header(default=None, alias="Authorization"), db: Session = Depends(get_db)) -> dict:
    if authorization and authorization.startswith("Bearer "):
        email = "elderly@demo.com"
        user = db.query(User).filter(User.email == email).first()
        if user:
            return {"user": user_to_schema(user).model_dump()}
    fallback = db.query(User).first()
    if not fallback:
        user = create_demo_user(db, "elderly@demo.com", "Mrs. Lin", "elderly", "carebridge123")
        return {"user": user_to_schema(user).model_dump()}
    return {"user": user_to_schema(fallback).model_dump()}


@app.get("/api/elderly")
def list_elderly(db: Session = Depends(get_db)) -> list[dict]:
    elders = db.query(User).filter(User.role == "elderly").all()
    return [user_to_schema(elder).model_dump() for elder in elders]


@app.post("/api/elderly")
def create_elderly(payload: ElderlyProfileCreate, db: Session = Depends(get_db)) -> dict:
    email = f"{payload.full_name.lower().replace(' ', '')}@demo.com"
    user = create_demo_user(db, email, payload.full_name, "elderly", "carebridge123", payload.preferred_language or "zh-Hant")
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.user_id == user.id).first()
    if not profile:
        db.add(ElderlyProfile(user_id=user.id, full_name=user.full_name, preferred_language=user.preferred_language, emergency_contact=payload.emergency_contact, consent_status=payload.consent_status or "granted"))
    db.commit()
    return {"id": str(user.id), "full_name": user.full_name, "preferred_language": user.preferred_language}


@app.get("/api/elderly/{elder_id}")
def get_elderly(elder_id, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.id == elder_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Elder profile not found")
    return {"id": str(user.id), "full_name": user.full_name, "role": user.role, "preferred_language": user.preferred_language}


@app.patch("/api/elderly/{elder_id}")
def patch_elderly(elder_id, payload: ElderlyProfileCreate, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.id == elder_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Elder profile not found.")
    user.full_name = payload.full_name or user.full_name
    user.preferred_language = payload.preferred_language or user.preferred_language
    db.commit()
    return {"status": "updated", "id": str(user.id), "full_name": user.full_name}


@app.post("/api/checkins", response_model=dict)
def create_checkin(payload: CheckInCreate, db: Session = Depends(get_db)) -> dict:
    checkin = CheckIn(
        user_id=payload.user_id,
        scheduled_for=payload.scheduled_for,
        status="pending",
        response_text=payload.response_text,
        mood=payload.mood,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return {"id": str(checkin.id), "status": checkin.status, "scheduled_for": checkin.scheduled_for.isoformat()}


@app.get("/api/checkins")
def list_checkins(db: Session = Depends(get_db)) -> list[dict]:
    items = db.query(CheckIn).all()
    return [{"id": str(item.id), "user_id": str(item.user_id), "status": item.status, "mood": item.mood, "scheduled_for": item.scheduled_for.isoformat()} for item in items]


@app.post("/api/checkins/{checkin_id}/respond")
def respond_to_checkin(checkin_id: str, payload: CheckInResponse, db: Session = Depends(get_db)) -> dict:
    checkin = db.query(CheckIn).filter(CheckIn.id == checkin_id).first()
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in not found")
    checkin.response_text = payload.response_text
    checkin.mood = payload.mood or checkin.mood
    checkin.status = "completed"
    checkin.updated_at = datetime.utcnow()
    db.add(AuditLog(user_id=checkin.user_id, action="checkin_response", details=payload.response_text))
    db.commit()
    return {"id": str(checkin.id), "status": "completed", "response_text": payload.response_text}


@app.get("/api/checkins/{checkin_id}")
def get_checkin(checkin_id: str, db: Session = Depends(get_db)) -> dict:
    checkin = db.query(CheckIn).filter(CheckIn.id == checkin_id).first()
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in not found")
    return {"id": str(checkin.id), "status": checkin.status, "response_text": checkin.response_text, "mood": checkin.mood}


@app.post("/api/tasks")
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> dict:
    task = CareTask(
        title=payload.title,
        description=payload.description,
        assignee_id=str(payload.assignee_id) if payload.assignee_id else None,
        due_date=payload.due_date,
        status=payload.status,
        notes=payload.notes,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"id": str(task.id), "title": task.title, "status": task.status}


@app.get("/api/tasks")
def list_tasks(db: Session = Depends(get_db)) -> list[dict]:
    tasks = db.query(CareTask).all()
    return [{"id": str(task.id), "title": task.title, "status": task.status, "due_date": task.due_date.isoformat() if task.due_date else None} for task in tasks]


@app.patch("/api/tasks/{task_id}")
def update_task(task_id: str, payload: TaskCreate, db: Session = Depends(get_db)) -> dict:
    task = db.query(CareTask).filter(CareTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = payload.title or task.title
    task.description = payload.description or task.description
    task.status = payload.status or task.status
    task.notes = payload.notes or task.notes
    if payload.due_date:
        task.due_date = payload.due_date
    db.commit()
    return {"status": "updated", "id": str(task.id)}


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)) -> dict:
    task = db.query(CareTask).filter(CareTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"status": "deleted", "id": task_id}


@app.post("/api/ai/chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest) -> AIChatResponse:
    reply = safe_ai_response(payload.message, role=payload.role, language=payload.language)
    return AIChatResponse(response=reply, mode="demo")


@app.post("/api/ai/summarize")
def summarize(payload: DailySummaryRequest) -> dict:
    summary = generate_daily_summary(payload.summary, checkin_time=datetime.utcnow().strftime("%I:%M %p"))
    return {"summarized": summary}


@app.get("/api/notifications")
def list_notifications(db: Session = Depends(get_db)) -> list[dict]:
    notifications = db.query(Notification).all()
    return [{"id": str(item.id), "message": item.message, "kind": item.kind, "delivery_status": item.delivery_status, "acknowledged": item.acknowledged} for item in notifications]


@app.post("/api/notifications/{notification_id}/acknowledge")
def acknowledge_notification(notification_id: str, db: Session = Depends(get_db)) -> dict:
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.acknowledged = True
    notification.delivery_status = "acknowledged"
    db.commit()
    return {"status": "acknowledged", "id": notification_id}


@app.get("/api/escalations")
def list_escalations(db: Session = Depends(get_db)) -> list[dict]:
    events = db.query(EscalationEvent).all()
    return [{"id": str(item.id), "reason": item.reason, "acknowledged": item.acknowledged} for item in events]


@app.post("/api/escalations/{escalation_id}/acknowledge")
def acknowledge_escalation(escalation_id: str, db: Session = Depends(get_db)) -> dict:
    event = db.query(EscalationEvent).filter(EscalationEvent.id == escalation_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Escalation not found")
    event.acknowledged = True
    db.commit()
    return {"status": "acknowledged", "id": escalation_id}


@app.get("/api/admin/analytics")
def admin_analytics(db: Session = Depends(get_db)) -> dict:
    total_users = db.query(User).count()
    elderly_users = db.query(User).filter(User.role == "elderly").count()
    family_accounts = db.query(User).filter(User.role == "family").count()
    caregivers = db.query(User).filter(User.role == "caregiver").count()
    active_check_ins = db.query(CheckIn).filter(CheckIn.status == "completed").count()
    pending_notifications = db.query(Notification).filter(Notification.delivery_status == "pending").count()
    unacknowledged_escalations = db.query(EscalationEvent).filter(EscalationEvent.acknowledged.is_(False)).count()
    task_completion_rate = round((db.query(CareTask).filter(CareTask.status == "completed").count() / max(db.query(CareTask).count(), 1)) * 100, 2)
    return {
        "total_users": total_users,
        "elderly_users": elderly_users,
        "family_accounts": family_accounts,
        "caregivers": caregivers,
        "active_check_ins": active_check_ins,
        "pending_notifications": pending_notifications,
        "unacknowledged_escalations": unacknowledged_escalations,
        "task_completion_rate": task_completion_rate,
    }


@app.get("/api/admin/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)) -> list[dict]:
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(20).all()
    return [{"id": log.id, "action": log.action, "details": log.details, "created_at": log.created_at.isoformat()} for log in logs]


@app.on_event("startup")
def seed_demo_data() -> None:
    with SessionLocal() as db:
        admin = db.query(User).filter(User.email == "admin@demo.com").first()
        if not admin:
            create_demo_user(db, "admin@demo.com", "Admin User", "admin", "carebridge123", "en")
        if not db.query(User).filter(User.email == "elderly@demo.com").first():
            create_demo_user(db, "elderly@demo.com", "Mrs. Lin", "elderly", "carebridge123", "zh-Hant")
        if not db.query(User).filter(User.email == "family@demo.com").first():
            create_demo_user(db, "family@demo.com", "David Lin", "family", "carebridge123", "en")
        if not db.query(User).filter(User.email == "caregiver@demo.com").first():
            create_demo_user(db, "caregiver@demo.com", "Anna Chen", "caregiver", "carebridge123", "zh-Hant")

        if not db.query(CheckIn).count():
            checkin = CheckIn(user_id=db.query(User).filter(User.email == "elderly@demo.com").first().id, scheduled_for=datetime.utcnow() + timedelta(hours=1), status="completed", response_text="Feeling comfortable today.", mood="happy")
            db.add(checkin)
        if not db.query(CareTask).count():
            caregiver = db.query(User).filter(User.email == "caregiver@demo.com").first()
            db.add(
                CareTask(
                    title="Morning wellness check",
                    description="Check-in with Mrs. Lin",
                    assignee_id=caregiver.id,
                    due_date=datetime.utcnow() + timedelta(days=1),
                    status="pending",
                )
            )
        if not db.query(Notification).count():
            user = db.query(User).filter(User.email == "elderly@demo.com").first()
            db.add(Notification(user_id=user.id, message="Family call requested", kind="checkin", delivery_status="pending"))
        if not db.query(EscalationEvent).count():
            user = db.query(User).filter(User.email == "elderly@demo.com").first()
            db.add(EscalationEvent(user_id=user.id, reason="Missed check-in requires acknowledgment.", acknowledged=False))
        if not db.query(AISummary).count():
            user = db.query(User).filter(User.email == "elderly@demo.com").first()
            db.add(AISummary(user_id=user.id, summary="User reported feeling comfortable and requested family contact.", source="demo"))
        db.commit()


seed_demo_data()


@app.get("/")
def root() -> dict:
    return {"project": "CareBridge AI", "status": "running", "demo_mode": True}
