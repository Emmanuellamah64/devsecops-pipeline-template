import json
import os
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.routers.auth import verify_token

router = APIRouter()

REPORTS_DIR = Path(os.environ.get("REPORTS_DIR", "./reports"))


class ScanSummary(BaseModel):
    tool: str
    status: str  # "passed", "failed", "running", "pending"
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    total: int = 0
    last_run: Optional[str] = None


class PipelineStatus(BaseModel):
    run_id: str
    branch: str
    commit: str
    status: str
    stages: dict
    triggered_at: str


def load_report(filename: str) -> Optional[dict]:
    """Load a JSON report file if it exists."""
    path = REPORTS_DIR / filename
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return None


@router.get("/reports/sast", response_model=ScanSummary)
def get_sast_report(payload: dict = Depends(verify_token)):
    """Return SAST scan results (Bandit + Semgrep)."""
    report = load_report("bandit-report.json")
    if not report:
        return ScanSummary(tool="bandit+semgrep", status="pending")

    results = report.get("results", [])
    severity_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for issue in results:
        sev = issue.get("issue_severity", "LOW").upper()
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    return ScanSummary(
        tool="bandit+semgrep",
        status="failed" if severity_counts["HIGH"] > 0 else "passed",
        high=severity_counts["HIGH"],
        medium=severity_counts["MEDIUM"],
        low=severity_counts["LOW"],
        total=len(results),
        last_run=report.get("generated_at"),
    )


@router.get("/reports/trivy", response_model=ScanSummary)
def get_trivy_report(payload: dict = Depends(verify_token)):
    """Return container vulnerability scan results (Trivy)."""
    report = load_report("trivy-report.json")
    if not report:
        return ScanSummary(tool="trivy", status="pending")

    vuln_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for result in report.get("Results", []):
        for vuln in result.get("Vulnerabilities", []):
            sev = vuln.get("Severity", "LOW").upper()
            vuln_counts[sev] = vuln_counts.get(sev, 0) + 1

    status = "failed" if vuln_counts["CRITICAL"] > 0 else "passed"
    return ScanSummary(
        tool="trivy",
        status=status,
        critical=vuln_counts["CRITICAL"],
        high=vuln_counts["HIGH"],
        medium=vuln_counts["MEDIUM"],
        low=vuln_counts["LOW"],
        total=sum(vuln_counts.values()),
        last_run=report.get("CreatedAt"),
    )


@router.get("/reports/secrets", response_model=ScanSummary)
def get_secrets_report(payload: dict = Depends(verify_token)):
    """Return secrets detection results (TruffleHog)."""
    report = load_report("secrets-report.json")
    if not report:
        return ScanSummary(tool="trufflehog", status="pending")

    findings = report.get("findings", [])
    verified = [f for f in findings if f.get("verified")]
    return ScanSummary(
        tool="trufflehog",
        status="failed" if verified else "passed",
        high=len(verified),
        total=len(findings),
        last_run=report.get("scanned_at"),
    )


@router.get("/reports/latest")
def get_latest_summary(payload: dict = Depends(verify_token)):
    """Return aggregated summary of all security scans."""
    return {
        "sast": get_sast_report(payload),
        "trivy": get_trivy_report(payload),
        "secrets": get_secrets_report(payload),
    }
