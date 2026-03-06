# GUIDE — Backend Developer Team

> Hướng dẫn chi tiết cho team Phát triển Backend. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Backend Developer Team** xây dựng mọi thứ phía server: APIs, business logic, database integration, authentication, background jobs, và infrastructure code.

Team hoạt động theo pipeline chặt chẽ: **không bao giờ code trước khi có plan**, **không bao giờ merge trước khi review**, **không bao giờ deploy trước khi test pass**.

---

## Pipeline hoạt động

```
[Yêu cầu/PRD/Bug report]
        |
        v
      planner                    <-- Nghiên cứu + tạo implementation plan
        |
        v
  [Architecture Specialist]      <-- Chọn 1 theo nhu cầu:
  clean-architect                    Domain-rich service → Clean/Hexagonal/DDD
  microservices-engineer             Distributed system → service decomposition
  event-driven-engineer              Async/CQRS/audit → event design + outbox
        |
        v
    api-designer                 <-- Thiết kế API contract (OpenAPI 3.0)
        |
        v
  [Language Specialist]          <-- Chọn 1 theo stack dự án:
  nodejs-specialist                  Node.js / NestJS / TypeScript
  python-specialist                  Python / FastAPI / Django
  php-specialist                     PHP / Laravel / Symfony
  dotnet-specialist                  C# / .NET / ASP.NET Core
  java-specialist                    Java / Spring Boot
  go-specialist                      Go / Gin / Fiber
        |
        v
tech-lead-reviewer  <-- song song -->  security-auditor
        |
        v
       tester                    <-- Chạy test suite, validate coverage
        |
   debugger (on-demand)          <-- Chỉ dùng khi có lỗi/performance issues
   performance-engineer (on-demand) <-- Trước release cho high-traffic endpoints
```

**Shortcut cho bug fixes:**
```
[language-specialist] --> tech-lead-reviewer  (bỏ qua planner và architect)
```

---

## Các Agents

### planner
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Technical Planner

**Làm gì:**
- Nghiên cứu cách tiếp cận kỹ thuật, so sánh trade-offs
- Spawn researcher sub-agents song song để nghiên cứu nhiều chủ đề
- Tạo implementation plan chi tiết theo từng phase
- Output: file plan lưu vào `./plans/[feature].md`

**Plan bao gồm:**
- Danh sách files cần tạo/sửa
- Thứ tự implementation
- Các dependencies giữa tasks
- Estimated complexity mỗi task

**Khi nào bỏ qua:** Bug fixes nhỏ, text changes, config updates.

---

### solution-architect
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Senior Principal Architect

**Làm gì:**
- Thiết kế component model, interface contracts, data flow
- So sánh ít nhất 2 phương án kiến trúc và chọn phương án tốt nhất
- Viết ADRs (Architecture Decision Records) giải thích lý do lựa chọn
- Định nghĩa NFRs (Non-functional Requirements): latency, throughput, availability
- Thiết kế security controls: auth model, encryption, audit logging
- Output: ADR + Handoff JSON lưu vào `./docs/architecture-[feature].md`

**Handoff JSON bao gồm:**
```json
{
  "components": [...],
  "adrs": [...],
  "nfrTargets": { "availability": "99.9%", "latencyP99": "500ms" },
  "securityControls": [...],
  "implementationPhases": [...]
}
```

**Không làm gì:** Viết production code, tạo sprint plans, estimate story points.

---

### engineer-agent
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** Elite Senior Engineer

**Làm gì:**
- Implement features theo đúng plan và architecture đã được approve
- Viết clean code với proper naming, small functions, separation of concerns
- Bao gồm comprehensive unit tests (happy path + edge cases + error paths)
- Thêm error handling và structured logging
- Output: code + unit tests + implementation summary

**Quy tắc cứng:**
- Implement ĐÚNG những gì được assign — không thêm, không bớt
- Không thay đổi kiến trúc đã được architect định nghĩa
- Không thêm thư viện mới mà không có approval
- Không skip tests — bắt buộc mọi lúc

