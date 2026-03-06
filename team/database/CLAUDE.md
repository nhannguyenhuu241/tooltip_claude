# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: database engine, ORM/query builder, migration tool, connection pooling].
- **Source code location**: [path or repo URL]
- **Stack**: [e.g., PostgreSQL 16, Prisma ORM, PgBouncer, Redis for caching]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — project name, DB description
2. `docker-compose.yml` — database engine, version, ports, services
3. `.env.example` — connection strings, pool settings
4. `prisma/schema.prisma` / `models.py` / `**/migrations/` / `db/schema.rb` — ORM, migration tool, existing models
5. Migration files (newest 5) — recent schema changes, current state
6. Connection pooler config (PgBouncer, HikariCP) if present
7. Seed files — data patterns, initial data

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Database engine**: [AUTO: e.g., PostgreSQL 16, MySQL 8.0, MongoDB 7, SQLite]
- **ORM / query builder**: [AUTO: e.g., Prisma, TypeORM, SQLAlchemy, Drizzle, Eloquent, GORM]
- **Migration tool**: [AUTO: e.g., Prisma Migrate, Alembic, Flyway, Liquibase, native Rails]
- **Connection pooler**: [AUTO: e.g., PgBouncer, HikariCP — or "none detected"]
- **Cache layer**: [AUTO: e.g., Redis, Memcached — or "none detected"]
- **Schema location**: [AUTO: e.g., prisma/schema.prisma, models/, db/schema.rb]
- **Migration folder**: [AUTO: e.g., prisma/migrations/, alembic/versions/]
- **Existing main tables/collections**: [AUTO: top-level entities from schema scan]
- **Replication / sharding**: [AUTO: from docker-compose or config — or "none detected"]
- **Estimated DB size**: [UNKNOWN — fill in manually]
- **Source root**: [AUTO: path]

### Build & Development Commands
```bash
# [AUTO: from README or package.json/Makefile]
# migrate up: ...
# migrate down: ...
# generate ORM client: ...
# seed: ...
# studio / GUI: ...
# connect (debug): ...
```

---

## Architecture
> Fill in after auto-learning or manually.

- **Schema location**: [AUTO or manual]
- **Migration tool**: [AUTO or manual]
- **Key tables/collections**: [AUTO or manual]
- **Replication / sharding**: [AUTO or manual]

---

# Generate ORM client (after schema changes)
# [e.g., npx prisma generate]

# Open DB studio / GUI
# [e.g., npx prisma studio]

# Seed database
# [e.g., npx prisma db seed / python seed.py]

# Run DB tests
# [e.g., npm run test:db / pytest tests/db/]

# Connect to DB (debugging)
# [e.g., psql $DATABASE_URL]

