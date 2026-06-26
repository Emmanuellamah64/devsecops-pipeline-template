import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def get_auth_token():
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "securepassword"},
    )
    return response.json()["access_token"]


def test_sast_report_no_file():
    """Should return pending status when no report file exists."""
    token = get_auth_token()
    response = client.get(
        "/api/reports/sast",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


def test_trivy_report_no_file():
    token = get_auth_token()
    response = client.get(
        "/api/reports/trivy",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


def test_secrets_report_no_file():
    token = get_auth_token()
    response = client.get(
        "/api/reports/secrets",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


def test_reports_require_auth():
    """All report endpoints should return 403 without token."""
    for endpoint in ["/api/reports/sast", "/api/reports/trivy", "/api/reports/secrets"]:
        response = client.get(endpoint)
        assert response.status_code == 403, f"{endpoint} should require auth"
