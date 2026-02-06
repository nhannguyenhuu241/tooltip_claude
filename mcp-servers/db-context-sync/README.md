# DB Context Sync MCP Server

**Tự động scan database schema và generate Mermaid diagrams** - Lưu vào context để AI hiểu database structure.

## 🎯 Tính Năng

- ✅ **Scan database schema** - MySQL, PostgreSQL, SQLite, Prisma
- ✅ **Generate Mermaid ERD** - Entity Relationship Diagram tự động
- ✅ **Lưu vào context files** - AI có thể đọc và phân tích
- ✅ **Auto-update** - Cập nhật khi database thay đổi
- ✅ **AI Prompts** - Database analysis, migration planning, query optimization
- ✅ **Version tracking** - So sánh schema changes
- ✅ **Prisma to SQL** - Convert Prisma schema thành SQL database (MySQL, PostgreSQL, SQLite)
- ✅ **Create Database** - Execute SQL để tạo database tự động
- ✨ **NEW: Auto Context Injection** - Tự động inject DB context khi Claude làm việc với database code
- ✨ **NEW: Schema Watcher** - Tự động cập nhật docs sau migrations
- ✨ **NEW: Migration History** - Xem lịch sử migrations

## 📦 Cài Đặt

### 1. Cài MCP Server

```bash
npm install -g @claudekit/db-context-sync-mcp
```

### 2. Cấu Hình Claude Desktop

Thêm vào `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "db-context-sync": {
      "command": "db-context-sync-mcp"
    }
  }
}
```

### 3. Restart Claude Desktop

## 🚀 Sử Dụng

### Bước 1: Scan Database

**Với Prisma Schema:**

```
User: Scan database từ Prisma schema
```

Claude sẽ:
1. Đọc `prisma/schema.prisma`
2. Parse models và relationships
3. Generate Mermaid ERD
4. Tạo `docs/database-schema.md`
5. Tạo `docs/database-context.md`

**Với MySQL/PostgreSQL:**

```
User: Scan MySQL database với connection string mysql://user:pass@localhost:3306/dbname
```

### Bước 2: Xem Schema

```
User: Xem database schema
```

Claude sẽ hiển thị Mermaid diagram và table details.

### Bước 3: Analysis

```
User: Use prompt database-analysis
```

Claude sẽ phân tích:
- Table structure
- Relationships
- Missing indexes
- Normalization issues
- Performance improvements

## 🛠️ MCP Tools Available

### 1. `scan_database`

Scan database và generate documentation

```
User: Scan Prisma database
User: Scan MySQL database với connection mysql://...
```

**Parameters:**
- `project_path` (required): Project root path
- `db_type` (required): 'mysql', 'postgresql', 'sqlite', 'prisma'
- `connection_string` (optional): Connection string (không cần cho Prisma)

### 2. `update_schema`

Cập nhật schema documentation

```
User: Update database schema
```

### 3. `compare_schemas`

So sánh schema với version trước

```
User: Compare database schemas
```

### 4. `generate_sql` ✨ NEW

Convert Prisma schema thành SQL database

```
User: Generate MySQL SQL from Prisma schema
User: Convert Prisma to PostgreSQL
User: Create SQLite schema
```

**Parameters:**
- `project_path` (required): Project root path
- `target_db` (required): 'mysql' | 'postgresql' | 'sqlite'
- `output_file` (optional): Custom output path

**Output:** SQL file (`schema-mysql.sql`, `schema-postgresql.sql`, etc.)

### 5. `create_database`

Execute SQL script để tạo database

```
User: Create MySQL database from schema-mysql.sql
User: Execute PostgreSQL schema
```

**Parameters:**
- `sql_file` (required): Path to SQL file
- `connection_string` (required): Database connection string
- `db_type` (required): 'mysql' | 'postgresql' | 'sqlite'

### 6. `install_db_hooks` ✨ NEW

Cài đặt hooks tự động vào project

```
User: Install database hooks for this project
User: Setup automatic DB context injection
```

**Parameters:**
- `project_path` (required): Project root path

