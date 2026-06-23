from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_success():
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "securepassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password():
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_protected_route_without_token():
    response = client.get("/api/auth/me")
    assert response.status_code == 403


def test_protected_route_with_valid_token():
    login = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "securepassword"},
    )
    token = login.json()["access_token"]
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["username"] == "admin"


def test_protected_route_with_invalid_token():
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid.token.here"},
    )
    assert response.status_code == 401
