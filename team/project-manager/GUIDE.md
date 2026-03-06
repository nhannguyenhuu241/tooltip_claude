# GUIDE — Project Manager Team

> Hướng dẫn chi tiết cho team Quản lý Dự án. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Project Manager Team** là team điều phối chiến lược ở cấp cao nhất. Team đảm bảo mọi dự án có mục tiêu rõ ràng, kế hoạch delivery cụ thể, rủi ro được quản lý, và tiến độ được theo dõi.

Team này không viết code — team này đảm bảo **đúng người làm đúng việc đúng thứ tự đúng thời điểm**.

---

## Pipeline hoạt động

```
[Initiative mới / Yêu cầu thay đổi / Sprint review]
        |
        v
  scope-manager          <-- WBS + scope statement + change impact (CR-XXX)
        |
        |---> researcher (song song, nghiên cứu market/tech/competitive)
        |
        v
  risk-analyst           <-- Risk register với P×I scoring (RISK-XXX)
        |
        v
  sprint-planner         <-- Capacity model + sprint schedule + critical path
        |
        v
   docs-manager          <-- Duy trì tất cả project documentation
```

**Shortcut:**
- **Status review chỉ:** `sprint-planner` — update velocity, flag blocked stories
- **Change request:** `scope-manager` (CR-XXX impact) → `risk-analyst` (new risks) → `sprint-planner` (schedule update)
- **Research cần thiết:** `researcher` chạy song song với bất kỳ step nào

---

## Các Agents

### scope-manager
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Scope & WBS Specialist

**Làm gì:**
- Tạo Work Breakdown Structure (WBS): Epics → Stories → Tasks với MoSCoW priority
- Scope statement: in-scope/out-of-scope, success criteria, constraints, assumptions
- Change Request assessment (CR-XXX): impact phân tích trên timeline, cost, scope
- Output: `./docs/wbs-[project].md` + `./docs/scope-statement-[project].md`

**Chạy đầu tiên** cho mọi initiative mới hoặc change request lớn.

**WBS format:**
```
Project: HRM System
├── Epic E1: Authentication [M - Must Have] — 16 pts
│   ├── Story E1.1: Email Login (5 pts) — critical path
│   ├── Story E1.2: Google OAuth (3 pts)
│   └── Story E1.3: RBAC (8 pts) — critical path
└── Epic E2: Employee Management [M] — 8 pts
    ├── Story E2.1: Employee CRUD (5 pts)
    └── Story E2.2: Department hierarchy (3 pts)
In scope: E1, E2 | Out of scope: Payroll, mobile app
```

---

### researcher
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** Market & Intelligence Analyst

**Làm gì:**
- Nghiên cứu competitor, market sizing, domain knowledge
- Technology evaluation cho strategic decisions
- Due diligence trước major investments
- **Chạy song song** với bất kỳ step nào cần external data

---

### docs-manager
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Documentation Manager

**Làm gì:**
- Maintain `./docs/`: roadmap, changelog, PRD archives, ADRs
- Update sau mỗi milestone, major decision, plan change
- Đảm bảo docs accurate, current, cross-referenced
- **Chạy sau mỗi major output**

---

### scope-manager
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Scope & WBS Specialist

**Làm gì:**
- Tạo Work Breakdown Structure (WBS): Epics → Stories → Tasks với MoSCoW priority
- Scope statement: in-scope/out-of-scope boundaries, success criteria, constraints, assumptions
- Change Request assessment (CR-XXX): phân tích impact trên timeline, cost, scope khi có thay đổi
- Dependency mapping giữa work packages
- Output: `./docs/wbs-[project].md` + `./docs/scope-statement-[project].md`

**Chạy đầu tiên** cho mọi initiative mới hoặc change request lớn.

