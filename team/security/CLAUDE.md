# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: system being secured, compliance requirements, threat model].
- **Target systems**: [Web app | Mobile app | API | Infrastructure | All]
- **Compliance requirements**: [e.g., GDPR, PDPA, PCI-DSS, HIPAA, SOC 2, ISO 27001]

---

## Auto-Learning Instructions

> **For Claude:** When first activated, silently scan the project and populate **Project Context**. Do NOT modify `Agent Workflow` sections — they are locked.

### Scan order
1. `README.md` — system overview, tech stack
2. `docs/security/` or `docs/` — existing security policies, past audit reports
3. `docs/architecture*.md` — system architecture for threat modeling
4. `.env.example` — identify sensitive config and third-party services
5. `package.json` / dependency files — identify third-party libraries for CVE scanning
6. Previous audit reports in `docs/security/` — known issues and their status

### After scan: fill in Project Context and report known security debt items.

---

## Project Context
> Auto-populated by Claude on first activation.

- **System name**: [AUTO]
- **Tech stack**: [AUTO]
- **Compliance requirements**: [AUTO or manual]
- **Known open vulnerabilities**: [AUTO: from past audit reports if present]
- **Last security audit**: [AUTO: date from report filenames]

---

## Agent Workflow — Security Team

This team provides **threat modeling, penetration testing, compliance assurance, DevSecOps, and incident response**. Use the pipeline below.

### 1. Threat Modeling → `threat-modeler`
- STRIDE/PASTA threat model for new features or system changes
- Attack surface mapping, trust boundary analysis
- Run BEFORE implementation of security-critical features
- Output: `./docs/security/threat-model-[feature].md`

### 2. Security Audit → `security-auditor`
- OWASP Top 10 + CWE-25 audit of code and configurations
- Secrets scan, dependency CVE audit
- Run AFTER implementation, IN PARALLEL with pen-tester for high-risk features
- Output: `./docs/security/audit-[feature].md`

### 3. Penetration Testing → `pen-tester`
- Black-box and gray-box testing of running systems
- Auth bypass, privilege escalation, injection, SSRF, business logic flaws
- Output: `./docs/security/pentest-[target]-[date].md`

### 4. Compliance Engineering → `compliance-engineer`
- Maps controls to regulatory requirements (GDPR, PCI-DSS, HIPAA, SOC 2)
- Identifies gaps, documents evidence, prepares for audits
- Output: `./docs/security/compliance-[framework]-[date].md`

### 5. DevSecOps → `devsecops-engineer`
- Integrates security into CI/CD: SAST, DAST, SCA, container scanning
- Security gates in GitHub Actions / GitLab CI
- Output: CI config changes + `./docs/security/devsecops-playbook.md`

### 6. Incident Response → `incident-responder` (on-demand)
- Activated when a security incident is detected or suspected
- Triage, containment, forensics, communication plan, post-mortem
- Output: `./docs/security/incident-[date].md`

### Pipeline diagram
```
[New feature] → threat-modeler
                      ↓
[After implementation] → security-auditor ←→ pen-tester (parallel, high-risk)
                                ↓
                      compliance-engineer (for regulated features)
                                ↓
                      devsecops-engineer (CI/CD integration)

[Security incident] → incident-responder (immediate activation)
```

### General Rules
- **Threat model before code** for auth, payments, PII handling, and public APIs
- **All Critical/High findings must be fixed before release** — no exceptions
- **Security findings are not optional feedback** — they are blocking issues
- **Pen test on staging only** — never against production without explicit written approval
- **Findings are confidential** — do not commit raw vulnerability details to public repos
- Git: use `security:` prefix for security fix commits

## Security Escalation Protocol

- **Critical findings** (RCE, auth bypass, data breach risk): notify lead immediately, stop release
- **High findings**: fix within current sprint before any deployment
- **Medium findings**: fix within 30 days, document accepted risk if deferred
- **Low findings**: track in security debt register, fix in next maintenance window
- **Active incident**: activate `incident-responder` immediately, contain before analyzing