**Output format:**
1. Implementation Summary (3-8 câu)
2. Code (toàn bộ files với đường dẫn)
3. Unit Tests
4. Assumptions
5. Known Limitations

---

### tech-lead-reviewer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Tech Lead / Code Reviewer

**Làm gì:**
- Review code từ engineer-agent — bắt buộc sau MỌI implementation
- Kiểm tra: TypeScript correctness, security vulnerabilities, performance patterns
- Kiểm tra alignment với solution architecture
- Kiểm tra test coverage và quality
- Quyết định: **Approved** / **Needs Changes** / **Rejected**

**Không cho merge nếu chưa có Approved từ tech-lead-reviewer.**

---

### tester
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** QA Engineer

**Làm gì:**
- Chạy full test suite sau khi tech-lead approve
- Phân tích coverage, validate edge cases và error paths
- Report failing tests — không bao giờ skip hoặc mock around failures
- Đưa ra Go/No-Go decision cho deployment

---

### debugger
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Senior Debugging Specialist

**Làm gì:**
- Phân tích errors, performance issues, CI/CD failures
- Đọc logs, traces, query plans, system behavior
- Root cause analysis + fix recommendations

**Khi nào dùng:** On-demand — chỉ spawn khi có vấn đề cụ thể cần điều tra.

---

---

## Architecture Model Specialists

### clean-architect
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Clean/Hexagonal/DDD Architect

**Khi nào dùng:** Service có business logic phức tạp, cần cách ly domain khỏi framework và database.

**Làm gì:**
- Định nghĩa các layer: Domain → Application → Infrastructure → Presentation
- **Dependency Rule**: source code chỉ được phụ thuộc hướng vào trong (không layer nào biết layer ngoài)
- Domain: Entities (business rules), Value Objects (immutable, compared by value), Aggregates, Domain Events
- Application: Use Cases, Port interfaces (defined here, implemented in Infrastructure)
- Infrastructure: Repository implementations, external adapters (payment, email, storage)
- Audit existing code cho layer violations
- Output: `./docs/architecture-[service].md`

**Ví dụ layer violation:**
```
VIOLATION-001
File: src/controllers/OrderController.ts:45
Issue: Discount logic in controller (wrong layer — must be in Domain)
Fix: Move to Order.applyDiscount() domain method
```

---

### microservices-engineer
**Màu:** Đỏ | **Model:** Sonnet | **Vai trò:** Distributed Systems Specialist

**Khi nào dùng:** Hệ thống cần tách thành nhiều services độc lập, hoặc đang migrate từ monolith.

**Làm gì:**
- Service decomposition theo bounded contexts
- Mỗi service: owns its data (separate DB — không share DB)
- Inter-service communication: REST/gRPC (synchronous) vs Events (async)
- Reliability patterns: circuit breaker, retry với exponential backoff + jitter, timeout
- Saga pattern cho distributed transactions (choreography vs orchestration)
- Docker + Kubernetes config với health checks, resource limits, HPA
- Output: `./docs/microservices-design.md` + `./docs/event-catalogue.md`

**Rule tuyệt đối:** Không bao giờ share database giữa 2 services — CRITICAL violation.

---

### event-driven-engineer
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** CQRS / Event Sourcing / Messaging Specialist

**Khi nào dùng:** Cần async processing, strong audit trail, CQRS, hoặc Event Sourcing.

**Làm gì:**
- CQRS: tách Command side (write) và Query side (read/projection)
- Outbox Pattern: write event vào DB trong cùng transaction → relay publish lên broker (no dual-write)
- Idempotent consumer: mọi consumer phải handle duplicate delivery bằng event.id
- Event schema: envelope với id, type, version, correlationId, occurredAt
- Kafka/RabbitMQ/SQS topology: topic, partitions, consumer groups, dead-letter queues
- Output: `./docs/event-architecture-[feature].md`

**Pattern key:**
```
Producer:   write order + write outbox event (SAME DB transaction)
Relay:      poll outbox table → publish to broker → mark processed
Consumer:   check redis(event.id) → process → mark as processed (idempotent)
```

---

## Language Specialists

### nodejs-specialist
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Node.js / TypeScript Expert