**WBS format:**
```
Project: HRM System
├── Epic E1: Authentication & Authorization [M - Must Have]
│   ├── Story E1.1: Email/Password Login (5 pts, BE+FE)
│   ├── Story E1.2: Google OAuth (3 pts, BE+FE)
│   └── Story E1.3: Role-based access control (8 pts, BE)
├── Epic E2: Employee Management [M - Must Have]
│   ├── Story E2.1: Employee CRUD (5 pts, BE+FE)
│   └── Story E2.2: Department hierarchy (3 pts, BE+FE)
└── Epic E3: Leave Management [S - Should Have]
    └── Story E3.1: Leave request flow (8 pts, BE+FE+QA)

Total: 32 story points | In scope: E1, E2, E3 | Out of scope: Payroll, mobile app
```

---

### risk-analyst
**Màu:** Đỏ | **Model:** Sonnet | **Vai trò:** Risk Management Specialist

**Làm gì:**
- Xác định risks theo 5 categories: Technical, Resource, Delivery, External, Compliance
- Score mỗi risk: Probability × Impact (1-25) → Critical/High/Medium/Low
- Tạo RISK-XXX findings với mitigation plan, contingency plan, owner, review date
- Risk heat map visualization
- Monitoring plan: review frequency và early warning indicators per risk
- Output: `./docs/risk-register-[project].md`

**Chạy sau scope-manager**, trước sprint-planner.

**Risk scoring:**
```
Probability: 1(Rare) 2(Unlikely) 3(Possible) 4(Likely) 5(Almost Certain)
Impact:      1(Negligible) 2(Minor) 3(Moderate) 4(Major) 5(Critical)
Score:       20-25=Critical | 12-19=High | 6-11=Medium | 1-5=Low

RISK-001
Category: Technical | Score: 15 — HIGH (P:3 × I:5)
Title: Payment gateway API instability during peak load
Mitigation: Implement retry queue with exponential backoff + circuit breaker
Contingency: Fallback UI "Payment queued, cart saved" + customer notification
Owner: Backend Team Lead | Review: Monthly
```

---

### sprint-planner
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Sprint & Iteration Planner

**Làm gì:**
- Capacity model: team composition × velocity tại 70-80% (buffer cho meetings, bugs, reviews)
- Sprint schedule: assign stories to sprints theo dependency order + sprint goals
- Critical path analysis: longest dependency chain — identify và protect
- Milestone schedule với Go/No-Go owners
- Risk buffer planning
- Output: `./docs/sprint-plan-[project].md`

**Chạy sau** scope-manager + risk-analyst.

**Sprint format:**
```
Sprint 1 (Week 1-2) | Goal: Users can register and sign in
Capacity: 24 pts (2 BE × 8pts + 1 FE × 8pts = 24pts, adjusted 80%)

Stories:
  E1.1: Email/Password Login    (BE 3pts + FE 2pts)  — critical path
  E1.3: RBAC                   (BE 8pts)              — critical path
Total: 13 pts | Buffer: 11 pts for integration + testing

Critical path: E1.1 → E2.1 → E3.1 → Launch (6 sprints)
Milestone: Auth complete Sprint 1 | MVP Sprint 4 | Launch Sprint 6
```

---

### lead (Entry Point)
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** Team Lead / Orchestrator

Điều phối toàn team, spawn agents theo pipeline, validate, tổng hợp.

---

## Commands

### Gọi toàn bộ pipeline (khuyến nghị)
```
/lead
```

### Gọi agent cụ thể
```
/scope-manager     -- WBS + scope statement + change request impact (CR-XXX)
/risk-analyst      -- Risk register với P×I scoring + mitigation plans (RISK-XXX)
/sprint-planner    -- Capacity model + sprint schedule + critical path + milestones
/researcher        -- Market/tech research (chạy song song)
/docs-manager      -- Cập nhật documentation
```

### Code — Thực hiện kế hoạch tuần tự
```
/code
```
Trong ngữ cảnh PM team, `/code` dùng để thực thi plan theo từng phase:
- Phase 1: Analysis → Phase 2: Planning → Phase 3: Documentation
- Mỗi phase chờ phase trước hoàn thành mới chạy

