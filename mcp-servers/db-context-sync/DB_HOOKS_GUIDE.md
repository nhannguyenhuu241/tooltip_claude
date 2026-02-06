# Database Context Hooks Guide

## Tổng Quan

DB Context Sync MCP Server bao gồm hệ thống hooks tự động giúp Claude luôn có đầy đủ context về database khi làm việc với code liên quan đến database.

## Hooks Có Sẵn

### 1. db-context-inject.js (PreToolUse Hook)

**Mục đích**: Tự động inject database context vào Claude trước khi thực hiện thao tác liên quan đến database.

**Kích hoạt khi**:
- Edit/Write file trong các thư mục: `repository/`, `entities/`, `models/`, `prisma/`, `migrations/`
- File có tên pattern: `.repository.ts`, `.entity.ts`, `.model.ts`, `schema.prisma`
- Bash command chứa keywords: `prisma`, `migration`, `sequelize`, `typeorm`, etc.
- Code chứa keywords: `findMany`, `findUnique`, `@relation`, `repository`, etc.

**Output**:
```
📊 [DB-CONTEXT-INJECT] Database Context (auto-injected)
   Reason: DB file: user.repository.ts

## Models (5)
### User
id: Int [PK], email: String [UNIQUE], name: String?, posts: Post[] [FK], ...

### Post
id: Int [PK], title: String, authorId: Int [FK], ...

## Enums (2)
- Role: ADMIN, USER, GUEST
- Status: ACTIVE, INACTIVE

## Quick Tips
- Full schema: `prisma/schema.prisma`
- ERD diagram: `docs/database-schema.md`
- After schema changes: Run `prisma migrate dev`
```

**Cache**: 10 phút (tránh spam context)

### 2. db-schema-watcher.js (PostToolUse Hook)

**Mục đích**: Tự động cập nhật documentation khi schema thay đổi.

**Kích hoạt khi**:
- Chạy migration commands:
  - Prisma: `prisma migrate dev`, `prisma db push`, etc.
  - Sequelize: `sequelize db:migrate`
  - TypeORM: `typeorm migration:run`
  - Knex: `knex migrate`
  - Alembic: `alembic upgrade`
  - Rails: `rails db:migrate`
  - Diesel: `diesel migration run`
- Edit/Write schema files:
  - `schema.prisma`
  - `.entity.ts`, `models.py`
  - `migrations/*.sql`, `migrations/*.ts`
- Schema hash thay đổi

**Output**:
```
📊 [DB-SCHEMA-WATCHER] Database context updated!
   Trigger: Migration command: prisma migrate dev
   Models: 5
   Migrations: 12
   Latest: 20240115_add_user_roles
   Updated: docs/database-context.md

   💡 Run `scan_database` for full ERD regeneration
```

**Auto-updates**:
- `docs/database-context.md` - Quick summary
- `.claude/cache/schema-hash.json` - Hash tracking

## Cài Đặt

### Sử dụng MCP Tool

```
Gọi tool: install_db_hooks
Parameters:
  project_path: "/path/to/your/project"
```

### Manual Installation

1. Copy hooks vào project:
```bash
mkdir -p .claude/hooks/db-context-sync
cp templates/db-context-inject.js .claude/hooks/db-context-sync/
cp templates/db-schema-watcher.js .claude/hooks/db-context-sync/
```

2. Cập nhật `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/db-context-sync/db-context-inject.js"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/db-context-sync/db-schema-watcher.js"
        }]
      }
    ]
  }
}
```

3. Thêm vào `.gitignore`:
```
.claude/cache/
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLAUDE_PROJECT_DIR` | Project root directory | `process.cwd()` |
| `DB_CONTEXT_CACHE_TTL` | Context inject cache TTL (ms) | 600000 (10 min) |
| `DB_CONTEXT_DISABLED` | Disable context injection | false |

### Customizing Keywords

Edit `db-context-inject.js` để thêm/bớt keywords:

