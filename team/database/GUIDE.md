# GUIDE — Database Team

> Hướng dẫn chi tiết cho team Cơ sở dữ liệu. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Database Team** chịu trách nhiệm về toàn bộ lớp dữ liệu: thiết kế schema, viết migrations, tối ưu queries, đảm bảo data integrity, và quản lý database performance.

**Nguyên tắc số 1:** Mọi thứ phải reversible. Không có migration nào được phép chỉ có `up` mà không có `down`.

---

## Pipeline hoạt động

```
[Yêu cầu thay đổi schema / performance issue]
        |
        v
legacy-system-analyst    <-- Phân tích schema hiện tại (nếu có DB sẵn)
        |
        v
  solution-architect     <-- Thiết kế schema mới, index strategy, ADRs
        |
        v
   engineer-agent        <-- Implement migrations + ORM models
        |
        v
       tester            <-- Validate up/down, FK integrity, performance
        |
   debugger (on-demand)  <-- Slow queries, lock contention, replication lag
```

**Shortcut chỉ tối ưu query (không thay đổi schema):**
```
debugger --> engineer-agent --> tester
```

---

## Các Agents

### legacy-system-analyst
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Database Archaeologist

**Làm gì:**
- Map toàn bộ schema hiện tại: tables, columns, indexes, foreign keys
- Tìm: orphaned tables, inconsistent naming, missing indexes, circular dependencies
- Đánh giá rủi ro của structural changes (migration feasibility)
- Output: System Intelligence Report với schema analysis

**Chạy đầu tiên bắt buộc** khi làm việc với DB hiện có. Không cần cho database mới tạo.

---

### solution-architect
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Data Architect

**Làm gì:**
- Thiết kế schema chuẩn hóa (normalization levels)
- Định nghĩa index strategy (index nào, tại sao, phục vụ query nào)
- Thiết kế partitioning, sharding nếu cần
- Chọn consistency model: strong vs eventual
- Định nghĩa data retention policies
- Viết ADRs giải thích mọi quyết định schema
- Output: Architecture Decision Records + schema design

**So sánh options:** Luôn đưa ra ít nhất 2 phương án và giải thích tại sao chọn phương án được recommend.

---

### engineer-agent
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** Database Engineer

**Làm gì:**
- Viết migration files (`up` VÀ `down` — bắt buộc không ngoại lệ)
- Implement ORM model changes, stored procedures, seed data
- Dùng transactions cho multi-step migrations
- Batch large data operations (không migrate 1M rows trong 1 transaction)
- Chạy `EXPLAIN ANALYZE` cho mọi query mới với > 10k rows

**Quy tắc cứng:**
- Migration PHẢI có `down()` — Rejected nếu thiếu
- Không DROP columns/tables mà không có explicit confirmation từ user
- Không raw SQL string concatenation — dùng parameterized queries
- Batch size tối đa 1000 rows mỗi iteration cho data migrations

**Migration format chuẩn:**
```typescript
// migration_001_add_user_profiles.ts
// Author: engineer-agent | Date: 2026-03-05 | Ticket: PROJ-123
// Description: Split user profile data into separate table

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('user_profiles', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    // ... columns
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('user_profiles');
}
```

---

### tester
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** Database QA Engineer

**Làm gì:**
- Test migration `up` và `down` — cả hai hướng bắt buộc
- Validate schema constraints: NOT NULL, UNIQUE, FK integrity
- Test: constraint violations, FK cascade behavior, index usage (EXPLAIN)
- Performance benchmarks cho critical queries
- **Rollback PHẢI pass trên staging trước khi apply production**

---

### debugger
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Database Performance Specialist

**Làm gì:**
- Phân tích slow queries qua `pg_stat_activity`, slow query logs
- Điều tra lock contention, replication lag, connection pool exhaustion
- Đọc và giải thích `EXPLAIN ANALYZE` output
- Đề xuất index changes, query rewrites, connection pool tuning

**Khi nào dùng:** On-demand — chỉ khi có performance issue hoặc errors.

---

