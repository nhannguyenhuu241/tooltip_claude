# GUIDE — Security Team

> Hướng dẫn cho team Security. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Security Team** bảo vệ sản phẩm khỏi các mối đe dọa bảo mật: tấn công, rò rỉ dữ liệu, vi phạm compliance. Team thực hiện threat modeling, security audit, penetration testing, compliance assessment, tích hợp bảo mật vào CI/CD, và xử lý incident khi có sự cố.

---

## Nguyên tắc bất di bất dịch

- **Security-first**: Threat model trước khi code, không phải sau
- **Critical/High phải fix trước khi release** — không exception
- **Pen test trên staging ONLY** — không bao giờ trên production
- **Incident = immediate activation** — không chờ pipeline

---

## Pipeline hoạt động

```
[Feature mới có auth/payment/PII/public API]
        |
        v
  threat-modeler          <-- STRIDE threat model TRƯỚC khi implement
        |
        v
  [Sau implementation]
        |
        v
security-auditor ←→ pen-tester  (chạy song song cho high-risk)
        |
        v
compliance-engineer       <-- Cho regulated features (GDPR, PCI, HIPAA)
        |
        v
devsecops-engineer        <-- Tích hợp security gates vào CI/CD

[Khi có incident]
        |
        v ← IMMEDIATE
 incident-responder       <-- Triage → Contain → Forensics → Recovery → Post-mortem
```

---

## Các Agents

### lead
**Vai trò:** Security Team Lead — orchestrator + escalation point
**Enforce:** Critical/High findings block all releases

### threat-modeler
**Vai trò:** Threat Modeling Specialist (STRIDE)
**Khi nào dùng:** Trước khi implement auth, payments, PII handling, public APIs
**Output:** `./docs/security/threat-model-[feature].md`

### security-auditor
**Vai trò:** OWASP Security Auditor
**Làm gì:** Code audit OWASP Top 10, secrets scanning, CVE check
**Không làm:** Fix code — chỉ report findings
**Output:** `./docs/security/audit-[feature].md`

### pen-tester
**Vai trò:** Penetration Tester
**QUAN TRỌNG:** Chỉ test trên staging — cần authorization trước
**Làm gì:** Active exploitation testing: auth bypass, IDOR, injection, business logic
**Output:** `./docs/security/pentest-[target].md`

### compliance-engineer
**Vai trò:** Regulatory Compliance Specialist
**Hỗ trợ:** GDPR, PDPA, PCI-DSS, HIPAA, SOC 2, ISO 27001
**Làm gì:** Gap assessment, remediation roadmap, audit preparation
**Output:** `./docs/security/compliance-[framework].md`

### devsecops-engineer
**Vai trò:** DevSecOps Engineer
**Làm gì:** SAST (CodeQL/Semgrep), DAST (OWASP ZAP), SCA (npm audit/Snyk), Gitleaks, container scanning
**Output:** CI/CD config + `./docs/security/devsecops-playbook.md`

### incident-responder
**Vai trò:** Security Incident Response Lead
**Khi nào dùng:** NGAY KHI phát hiện incident — không delay
**Quy trình:** Triage → Contain → Forensics → Eradicate → Recover → Post-mortem

---

## Severity & Response

| Severity | Ví dụ | Action |
|----------|-------|--------|
| **Critical** | RCE, auth bypass, data breach | Block release + fix ngay (giờ, không phải ngày) |
| **High** | IDOR, stored XSS, SQL injection | Block release + fix sprint này |
| **Medium** | CSRF, open redirect, insecure cookie | Fix trong 30 ngày |
| **Low** | Missing security header, verbose error | Log + fix maintenance window |

---

## Commands

```
/lead                  -- Bắt đầu security assessment
/threat-modeler        -- Threat model cho feature mới
/security-auditor      -- OWASP code audit
/pen-tester            -- Penetration test (staging only)
/compliance-engineer   -- Compliance gap assessment
/devsecops-engineer    -- Tích hợp security vào CI/CD
/incident-responder    -- EMERGENCY: Security incident response
```

---

## Ví dụ prompts

**Threat model cho feature mới:**
```
/threat-modeler
Threat model cho tính năng Payment Checkout mới.
Stack: Node.js API + Stripe integration + PostgreSQL.
User có thể: add card, pay, view payment history.
```

**Security audit trước release:**
```
/lead
Security assessment trước khi release v3.0.
Scope: auth module, payment API, user data endpoints.
Environment: staging tại staging.app.com
```

**DevSecOps setup:**
```
/devsecops-engineer
Setup security pipeline cho GitHub Actions.
Tech stack: Node.js/TypeScript. Cần: secrets scan, SAST, SCA, container scan.
```

**EMERGENCY — Incident:**
```
/incident-responder
INCIDENT: Phát hiện unauthorized access vào admin panel.
First seen: 14:30 hôm nay. Source IP: 103.x.x.x. Đang tiếp diễn.
```

---

## Security Reports (Confidential)

Tất cả security reports lưu tại `./docs/security/` và **KHÔNG được commit lên public repo**.
