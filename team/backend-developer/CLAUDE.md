# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: tech stack, main services, API type (REST/gRPC), database].
- **Source code location**: [path or repo URL]
- **Tech stack**: [e.g., Node.js/NestJS, Python/FastAPI/Django, PHP/Laravel/Symfony, .NET/ASP.NET Core, Java/Spring Boot, Go/Gin, Ruby on Rails — PostgreSQL, MySQL, Redis, Docker]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — project name, description, API type
2. `package.json` / `pyproject.toml` / `pom.xml` / `go.mod` / `composer.json` — language, runtime, framework
3. `docker-compose.yml` / `Dockerfile` — services, databases, ports
4. `.env.example` — environment variables, external service names
5. `src/` / `app/` / `lib/` top-level only — module names, service names
6. Test config files (`jest.config.*`, `pytest.ini`, `phpunit.xml`) — test framework
7. Migration folder (`migrations/`, `db/migrate/`, `alembic/`) — ORM/migration tool

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences]
- **Language & runtime**: [AUTO: e.g., Node.js 20, Python 3.12, PHP 8.2, Go 1.22]
- **Framework**: [AUTO: e.g., NestJS, FastAPI, Laravel, ASP.NET Core, Spring Boot, Gin]
- **API type**: [AUTO: REST | gRPC | GraphQL | mixed]
- **Database(s)**: [AUTO: e.g., PostgreSQL 16, MySQL 8, MongoDB, Redis]
- **ORM / query builder**: [AUTO: e.g., Prisma, TypeORM, SQLAlchemy, Eloquent, GORM]
- **Message queue / cache**: [AUTO: e.g., Redis, RabbitMQ, SQS — or "none detected"]
- **External services detected**: [AUTO: from .env.example keys and docker-compose]
- **Main modules / services**: [AUTO: top-level folders in src/ or app/]
- **Test framework**: [AUTO: e.g., Jest, Pytest, PHPUnit, Go testing]
- **Architecture pattern**: [AUTO: e.g., Layered, Clean, Hexagonal, Modular monolith, Microservices]
- **Source root**: [AUTO: path]

### Build & Development Commands
```bash
# [AUTO: from README or package.json scripts]
# install: ...
# dev: ...
# test: ...
# build: ...
# migrate: ...
```

---

## Architecture
> Fill in after auto-learning or manually.

- **Structure**: [AUTO or manual]
- **Key directories**: [AUTO or manual]

---

# Run dev server
# [e.g., npm run dev / uvicorn main:app --reload]

# Run tests
# [e.g., npm test / pytest]

# Lint
# [e.g., npm run lint / ruff check .]

