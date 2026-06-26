# Security Policy

## Supported versions

| Version | Security support |
|---------|-----------------|
| 1.x     | Active        |

## Reporting a vulnerability

To report a security vulnerability, please email:
**lamahemmanuel64@gmail.com**

Please do NOT open a public GitHub issue for security vulnerabilities.

**Response time commitment:**
- Initial acknowledgement: within 48 hours
- Status update: within 7 days
- Fix timeline: within 30 days for critical issues

## Security controls implemented

This pipeline enforces the following security controls on every push:

| Control | Tool | Stage |
|---------|------|-------|
| Static code analysis | Bandit + Semgrep | CI Stage 2 |
| OWASP Top 10 rules | Semgrep ruleset | CI Stage 2 |
| Secrets detection | TruffleHog | CI Stage 3 |
| Git history secrets scan | TruffleHog (full depth) | CI Stage 3 |
| Container CVE scanning | Trivy (CRITICAL/HIGH block) | CI Stage 4 |
| Dynamic application testing | OWASP ZAP baseline | CI Stage 5 |
| Pre-commit secrets hook | detect-secrets | Local |
| Hardened Docker image | Non-root, multi-stage | Build |
| JWT authentication | python-jose (HS256) | Runtime |
| Security headers | nginx config | Runtime |
| Weekly dependency audit | pip-audit | Scheduled |

## Security architecture

```
Developer -> Pre-commit hooks -> Push -> GitHub Actions
                                         |- Stage 1: Unit tests + coverage
                                         |- Stage 2: SAST (Bandit + Semgrep)
                                         |- Stage 3: Secrets (TruffleHog)
                                         |- Stage 4: Container scan (Trivy)
                                         |- Stage 5: DAST (OWASP ZAP)
                                         +- Stage 6: Deploy (if all pass)
```

## Container security

The application runs in a hardened Docker container:
- Non-root user (UID 1001)
- Multi-stage build (minimal attack surface)
- No shell in production image
- Read-only filesystem where possible
- Built-in HEALTHCHECK
