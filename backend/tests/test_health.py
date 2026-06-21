from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "version" in response.json()


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_health_check_response_time():
    import time
    start = time.time()
    response = client.get("/api/health")
    elapsed = time.time() - start
    assert response.status_code == 200
    assert elapsed < 0.5  # Must respond in under 500ms
