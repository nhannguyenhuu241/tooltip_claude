# Shared Team Knowledge

Thư mục này chứa thông tin dùng chung giữa các teams. Các agent nên đọc các file liên quan trước khi bắt đầu task.

## Structure

```
shared/
├── docs/           # PRDs, BRDs, system analysis reports từ business-analyst team
├── decisions/      # ADRs và architectural decisions từ solution-architect
└── schemas/        # Database schema summaries từ database team
```

## Usage Protocol

| Team | Đọc từ | Ghi vào |
|------|--------|---------|
| business-analyst | — | `docs/prd-*.md`, `docs/system-analysis-*.md` |
| database | `docs/data-requirements-*.md` | `schemas/schema-*.md` |
| backend-developer | `docs/prd-*.md`, `schemas/schema-*.md`, `decisions/` | `decisions/adr-*.md` |
| frontend-developer | `docs/prd-*.md`, `decisions/` | — |
| project-manager | `docs/prd-*.md` | `docs/delivery-plan-*.md` |
| ui-ux | `docs/prd-*.md` | `docs/design-spec-*.md` |