**Stack:** Node.js + TypeScript, NestJS (hoặc Express/Fastify), Prisma/TypeORM, BullMQ, Jest/Vitest

**Chuyên sâu:**
- NestJS: modules, DI container, decorators (`@Injectable`, `@Guard`, `@Interceptor`), lifecycle hooks
- Async patterns: `Promise.all/allSettled`, `AsyncIterator`, streaming, backpressure
- Event loop: microtask vs macrotask, blocking detection, `setImmediate`
- BullMQ: queues, workers, concurrency, rate limiters, job retry với backoff
- Testing: Jest mocking + spying, `@nestjs/testing` module, Supertest

---

### python-specialist
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Python / FastAPI / Django Expert

**Stack:** Python 3.12+, FastAPI hoặc Django, SQLAlchemy 2.x/Alembic, Pydantic v2, Celery, pytest

**Chuyên sâu:**
- FastAPI: `Depends()` chain, lifespan context, background tasks, middleware
- SQLAlchemy 2.x async: `AsyncSession`, `selectinload` vs `joinedload`
- Django: `select_related`/`prefetch_related`, `F()`/`Q()` expressions, `annotate()`
- Pydantic v2: `field_validator`, `model_validator`, discriminated unions
- Celery: task routing, `acks_late`, `autoretry_for`, periodic tasks (beat)

---

### php-specialist
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** PHP / Laravel / Symfony Expert

**Stack:** PHP 8.2+, Laravel (hoặc Symfony), Eloquent (hoặc Doctrine), Pest/PHPUnit, Horizon

**Chuyên sâu:**
- PHP 8 enums: backed enums, `from()`/`tryFrom()`, enum methods, state machine
- Laravel: Jobs với `ShouldQueue`, Eloquent scopes + eager loading `with()`, Gates/Policies, Events/Listeners
- Symfony: DI autowiring, Messenger async handlers, Security voters
- Testing: Pest `describe/it`, `RefreshDatabase`, `Http::fake()`, `Event::fake()`
- `declare(strict_types=1)` + PHPStan level 8

---

### dotnet-specialist
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** .NET / C# Expert

**Stack:** .NET 8+, ASP.NET Core (minimal API), EF Core 8, MediatR, FluentValidation, xUnit

**Chuyên sâu:**
- C# 12: records, sealed classes, primary constructors, pattern matching, nullable reference types
- MediatR CQRS: `IRequest<T>`, `IRequestHandler`, `IPipelineBehavior` (validation + logging)
- EF Core 8: `AsSplitQuery()`, `AsNoTracking()`, `ExecuteUpdateAsync`/`ExecuteDeleteAsync` (bulk)
- ASP.NET Core: minimal API với lambda DSL Security, `IOptions<T>`, `ConfigureAwait(false)`
- Virtual threads: `spring.threads.virtual.enabled=true` equivalent → Task/ValueTask properly

---

### java-specialist
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Java / Spring Boot Expert

**Stack:** Java 21, Spring Boot 3, Spring Security 6, Spring Data JPA, Hibernate, JUnit 5 + Mockito

**Chuyên sâu:**
- Java 21: Records (DTO), sealed classes, pattern matching switch, virtual threads (Project Loom)
- Spring Security 6: `SecurityFilterChain` lambda DSL, `OncePerRequestFilter`, method security `@PreAuthorize`
- Spring Data JPA: projections, `@Query` fetch join, `@BatchSize` chống N+1, `Pageable`
- Hibernate: `FetchType.LAZY` mặc định, `@BatchSize`, JPQL
- `@Transactional(readOnly = true)` mặc định trên service class; override `@Transactional` cho writes

---

### go-specialist
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** Go Expert

**Stack:** Go 1.21+, Gin/Fiber/Chi, sqlx hoặc GORM, errgroup, testify

**Chuyên sâu:**
- Interface-driven design: small interfaces, implicit implementation, composition
- Goroutines + channels: fan-out với `errgroup`, semaphore cho bounded concurrency
- Context propagation: `ctx` là tham số đầu tiên mọi I/O function, `WithTimeout`/`WithCancel`
- Error handling: `fmt.Errorf("%w", err)`, `errors.Is`/`As`, sentinel errors
- Table-driven tests: `[]struct{ name, input, want }` pattern
- `defer` cleanup: always `rows.Close()`, `resp.Body.Close()`