# Check query performance
# [e.g., EXPLAIN ANALYZE <query>]
```

## Architecture

### [Describe your database architecture here]
- **Schema location**: [e.g., `prisma/schema.prisma` / `migrations/`]
- **Migration tool**: [e.g., Prisma Migrate, Alembic, Flyway, Liquibase]
- **ORM**: [e.g., Prisma, TypeORM, SQLAlchemy, Drizzle]
- **Key tables/collections**: [list main entities]
- **Replication / sharding**: [if applicable]

## Agent Workflow — Database Team

This team specializes in **schema design, migration engineering, query optimization, and data integrity**. Use the pipeline below.

### 1. Analyzing Existing Data Model → `legacy-system-analyst`
- **Always run first** when working on an existing database
- Maps current schema, identifies technical debt, orphaned tables, inconsistent naming
- Assesses migration feasibility and risk for structural changes
- Output: System Intelligence Report with schema analysis

### 2. Schema Design → `schema-designer`
- Triggered after analysis or when new data requirements arrive
- Produces normalized schema blueprints: table definitions with full constraints, FK relationships, ERD
- Defines index strategy, partitioning approach, naming conventions
- Documents data classification (PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED) per column
- Output: `./docs/schema-design-[feature].md` with ERD diagram + `./docs/schema-decisions.md` ADRs
- **Never implement migrations without this step for structural changes**

### 3. Query Optimization → `query-optimizer`
- Run **in parallel with schema-designer** when performance requirements are known, or on-demand for slow queries
- Interprets `EXPLAIN ANALYZE` output, detects N+1 query patterns, identifies missing indexes
- Outputs QUERY-XXX findings: current plan, issue, recommended index/rewrite, expected improvement
- Output: `./docs/query-optimization-[feature].md`

### 4. Migration Engineering → `migration-engineer`
- Implements safe migration scripts after schema-designer blueprint is approved
- **Every migration has `up` and `down` scripts**
- Zero-downtime patterns: `ADD COLUMN DEFAULT NULL`, `CREATE INDEX CONCURRENTLY`, multi-phase deprecation
- Batches large data operations (1,000 rows/batch with `pg_sleep(0.1)`)
- Output: migration files in project migration folder + `./docs/migration-runbook-[name].md`

### 5. Implementation → `engineer-agent`
- Implements ORM model changes, stored procedures, seed data when needed
- Uses parameterized queries exclusively — never string-concatenated SQL
- Run `EXPLAIN ANALYZE` on any new query touching > 10k rows

### 6. Testing → `tester`
- Validates migrations (up and down), schema constraints, query correctness
- Tests: constraint violations, FK integrity, index usage, migration rollback, performance benchmarks
- **Rollback must be tested** on staging before production apply

### 7. Debugging → `debugger`
- Investigate slow queries, lock contention, replication lag, connection pool exhaustion
- Analyzes `pg_stat_activity`, slow query logs, `EXPLAIN ANALYZE` plans
- Provides optimization recommendations

### General Rules

- **Pipeline order**: legacy-system-analyst → schema-designer → migration-engineer → tester
- **query-optimizer runs in parallel** with schema-designer or on-demand for slow query investigations
- **Never skip schema-designer** for structural changes (adding/removing tables, columns, indexes)
- **All migrations must be reversible** — no exceptions
- **Test rollback** on staging before applying to production
- **For query optimization only**: query-optimizer → engineer-agent (ORM fix) → tester
- **Document every index** — include rationale and target queries in migration file comments

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- **Never hardcode** database connection strings, usernames, passwords, or encryption keys in migration files, seed scripts, or ORM configs
- Use secret managers (HashiCorp Vault, AWS SSM, environment variables) for all credentials — never commit `.env` with real values
- If credentials are found in code or migration files, **flag immediately** and rotate before continuing
- Database passwords must meet complexity requirements; document rotation schedule in `./docs/db-security.md`

### Data Handling & Privacy
- **PII columns** (names, emails, phone numbers, national IDs, payment data) must be identified and documented in schema comments
- PII must be encrypted at rest for `RESTRICTED` classification columns; use column-level encryption or application-layer encryption
- Do not use production data in development or staging — use anonymized dumps or synthetic generators only
- Implement **data retention policies**: define TTL, archival, and deletion strategy for each table containing PII; document in migration comments
- Apply data minimization: do not add columns that are not required by a confirmed business requirement

### Code Security Standards
- **SQL injection**: use parameterized queries and ORM query builders exclusively — never string-concatenate user input into SQL
- **Stored procedures**: validate inputs; avoid dynamic SQL inside procedures; grant execute-only permissions to application role
- **Access control**: apply principle of least privilege — application DB user must have only the permissions it needs (no SUPERUSER, no DDL rights in production)
- **Audit tables**: for sensitive entities (users, payments, permissions), implement audit logging (created_by, updated_at, updated_by, change_reason)
- Validate all foreign key relationships and constraints — do not allow orphaned records in critical tables

### Destructive Operations
- **Require explicit user confirmation** before executing: `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `DELETE` without `WHERE`, or any production DDL
- Confirm a backup exists and is verified before running any destructive migration in production
- Never apply migrations to production directly — must pass staging first with rollback tested
- All destructive operations must have a documented rollback script in the migration's `down()` function
- Never drop columns/tables that may still be referenced by application code — coordinate with backend team first

### Audit & Compliance
- Every migration file must include: author, date, ticket reference, and description of the change
- Document data classification for every new table in schema comments: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]` / `[RESTRICTED]`
- Flag any schema change that may affect GDPR/PDPA compliance (new PII storage, cross-border data, retention change) — stop and confirm with user
- Maintain `./docs/schema-changelog.md` — update after every migration that reaches production

