# DevSecOps Pipeline Template

![CI Pipeline](https://github.com/Emmanuellamah64/devsecops-pipeline-template/actions/workflows/ci-security.yml/badge.svg)
![Security: Semgrep](https://img.shields.io/badge/SAST-Semgrep%20%2B%20Bandit-brightgreen?logo=semgrep)
![Container: Trivy](https://img.shields.io/badge/Container-Trivy%20Scanned-blue?logo=aqua)
![DAST: OWASP ZAP](https://img.shields.io/badge/DAST-OWASP%20ZAP-orange)
![Secrets: TruffleHog](https://img.shields.io/badge/Secrets-TruffleHog-purple)
![SBOM: Syft](https://img.shields.io/badge/SBOM-Syft%20%2B%20CycloneDX-blueviolet)
![Signed: Cosign](https://img.shields.io/badge/Image-Cosign%20Signed-success?logo=sigstore)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> A production-ready DevSecOps CI/CD pipeline with a real-time security dashboard.
> Built with FastAPI, React TypeScript, and GitHub Actions.

---

## What this project does

This template provides a complete **shift-left security pipeline** for Python/FastAPI applications.
Every push triggers 7 automated security stages before deployment is allowed.

**Security controls:**
- **SAST** — Bandit + Semgrep scan for code vulnerabilities (OWASP Top 10)
- **Secrets detection** — TruffleHog scans full git history for leaked credentials
- **Container scanning** — Trivy blocks deployment if CRITICAL CVEs are found
- **DAST** — OWASP ZAP performs dynamic testing against the running application
- **SBOM** — Syft generates Software Bill of Materials in SPDX + CycloneDX formats
- **Image signing** — Cosign keyless signing via OIDC (no secrets to manage)
- **Pre-commit hooks** — detect-secrets prevents secrets from ever entering the repo
- **Hardened Docker** — non-root user, multi-stage build, minimal attack surface

**Dashboard:**
A React TypeScript frontend visualizes all scan results in real time, refreshing every 30 seconds.

---

## Architecture

```
+--------------+    push    +----------------------------------------------+
|  Developer   |---------->|          GitHub Actions Pipeline               |
+--------------+           |                                                |
       |                   |  Stage 1 -> Tests (pytest + coverage)          |
       | pre-commit        |  Stage 2 -> SAST (Bandit + Semgrep)           |
       v                   |  Stage 3 -> Secrets (TruffleHog)              |
+--------------+           |  Stage 4 -> Container (Trivy)                 |
|detect-secrets|           |  Stage 5 -> DAST (OWASP ZAP)     [parallel]  |
|   bandit     |           |  Stage 6 -> Supply Chain          [parallel]  |
+--------------+           |             Syft SBOM + Cosign sign           |
                           |  Stage 7 -> Deploy (Render) OK                |
                           +----------------------------------------------+
                                              |
                                    +---------v----------+
                                    |  Security Dashboard |
                                    |  React TypeScript   |
                                    |  + FastAPI backend  |
                                    +--------------------+
```

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, FastAPI, JWT (python-jose) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Container | Docker (multi-stage, non-root) |
| CI/CD | GitHub Actions |
| SAST | Bandit, Semgrep (OWASP Top 10 ruleset) |
| Secrets | TruffleHog, detect-secrets |
| Container scan | Trivy |
| DAST | OWASP ZAP |
| SBOM | Syft (SPDX + CycloneDX) |
| Image signing | Cosign / Sigstore (keyless OIDC) |
| Registry | GitHub Container Registry (GHCR) |
| Deploy | Render |

---

## Quick start

```bash
# Clone the repo
git clone https://github.com/Emmanuellamah64/devsecops-pipeline-template.git
cd devsecops-pipeline-template

# Start the full stack
docker-compose up --build

# Backend API:  http://localhost:8000/api/docs
# Dashboard:    http://localhost:5173
# Login:        admin / securepassword
```

**Run backend locally:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Run tests:**
```bash
cd backend
pytest tests/ -v --cov=app
```

**Install pre-commit hooks:**
```bash
pip install pre-commit
pre-commit install
```

---

## Pipeline stages

| Stage | Tool | Blocks deploy on |
|-------|------|-----------------|
| 1 · Unit tests | pytest | Test failure or coverage < 70% |
| 2 · SAST | Bandit + Semgrep | HIGH severity code issues |
| 3 · Secrets | TruffleHog | Any verified secret in git history |
| 4 · Container | Trivy | CRITICAL CVEs |
| 5 · DAST | OWASP ZAP | High-risk dynamic vulnerabilities |
| 6 · Supply Chain | Syft + Cosign | SBOM generated, image signed via OIDC |
| 7 · Deploy | Render | Only if stages 5 + 6 both pass |

---

## Deploy to Render

1. Fork this repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Set environment variables:
   - `SECRET_KEY` — a strong random secret
   - `REPORTS_DIR` — `/app/reports`
4. Copy your **Deploy Hook URL** from Render settings
5. Add it as `RENDER_DEPLOY_HOOK_URL` in your GitHub repository secrets

---

## Author

**Emmanuel Lamah** — DevSecOps & AI Security Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Emmanuel%20Lamah-blue?logo=linkedin)](https://linkedin.com/in/emmanuel-lamah)
[![GitHub](https://img.shields.io/badge/GitHub-Emmanuellamah64-black?logo=github)](https://github.com/Emmanuellamah64)

---

## License

MIT — see [LICENSE](LICENSE) for details.