### schema-designer
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Database Schema Specialist

**Làm gì:**
- Tạo schema blueprints chuẩn hóa: table definitions với full constraints, FK relationships
- Vẽ ERD (Entity Relationship Diagram) bằng Mermaid
- Định nghĩa index strategy: index nào, trên columns nào, phục vụ query nào
- Document data classification (PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED) per column
- Naming conventions: snake_case, plural tables, snake_case columns
- Output: `./docs/schema-design-[feature].md` + `./docs/schema-decisions.md` (ADRs)

**Chạy khi nào:** Sau legacy-system-analyst, TRƯỚC migration-engineer cho mọi structural changes.

**Output mẫu:**
```sql
-- Table: user_profiles [CONFIDENTIAL]
-- Purpose: Store extended user profile data, split from users table for PII isolation
CREATE TABLE user_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name   VARCHAR(255) NOT NULL,              -- [PII]
  phone       VARCHAR(20),                         -- [PII] nullable
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Index: lookup by user (main access pattern)
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

---

### query-optimizer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Query Performance Specialist

**Làm gì:**
- Đọc và giải thích `EXPLAIN ANALYZE` output: tìm Seq Scan, Hash Join không hiệu quả
- Phát hiện N+1 query patterns trong ORM code
- Recommend indexes cụ thể với ước tính improvement
- Output QUERY-XXX findings: current plan → issue → recommended fix → expected improvement
- Output: `./docs/query-optimization-[feature].md`

**Chạy khi nào:** Song song với schema-designer, hoặc on-demand khi có slow query reports.

**Findings format:**
```
QUERY-001
Table: orders
Current plan: Seq Scan (cost=0..45200 rows=200000) — 2,400ms P99
Issue: Full table scan on orders.user_id (no index)
Fix: CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
Expected: Index Scan (cost=0..8 rows=12) — < 5ms P99
```

---

### migration-engineer
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Safe Migration Specialist

**Làm gì:**
- Viết migration scripts `up` VÀ `down` — không có ngoại lệ
- Zero-downtime patterns: `ADD COLUMN DEFAULT NULL`, `CREATE INDEX CONCURRENTLY`
- Multi-phase deprecation cho column/table removal (không drop ngay)
- Batch large data operations (1,000 rows/batch + `pg_sleep(0.1)` giữa batches)
- Viết migration runbook cho DBA/DevOps review
- Output: migration files + `./docs/migration-runbook-[name].md`

**Quy tắc cứng:**
- PHẢI có `down()` — Rejected nếu thiếu
- `DROP TABLE/COLUMN` → phase 2 migration (tối thiểu 2 tuần sau deploy)
- Không migrate > 10k rows trong 1 transaction — phải batch
- Luôn test `down()` trên staging trước production

**Migration format chuẩn:**
```typescript
// 20260305_001_add_user_profiles.ts
// Author: migration-engineer | Ticket: PROJ-123
// Phase: 1 of 2 — Add table (phase 2 removes old columns after 2-week validation)
// Rollback: Safe — only drops new table

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('user_profiles', (t) => {
    t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    t.string('full_name', 255).notNullable();
    t.timestamps(true, true);
  });
  await db.raw('CREATE INDEX CONCURRENTLY idx_user_profiles_user_id ON user_profiles(user_id)');
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('user_profiles');
}
```

---

### lead (Entry Point)
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** Team Lead / Orchestrator

Điều phối toàn team, spawn agents, validate output từng bước.

---

## Commands

### Gọi toàn bộ pipeline (khuyến nghị)
```
/lead
```

### Gọi agent cụ thể
```
/legacy-system-analyst   -- Phân tích DB hiện tại
/schema-designer         -- Thiết kế schema chuẩn hóa + ERD + index strategy
/query-optimizer         -- EXPLAIN ANALYZE + N+1 detection + index recommendations
/migration-engineer      -- Viết safe migration scripts (up/down + zero-downtime)
/engineer-agent          -- Implement ORM models, stored procedures
/tester                  -- Validate migrations + rollback
/debugger                -- Debug slow queries, lock contention, pool exhaustion
```

### Code — Implement migration tuần tự
```
/code
```
Dùng khi đã có schema design và cần implement từng migration theo thứ tự.

**Thứ tự đúng cho migrations:**
```
1. Create new tables (không drop cũ)
2. Add new columns với default values
3. Migrate/copy data (batched)
4. Add constraints và indexes
5. Update ORM models
6. (Sau 2 tuần, khi code cũ đã deploy) Drop deprecated columns
```

### Code Parallel — Implement nhiều migrations song song
```
/code:parallel
```
Dùng khi có nhiều schema changes **hoàn toàn độc lập** nhau.

**Khi nào dùng Code Parallel:**
- Tạo nhiều tables mới không liên quan nhau
- Add indexes cho nhiều tables khác nhau
- Viết ORM models song song với migration code

**Khi KHÔNG dùng Code Parallel:**
- Migration B cần table từ Migration A
- Cùng ALTER một table
- FK từ table này sang table kia chưa được tạo

**Ví dụ hợp lệ:**
```
Cần tạo 3 tables độc lập:
- notifications table
- audit_logs table
- user_preferences table