### Code Parallel — Thực hiện nhiều tasks song song
```
/code:parallel
```
Dùng khi có nhiều tasks **độc lập** có thể chạy đồng thời.

**Ví dụ dùng Code Parallel trong PM context:**
```
Khởi động dự án cần 4 analyses song song:
- Researcher A: Competitor analysis
- Researcher B: Technology evaluation
- Researcher C: Market sizing
- Product-manager: Draft PRD từ existing BR

→ /code:parallel spawn tất cả cùng lúc
→ Tổng hợp kết quả sau khi tất cả xong
→ Nhanh hơn 4x so với tuần tự
```

**Khi nào dùng Code Parallel:**
- Nhiều research topics độc lập nhau
- Viết documentation cho nhiều features độc lập
- Update nhiều sections của delivery plan không liên quan nhau

---

## Ví dụ prompts thực tế

**Kick-off dự án mới:**
```
/lead

Khởi động dự án xây dựng hệ thống quản lý nhân sự (HRM) cho công ty 500 người.
Requirements: quản lý chấm công, leave management, performance review.
Team: 2 BE, 1 FE, 1 QA | Sprint: 2 tuần | Velocity ước tính: 24 pts/sprint
```

**Review tiến độ sprint:**
```
/sprint-planner

Review tiến độ Sprint 3. Plan tại ./docs/sprint-plan-hrm.md
Update velocity thực tế, flag blocked stories, đề xuất điều chỉnh Sprint 4.
```

**Phân tích impact của change request:**
```
/scope-manager

Change request CR-004: Thêm mobile app cho HRM (hiện chỉ có web).
Timeline còn 3 tháng, budget còn 200M VND.
Tạo CR-XXX với full impact analysis: scope delta, timeline impact, cost estimate.
```

**Lập kế hoạch từ WBS đã có:**
```
/lead

WBS đã được approve tại ./docs/wbs-hrm.md
Chạy pipeline: risk-analyst → sprint-planner.
Team: 2 BE (8pts/sprint each), 1 FE (8pts), 1 QA (6pts). Sprint 2 tuần.
```

**Research song song cho quyết định kỹ thuật:**
```
/lead

Cần quyết định tech stack cho HRM. Chạy parallel research:
1. So sánh NestJS vs FastAPI vs Laravel cho backend
2. PostgreSQL vs MongoDB cho data model này
3. Competitor HRM products: BambooHR, Workday, Rippling — features và UX
```

---

## Output artifacts

| File | Agent | Mô tả |
|------|-------|-------|
| `./docs/wbs-[project].md` | scope-manager | Work Breakdown Structure với MoSCoW |
| `./docs/scope-statement-[project].md` | scope-manager | In/out scope, success criteria |
| `./docs/risk-register-[project].md` | risk-analyst | RISK-XXX với P×I scoring + mitigation |
| `./docs/sprint-plan-[project].md` | sprint-planner | Capacity model + sprint schedule + milestones |
| `./docs/project-changelog.md` | docs-manager | Lịch sử thay đổi kế hoạch |
| `./docs/research-[topic].md` | researcher | Research findings và recommendations |

---

## Naming conventions bắt buộc

```
prd-[feature]-v[N].md          -- prd-google-auth-v2.md
plan-[phase]-[date].md         -- plan-phase1-2026Q1.md
risk-register-[project].md     -- risk-register-hrm.md
research-[topic]-[date].md     -- research-ai-hrm-20260305.md
```

---

## Security & Confidentiality (bắt buộc)

- **Default classification: `[CONFIDENTIAL]`** cho tất cả project documents
- Timeline, budget, team structure, client names → không chia sẻ ra ngoài
- Risk register chứa thông tin nhạy cảm → lưu securely, không public repo
- External communications → review và approve trước khi gửi
- Decisions ảnh hưởng legal/compliance → escalate, không tự quyết
- Mọi deliverable phải có: author, date, version, approval status