**Cài đặt:**
- `db-context-inject.js` - PreToolUse hook
- `db-schema-watcher.js` - PostToolUse hook
- Cập nhật `.claude/settings.json`

### 7. `get_migration_history` ✨ NEW

Xem lịch sử migrations

```
User: Show migration history
User: List recent database migrations
```

**Parameters:**
- `project_path` (required): Project root path
- `limit` (optional): Số lượng migrations (default: 10)

### 8. `check_schema_changes` ✨ NEW

Kiểm tra schema có thay đổi

```
User: Check if database schema changed
User: Compare current schema with last sync
```

**Parameters:**
- `project_path` (required): Project root path

## 🔄 Auto Hooks System ✨ NEW

### Overview

DB Context Sync bao gồm hệ thống hooks tự động:

| Hook | Type | Trigger | Action |
|------|------|---------|--------|
| `db-context-inject.js` | PreToolUse | DB code editing | Inject schema context |
| `db-schema-watcher.js` | PostToolUse | Migrations run | Update docs |

### Cài Đặt Hooks

```
User: Install database hooks for this project
```

Hoặc manual:
```bash
# Copy hooks
mkdir -p .claude/hooks/db-context-sync
cp templates/*.js .claude/hooks/db-context-sync/

# Update settings.json
# See DB_HOOKS_GUIDE.md for details
```

### db-context-inject.js

**Kích hoạt khi:**
- Edit file: `*.repository.ts`, `*.entity.ts`, `schema.prisma`
- Edit trong: `prisma/`, `migrations/`, `models/`
- Code chứa: `findMany`, `@relation`, `repository`, etc.

**Output:**
```
📊 [DB-CONTEXT-INJECT] Database Context (auto-injected)
   Reason: DB file: user.repository.ts

## Models (5)
### User
id: Int [PK], email: String [UNIQUE], name: String?, ...
```

### db-schema-watcher.js

**Kích hoạt khi:**
- Chạy: `prisma migrate dev`, `sequelize db:migrate`, etc.
- Edit: `schema.prisma`, `*.migration.sql`

**Output:**
```
📊 [DB-SCHEMA-WATCHER] Database context updated!
   Trigger: Migration command: prisma migrate dev
   Models: 5
   Migrations: 12
   Updated: docs/database-context.md
```

📖 **Chi tiết:** Xem [DB_HOOKS_GUIDE.md](DB_HOOKS_GUIDE.md)

## 📚 MCP Resources Available

### Tự động expose documentation files:

- `docs/database-schema.md` - Mermaid ERD và table details
- `docs/database-context.md` - Database metadata và relationships

Claude có thể đọc các files này trực tiếp qua MCP resources.

## 🤖 MCP Prompts Available

### 1. `database-analysis`

Phân tích database structure và suggest improvements

```
User: Use prompt database-analysis
```

**Output:**
- ✅ Điểm tốt trong schema design
- ⚠️  Vấn đề cần chú ý (missing indexes, etc.)
- 🔧 Recommendations (normalization, performance, etc.)

### 2. `migration-planning`

Plan database migrations dựa trên schema changes

```
User: Use prompt migration-planning
```

**Output:**
- Migration steps
- Data migration plan
- Rollback strategy
- Prisma/SQL migration scripts

### 3. `query-optimization`

Suggest query optimizations dựa trên schema

```
User: Use prompt query-optimization
```

**Output:**
- Index recommendations
- N+1 query prevention
- Caching strategies
- Specific query examples

## 📖 Output Examples

### docs/database-schema.md

```markdown
# Database Schema

**Auto-generated database schema documentation**

## Entity Relationship Diagram

\`\`\`mermaid
erDiagram
    User {
        Int id PK NOT NULL
        String email UNIQUE NOT NULL
        String name
        DateTime createdAt NOT NULL
    }
    Post {
        Int id PK NOT NULL
        String title NOT NULL
        String content
        Int authorId FK NOT NULL
        DateTime createdAt NOT NULL
    }
    User ||--o{ Post : "posts"
\`\`\`

## Tables

### User

| Column | Type | Constraints |
|--------|------|-------------|
| id | Int | PRIMARY KEY, NOT NULL |
| email | String | UNIQUE, NOT NULL |
| name | String | |
| createdAt | DateTime | NOT NULL |

### Post

| Column | Type | Constraints |
|--------|------|-------------|
| id | Int | PRIMARY KEY, NOT NULL |
| title | String | NOT NULL |
| content | String | |
| authorId | Int | FOREIGN KEY, NOT NULL |
| createdAt | DateTime | NOT NULL |
```