→ /code:parallel spawn 3 engineer-agents cùng lúc
→ Mỗi agent viết migration riêng cho table của mình
→ Nhanh hơn 3x
```

---

## Ví dụ prompts thực tế

**Thêm tính năng mới cần schema change:**
```
/lead

Cần thêm tính năng user notifications.
Data requirements tại: ./docs/data-requirements-notifications.md
DB hiện tại: PostgreSQL 16, dùng Prisma ORM.
Hãy thiết kế schema và viết migrations.
```

**Phân tích DB trước khi refactor:**
```
/legacy-system-analyst

Phân tích toàn bộ schema tại database này:
CONNECTION: $DATABASE_URL (set trong .env)
Tìm: orphaned tables, missing indexes, naming inconsistencies.
Output report tại ./docs/db-analysis-$(date +%Y%m%d).md
```

**Tối ưu query chậm:**
```
/debugger

Query sau mất 12 giây, cần tối ưu:
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY order_count DESC

Table sizes: users=500K rows, orders=8M rows
Hiện tại: không có index phù hợp
```

**Migration phức tạp (tách bảng):**
```
/lead

Cần tách bảng users (850K records) thành:
- users (auth data: email, password_hash, role)
- user_profiles (profile data: name, avatar, bio, preferences)

Đây là breaking change lớn, cần:
1. Phân tích impact (legacy-system-analyst)
2. Thiết kế migration strategy 4 phases
3. Implement với zero downtime
4. Test rollback đầy đủ
```

---

## Output artifacts

| File | Mô tả |
|------|-------|
| `./docs/db-analysis-[date].md` | Schema analysis từ legacy-system-analyst |
| `./docs/architecture-[feature].md` | Schema design + ADRs |
| `migrations/migration_XXX_*.ts` | Migration files (up + down) |
| `./docs/schema-changelog.md` | Lịch sử thay đổi schema |
| ORM model files | Prisma/TypeORM/SQLAlchemy models |

---

## Checklist trước khi apply production

```
[ ] Migration down() đã được test thành công
[ ] Backup đã được verify (không chỉ tạo, phải restore test)
[ ] Đã chạy trên staging trước
[ ] EXPLAIN ANALYZE trên queries mới đã được review
[ ] Có rollback plan nếu có vấn đề
[ ] Estimated downtime: [N/A | X minutes] đã được communicate
[ ] Scheduled vào low-traffic window (nếu có downtime)
```

---

## Security bắt buộc

- Không hardcode connection strings — dùng secret manager hoặc env vars
- PII columns phải được document và encrypt at rest (cho `[RESTRICTED]`)
- Application DB user: chỉ cấp quyền tối thiểu — không SUPERUSER, không DDL rights trên production
- Mọi migration phải có author, date, ticket reference trong comment đầu file
- Phân loại data: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]` / `[RESTRICTED]`