---

### api-designer
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** API Contract Specialist

**Làm gì:**
- Tạo OpenAPI 3.0 YAML spec đầy đủ: endpoints, request/response schemas, status codes
- Định nghĩa authentication matrix: endpoint nào cần auth gì (Bearer, API key, public)
- Error catalogue chuẩn: format lỗi nhất quán cho toàn API
- Versioning strategy (URI `/v1/` vs header `Accept-Version`)
- Rate limiting policies, pagination contracts (cursor vs offset)
- Output: `./docs/api-spec-[feature].yaml` + `./docs/api-contracts.md`

**Chạy khi nào:** Sau solution-architect, TRƯỚC engineer-agent cho mọi API mới hoặc thay đổi endpoint lớn.

**Output mẫu:**
```yaml
openapi: 3.0.3
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      security: [{ bearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema: { $ref: '#/components/schemas/User' }
        '404':
          $ref: '#/components/responses/NotFound'
```

---

### security-auditor
**Màu:** Đỏ | **Model:** Sonnet | **Vai trò:** Security Specialist

**Làm gì:**
- OWASP Top 10 audit: injection, broken auth, SSRF, security misconfig, insecure deserialization
- Secrets scan: tìm API keys, tokens, passwords hardcoded trong code
- Dependency CVE audit: kiểm tra packages có CVE nghiêm trọng không
- Output VULN-XXX findings với severity (Critical/High/Medium/Low) và remediation steps
- Output: `./docs/security-audit-[feature].md`

**Chạy khi nào:** Song song với tech-lead-reviewer cho code liên quan đến auth, payment, user data, public API.

**Findings format:**
```
VULN-001
Severity: HIGH
Location: src/auth/login.controller.ts:42
Issue: SQL injection via unsanitized email input
Evidence: `SELECT * FROM users WHERE email = '${email}'`
Fix: Use parameterized query: db.query('SELECT * FROM users WHERE email = $1', [email])
```

---

### performance-engineer
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Backend Performance Specialist

**Làm gì:**
- Đọc và giải thích `EXPLAIN ANALYZE` output, phát hiện seq scans thay vì index scans
- Phát hiện N+1 query patterns trong ORM code
- Đánh giá caching strategy: Redis, in-memory cache, CDN layer
- Xác định bottlenecks trong API response time
- Output PERF-XXX findings với response time hiện tại và target, optimization steps
- Output: `./docs/performance-report-[feature].md`

**Chạy khi nào:** Trước release cho endpoints có > 10k rows hoặc high-traffic paths.

**Findings format:**
```
PERF-001
Endpoint: GET /api/orders
Current P99: 2,400ms | Target: < 500ms
Issue: N+1 query — loading user for each order (100 orders = 101 queries)
Fix: Add .include({ user: true }) to ORM query (1 JOIN query)
Expected improvement: ~95% latency reduction
```

---

### lead (Entry Point)
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Team Lead / Orchestrator

Điều phối toàn team, spawn agents theo pipeline, validate output, tổng hợp kết quả.

---

## Commands

### Gọi toàn bộ pipeline (khuyến nghị)
```
/lead
```

### Gọi agent cụ thể

**Core pipeline:**
```
/planner              -- Tạo implementation plan
/solution-architect   -- Thiết kế kiến trúc (general service)
/api-designer         -- Thiết kế API contract (OpenAPI 3.0)
/engineer-agent       -- Implement code (language-agnostic tasks)
/tech-lead-reviewer   -- Review code (bắt buộc)
/security-auditor     -- OWASP audit + secrets scan (song song với reviewer)
/performance-engineer -- EXPLAIN ANALYZE + N+1 + caching (trước release)
/tester               -- Chạy tests
/debugger             -- Debug issues
```

