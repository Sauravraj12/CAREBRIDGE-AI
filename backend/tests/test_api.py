from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_auth_demo_login():
    response = client.post("/api/auth/login", json={"email": "elderly@demo.com", "password": "carebridge123"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["user"]["role"] == "elderly"


def test_ai_chat_reply():
    response = client.post("/api/ai/chat", json={"message": "I feel lonely", "role": "elderly", "language": "zh-Hant"})
    assert response.status_code == 200
    assert "家人" in response.json()["response"] or "family" in response.json()["response"].lower()


def test_admin_metrics():
    response = client.get("/api/admin/analytics")
    assert response.status_code == 200
    metrics = response.json()
    assert metrics["total_users"] >= 1
    assert metrics["task_completion_rate"] >= 0