```javascript
const DB_KEYWORDS = [
  // Add your custom keywords
  'mycustomorm', 'myrepository', 'mydatabase',
  // ... existing keywords
];

const DB_FILE_PATTERNS = [
  // Add your custom patterns
  /\.dao\.(ts|js)$/,
  /dataaccess\//,
  // ... existing patterns
];
```

### Customizing Migration Patterns

Edit `db-schema-watcher.js`:

```javascript
const MIGRATION_PATTERNS = [
  // Add your custom migration commands
  /mycustomcli\s+migrate/i,
  // ... existing patterns
];
```

## Workflow Tích Hợp

### Typical Development Flow

```
1. Developer modifies schema.prisma
   └── db-schema-watcher detects change
       └── Updates docs/database-context.md

2. Developer runs: prisma migrate dev
   └── db-schema-watcher detects migration
       └── Updates docs/database-context.md
       └── Suggests: "Run scan_database for full ERD"

3. Developer starts editing user.repository.ts
   └── db-context-inject activates
       └── Injects current DB context into Claude
       └── Claude now knows: tables, relationships, recent migrations

4. Claude suggests code with correct:
   - Table names
   - Field names
   - Relationship types
   - No hallucination!
```

### Multi-Developer Scenario

```
Developer A                    Developer B
     │                              │
     │ Creates new table            │
     │ Runs migration               │
     │      │                       │
     │      └── docs/database-context.md updated
     │                              │
     │ git push                     │
     │                              │
     │                         git pull
     │                              │
     │                         Opens repository file
     │                              │
     │                         db-context-inject activates
     │                              │
     │                         Claude sees new table!
     │                              │
     └──────────────────────────────┘
           Both have same context
```

## Troubleshooting

### Context không inject

1. Kiểm tra file pattern có match:
```javascript
// Debug: thêm console.log vào db-context-inject.js
console.error('[DEBUG] File path:', filePath);
console.error('[DEBUG] Matches:', DB_FILE_PATTERNS.some(p => p.test(filePath)));
```

2. Kiểm tra cache:
```bash
# Clear cache
rm -rf .claude/cache/db-context-inject-last.json
```

3. Kiểm tra schema exists:
```bash
ls prisma/schema.prisma
```

### Schema watcher không trigger

1. Kiểm tra command pattern:
```javascript
// Debug: thêm console.log vào db-schema-watcher.js
console.error('[DEBUG] Command:', command);
console.error('[DEBUG] Matches:', MIGRATION_PATTERNS.some(p => p.test(command)));
```

2. Kiểm tra migration directory:
```bash
ls prisma/migrations/
```

### Hook không chạy

1. Verify settings.json:
```bash
cat .claude/settings.json | jq '.hooks'
```

2. Check Node.js:
```bash
node --version  # Should be 16+
```

3. Check hook executable:
```bash
node .claude/hooks/db-context-sync/db-context-inject.js
# Should exit with code 0
```

## Best Practices

### 1. Chạy scan_database sau khi setup

```
Tool: scan_database
Parameters:
  project_path: "/path/to/project"
  db_type: "prisma"
```

### 2. Review generated docs

Sau khi chạy scan_database, review:
- `docs/database-schema.md` - Mermaid ERD
- `docs/database-context.md` - AI context

### 3. Commit context files

```bash
git add docs/database-schema.md docs/database-context.md
git commit -m "docs: update database schema documentation"
```

### 4. Team sync

Khi team member khác pull:
1. Hooks auto-detect nếu có migration mới
2. Context được inject khi làm việc với DB code
3. Không cần manual sync

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success (allow operation to continue) |
| 2 | Block (used for critical errors only) |

Hooks luôn exit 0 để không block workflow. Errors được log ra stderr.

## Related Tools

| Tool | Description |
|------|-------------|
| `scan_database` | Full schema scan và ERD generation |
| `update_schema` | Re-scan với settings đã lưu |
| `compare_schemas` | So sánh schema cũ/mới |
| `generate_sql` | Generate SQL từ Prisma schema |
| `get_migration_history` | Xem lịch sử migrations |
| `check_schema_changes` | Kiểm tra schema có thay đổi |
| `install_db_hooks` | Cài đặt hooks vào project |