# Build
# [e.g., npm run build / docker build .]
```

## Architecture

### [Describe your architecture here]
- **Structure**: [e.g., Clean Architecture / Layered / Hexagonal]
- **Key directories**: [list main dirs and their purpose]
- **DI / IoC**: [how dependencies are managed]

## Agent Workflow — Backend Developer Team

This team specializes in **backend implementation, architecture, API design, security, performance, and delivery**. Use the pipeline below.

### 1. Planning & Research → `planner`
- Use before starting any significant feature or system change
- Researches technical approaches, evaluates trade-offs, creates phased implementation plans
- Spawns `researcher` sub-agents in parallel for multi-topic investigation
- Output: implementation plan saved to `./plans/` directory

### 2. Solution Architecture → `solution-architect`
- Triggered after requirements/PRD are available
- Designs component model, interface contracts, data flow, NFR targets, security controls
- Produces ADRs (Architecture Decision Records) and handoff JSON for engineering
- **For migration projects**: check existing libraries; standardize to one per feature

### 3. API Design → `api-designer`
- Run after solution-architect, **before** engineer-agent begins implementation
- Produces OpenAPI 3.0 YAML spec: endpoints, request/response schemas, auth matrix, error catalogue
- Defines versioning strategy (URI vs header), rate limit policies, pagination contracts
- Output: `./docs/api-spec-[feature].yaml` + `./docs/api-contracts.md`
- **New APIs or significant endpoint additions**: always run this step

### 4. Implementation → `engineer-agent`
- Implements tasks assigned by planner/solution-architect following the API spec
- Follow project's architectural patterns (check `./docs/` before starting)
- Write clean code with error handling, logging, and unit tests
- Run build/code-gen commands after modifying annotated or generated files
- Output: working code + implementation summary + test coverage

### 5. Code Review → `tech-lead-reviewer`
- **Required after every engineer-agent implementation**
- Reviews quality, security, patterns, and alignment with solution architecture
- Issues: Approved / Needs Changes / Rejected
- **Do not consider implementation complete without tech-lead approval**

### 6. Security Audit → `security-auditor`
- Run **in parallel with tech-lead-reviewer** for auth, payment, user data, or public API endpoints
- OWASP Top 10 coverage: injection, broken auth, SSRF, misconfig, insecure deserialization
- Outputs VULN-XXX findings with severity (Critical/High/Medium/Low) and remediation steps
- Secrets scan (API keys, tokens hardcoded), dependency CVE audit
- Output: `./docs/security-audit-[feature].md`

### 7. Performance Engineering → `performance-engineer`
- Run before release for endpoints touching > 10k rows or high-traffic paths
- EXPLAIN ANALYZE interpretation, N+1 query detection, caching strategy recommendations
- Outputs PERF-XXX findings with response time targets and optimization steps
- Output: `./docs/performance-report-[feature].md`

### 8. Testing → `tester`
- Run after tech-lead-reviewer approves the code (and after security/performance fixes applied)
- Execute full test suite, analyze coverage, validate edge cases and error paths
- Report failing tests — never skip or mock around failures

### 9. Debugging → `debugger`
- Use when investigating errors, performance issues, or CI/CD failures
- Analyzes logs, traces, query plans, and system behavior
- Provides root cause analysis and fix recommendations

### 10. Language Specialists (select by project stack)

Run the appropriate specialist **instead of** `engineer-agent` for language-specific implementation:

- **`nodejs-specialist`** — Node.js/TypeScript: NestJS modules/decorators/DI, async patterns, BullMQ, Prisma, Jest/Vitest
- **`python-specialist`** — Python: FastAPI Depends() chain, SQLAlchemy async, Pydantic v2, Celery, pytest-asyncio
- **`php-specialist`** — PHP 8: Laravel Eloquent/Queues/Policies/Events, Symfony DI, PHP enums, Pest tests
- **`dotnet-specialist`** — C#/.NET: ASP.NET Core minimal API, MediatR CQRS, EF Core, FluentValidation, xUnit
- **`java-specialist`** — Java 21: Spring Boot, Spring Security JWT, Spring Data JPA, virtual threads, JUnit 5
- **`go-specialist`** — Go: Gin/Fiber handlers, goroutine patterns, errgroup, sqlx, table-driven tests

Use `engineer-agent` only for language-agnostic tasks (YAML/config/scripts/general patterns).

### 11. Architecture Model Specialists

Select based on project architecture needs — run **after planner, before api-designer**:

- **`clean-architect`** — for domain-rich services: defines Clean/Hexagonal Architecture layers (Domain → Application → Infrastructure → Presentation), dependency rules, aggregates, value objects, domain events, port interfaces. Output: `./docs/architecture-[service].md`
- **`microservices-engineer`** — for distributed systems: service decomposition, inter-service contracts, saga patterns, circuit breakers, Docker/Kubernetes config. Output: `./docs/microservices-design.md` + `./docs/event-catalogue.md`
- **`event-driven-engineer`** — for async/CQRS/audit-heavy systems: CQRS write/read model design, Event Sourcing, outbox pattern, idempotent consumers, Kafka/RabbitMQ/SQS topology. Output: `./docs/event-architecture-[feature].md`

### General Rules

- **Architecture selection**: `clean-architect` for DDD | `microservices-engineer` for distributed | `event-driven-engineer` for async/CQRS
- **Language selection**: route to the correct language specialist based on project stack
- **Pipeline order**: planner → [architecture specialist] → api-designer → [language specialist] → tech-lead-reviewer + security-auditor (parallel) → tester
- **security-auditor and tech-lead-reviewer run in parallel** — both outputs required before tester
- **performance-engineer** runs before release for high-traffic or data-intensive endpoints
- **Debugger is on-demand** — use when investigating errors or performance issues
- **Do not skip tech-lead-reviewer** — all code must be reviewed before considered complete
- **For minor bug fixes**: [language specialist] → tech-lead-reviewer (skip planning/architecture)
- **For major refactoring**: run planner first to scope the work
- **Run tests before every commit** — do not merge failing tests
- **Git**: use conventional commit format (`feat:`, `fix:`, `refactor:`, `security:`, etc.) directly without git-manager

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- **Never hardcode** API keys, passwords, tokens, JWT secrets, or connection strings in source code
- Use environment variables exclusively — never commit `.env` files; provide `.env.example` with placeholder values
- If a secret is found in existing code, **flag it immediately**, remove it, and rotate the credential before continuing
- Never log or print secrets, tokens, or credentials — including in debug, error messages, or test output

### Data Handling & Privacy
- **PII** (names, emails, phone numbers, national IDs) must not appear in logs, test fixtures, seed data, or code comments
- Use anonymized or synthetic data for all development and testing environments — never copy production data
- Implement data retention policies: define TTL for sensitive records; document in schema comments
- Apply data minimization: only collect and store fields that are strictly necessary

### Code Security Standards
- **Input validation**: sanitize and validate all inputs at every system boundary (API endpoints, message queues, file uploads, webhooks)
- **SQL injection**: use parameterized queries or ORM-level query builders exclusively — never string-concatenate SQL
- **Authentication & Authorization**: every API endpoint must have explicit auth checks; no unauthenticated endpoints unless explicitly approved
- **Rate limiting**: implement on all public-facing endpoints; document limits in API specs
- **Dependency security**: do not add packages with known critical CVEs; run `npm audit` / `pip-audit` / `trivy` before committing new dependencies
- Follow **OWASP Top 10** — tech-lead-reviewer must check for injection, broken auth, insecure deserialization, security misconfiguration

### Destructive Operations
- Require explicit user confirmation before: deleting data, resetting databases, removing services, or modifying production configuration
- Never force-push to `main`/`master` or any shared branch
- Production changes must pass staging validation first — document rollback plan before applying
- Use feature flags for high-risk changes; enable gradual rollout

### Audit & Compliance
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `security:`, `chore:` — every commit must be traceable
- Document security-relevant decisions in ADRs (Architecture Decision Records) in `./docs/adr/`
- Flag any action that may violate data regulations (GDPR, PDPA, HIPAA) — stop and confirm with user before proceeding
- Code review is mandatory before merge — do not bypass with `--no-verify` or similar flags