**Architecture models:**
```
/clean-architect          -- Clean/Hexagonal/DDD: layers, domain model, dependency rule audit
/microservices-engineer   -- Service decomposition, saga, circuit breaker, Docker/K8s
/event-driven-engineer    -- CQRS, Event Sourcing, outbox pattern, Kafka/RabbitMQ/SQS
```

**Language specialists:**
```
/nodejs-specialist    -- Node.js/TypeScript: NestJS, BullMQ, Prisma, Jest
/python-specialist    -- Python: FastAPI, SQLAlchemy, Pydantic v2, Celery, pytest
/php-specialist       -- PHP 8: Laravel/Symfony, Eloquent, PHP enums, Pest
/dotnet-specialist    -- C#/.NET: ASP.NET Core, MediatR CQRS, EF Core, xUnit
/java-specialist      -- Java 21: Spring Boot, Spring Security, Hibernate, JUnit 5
/go-specialist        -- Go: Gin/Fiber, goroutines, errgroup, sqlx, table tests
```

### Code — Implement từng bước theo plan
```
/code
```
Dùng sau khi đã có plan (từ `/planner` hoặc tự viết). Thực hiện tuần tự từng phase.

**Ví dụ flow:**
```
1. /planner → tạo plan tại ./plans/auth-feature.md
2. /code    → đọc plan, implement từng phase theo thứ tự
```

### Code Parallel — Implement nhiều tasks song song
```
/code:parallel
```
Dùng khi plan có nhiều tasks/components **độc lập nhau** có thể implement đồng thời.

**Khi nào dùng Code Parallel:**
- Build nhiều microservices cùng lúc
- Implement frontend component và backend API song song (nếu interface đã defined)
- Viết nhiều modules không phụ thuộc nhau

**Khi KHÔNG dùng Code Parallel:**
- Task B phụ thuộc output của Task A
- Cùng sửa một file
- Chưa có interface contracts được định nghĩa

**Ví dụ:**
```
Plan có 3 phases độc lập:
- Phase 1A: User Service (API + DB)
- Phase 1B: Notification Service
- Phase 1C: Analytics Service

→ /code:parallel sẽ spawn 3 engineer-agents chạy đồng thời
→ Nhanh hơn ~3x so với /code tuần tự
```

---

## Ví dụ prompts thực tế

**Feature mới từ đầu:**
```
/lead

Implement tính năng đăng nhập Google OAuth cho backend NestJS.
PRD tại: ./docs/prd-google-auth.md
Architecture tại: ./docs/architecture-auth.md
```

**Bug fix:**
```
/engineer-agent

Fix bug: API /api/orders trả về 500 khi user_id là null.
Stack trace: [paste stack trace]
Sau đó /tech-lead-reviewer để review fix.
```

**Investigate performance issue:**
```
/debugger

Query lấy danh sách orders mất 8 giây. Database: PostgreSQL.
Query: SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC
Table có 2M rows. Hãy phân tích và đưa ra fix.
```

**Nhiều services song song:**
```
/lead

Xây dựng 3 microservices độc lập theo plan tại ./plans/microservices.md:
- user-service
- product-service
- order-service
Chạy parallel để tiết kiệm thời gian.
```

---

## Output artifacts

| File | Mô tả |
|------|-------|
| `./plans/[feature].md` | Implementation plan từ planner |
| `./docs/architecture-[feature].md` | ADR + Architecture từ solution-architect |
| `./docs/adr/ADR-XXX.md` | Architecture Decision Records |
| Source code files | Code từ engineer-agent |
| Test files | Unit tests đi kèm code |

---

## Tech Stack hỗ trợ

Node.js/NestJS · Python/FastAPI/Django · PHP/Laravel/Symfony · .NET/ASP.NET Core · Java/Spring Boot · Go/Gin · Ruby on Rails · PostgreSQL · MySQL · Redis · Docker

---

## Lưu ý Security (bắt buộc)

- Parameterized queries — không bao giờ string-concatenate SQL
- Auth check trên mọi endpoint
- Không hardcode secrets — dùng environment variables
- Không log PII hoặc credentials
- OWASP Top 10 — tech-lead-reviewer bắt buộc check
- Conventional commits: `feat:`, `fix:`, `security:`, `refactor:`
