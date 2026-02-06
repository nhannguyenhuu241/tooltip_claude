# Installation Guide - db-context-sync-mcp

## ✨ Super Easy Installation!

### Global Installation (Recommended)

```bash
npm install -g db-context-sync-mcp
```

### Using npx (No installation required)

```bash
npx db-context-sync-mcp
```

## 🚀 Quick Start

### 1. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "db-context-sync": {
      "command": "db-context-sync-mcp"
    }
  }
}
```

### 2. Restart Claude Desktop

Restart Claude Desktop to load the MCP server.

### 3. Scan Your Database

**For Prisma projects:**

```
User: Scan database from Prisma schema
```

**For MySQL/PostgreSQL:**

```
User: Scan MySQL database with connection string mysql://user:pass@localhost:3306/dbname
```

**For SQLite:**

```
User: Scan SQLite database at path ./dev.db
```

### 4. Install Auto Hooks (Optional)

```
User: Install database hooks for this project
```

This enables:
- ✅ Auto DB context injection when editing DB code
- ✅ Auto schema updates after migrations
- ✅ Migration history tracking

## 📦 Package Information

- **Package Name:** `db-context-sync-mcp` (unscoped)
- **Version:** 1.0.0
- **License:** MIT
- **Author:** NhanNH26

## 🎯 What You Get

### Documentation Files

After scanning, you'll have:

- `docs/database-schema.md` - Mermaid ERD + table details
- `docs/database-context.md` - AI-readable context

### MCP Tools

- `scan_database` - Scan and document database
- `update_schema` - Update documentation
- `compare_schemas` - Compare versions
- `generate_sql` - Convert Prisma to SQL
- `create_database` - Execute SQL scripts
- `install_db_hooks` - Install auto hooks
- `get_migration_history` - View migrations
- `check_schema_changes` - Detect changes

### MCP Prompts

- `database-analysis` - Analyze schema quality
- `migration-planning` - Plan migrations
- `query-optimization` - Optimize queries

## 🔗 Links

- **npm:** https://www.npmjs.com/package/db-context-sync-mcp
- **GitHub:** https://github.com/NhanNH26/db-context-sync-mcp

## 💡 Why Unscoped?

Unscoped packages are easier to use:

✅ Short command: `npm install -g db-context-sync-mcp`
✅ Simple npx: `npx db-context-sync-mcp`
❌ No scope needed: No `@username/` prefix

## 🆘 Troubleshooting

### "command not found: db-context-sync-mcp"

Install globally first:
```bash
npm install -g db-context-sync-mcp
```

### "Cannot find Prisma schema"

Ensure `prisma/schema.prisma` exists in your project root.

### "Connection failed" (MySQL/PostgreSQL)

Check your connection string format:
- MySQL: `mysql://user:password@host:port/database`
- PostgreSQL: `postgresql://user:password@host:port/database`

### Mermaid diagrams not rendering

Mermaid diagrams render in:
- ✅ GitHub/GitLab
- ✅ VS Code (with Mermaid extension)
- ✅ Claude Desktop

## 🎉 You're Ready!

Start using db-context-sync in your projects:

```bash
# Install
npm install -g db-context-sync-mcp

# Or use directly
npx db-context-sync-mcp
```

Happy coding! 🚀