### docs/database-context.md

```markdown
# Database Context

**Auto-generated database context for AI assistants**

Last updated: 2026-01-30T08:30:00.000Z

## Summary

- **Total Tables**: 2
- **Total Relationships**: 1

## Table Overview

### User
- Fields: 4
- Primary Keys: id
- Foreign Keys: None

### Post
- Fields: 5
- Primary Keys: id
- Foreign Keys: authorId

## Relationships

- **User** → **Post** (one-to-many)
  - Field: posts → id

## AI Recommendations

### Before Modifying Schema:
1. Check relationships that might be affected
2. Review foreign key constraints
3. Consider data migration impact
4. Update Mermaid diagram after changes

### Query Optimization Tips:
1. Use indexes on frequently queried fields
2. Avoid N+1 queries on relationships
3. Consider database-specific optimizations
```

## 🎨 Workflow Thực Tế

### Kịch Bản 1: New Project Setup

```
1. Dev: tạo Prisma schema
2. Dev: "Scan database từ Prisma schema"
3. Claude: generates Mermaid ERD + context docs
4. Dev: review schema trong docs/database-schema.md
5. Dev: "Use prompt database-analysis"
6. Claude: suggests indexes, improvements
```

### Kịch Bản 2: Schema Changes

```
1. Dev: thêm table mới vào Prisma schema
2. Dev: "Update database schema"
3. Claude: re-generates documentation
4. Dev: "Compare schemas"
5. Claude: shows what changed
6. Dev: "Use prompt migration-planning"
7. Claude: generates migration plan
```

### Kịch Bản 3: Query Optimization

```
1. Dev: "Use prompt query-optimization"
2. Claude: analyzes schema
3. Claude: suggests indexes cho frequently queried fields
4. Claude: warns về N+1 query risks
5. Dev: implements recommendations
```

## 🔧 Supported Databases

### Prisma (Recommended)

✅ **Full support** - Best option
- Detects: `prisma/schema.prisma`
- Parses: models, fields, relationships
- Zero configuration

### MySQL

⚠️  **Coming soon**
- Requires connection string
- Queries INFORMATION_SCHEMA

### PostgreSQL

⚠️  **Coming soon**
- Requires connection string
- Queries information_schema

### SQLite

⚠️  **Coming soon**
- Requires database file path
- Reads sqlite_master

## 🐛 Troubleshooting

### Prisma schema not found?

```bash
# Ensure schema exists
ls prisma/schema.prisma
```

### Connection failed?

```bash
# Test connection string
mysql -h localhost -u user -p
```

### Mermaid diagram not rendering?

Mermaid diagrams render in:
- ✅ GitHub
- ✅ GitLab
- ✅ VS Code (with extension)
- ✅ Claude Desktop (in code blocks)

## 📝 License

MIT

## 🤝 Contributing

PRs welcome! Hệ thống auto-generates database documentation để AI có comprehensive context.

## 🔗 Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [Mermaid ERD Syntax](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
- [MCP Documentation](https://modelcontextprotocol.io/)

## 🌟 Why DB Context Sync?

### Traditional Approach

❌ Database structure chỉ tồn tại trong code
❌ AI không biết schema → hallucinations
❌ Manual documentation → quickly outdated
❌ No visual representation → hard to understand relationships

### With DB Context Sync

✅ Auto-generated Mermaid diagrams
✅ AI có full context về database
✅ Always up-to-date documentation
✅ Visual ERD cho team dễ hiểu
✅ AI prompts cho analysis, optimization, migrations
✅ Version tracking để compare changes

---

**Scan database → Generate Mermaid → AI có context → Better queries, migrations, và analysis!** 🎉
