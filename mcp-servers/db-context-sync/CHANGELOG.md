# Changelog

All notable changes to the DB Context Sync MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added
- Initial public release
- Database schema scanning and documentation
- MCP Tools: `scan_database`, `update_schema`, `compare_schemas`, `generate_sql`, `create_database`
- Auto hooks system:
  - `install_db_hooks` - Install hooks into project
  - `get_migration_history` - View migration history
  - `check_schema_changes` - Detect schema changes
- Database context injection hooks:
  - `db-context-inject.js` - PreToolUse hook for auto-injecting DB context
  - `db-schema-watcher.js` - PostToolUse hook for watching schema changes
- MCP Resources: database-schema.md, database-context.md
- MCP Prompts: `database-analysis`, `migration-planning`, `query-optimization`
- Support for multiple databases:
  - ✅ Prisma (full support)
  - ✅ MySQL (via connection string)
  - ✅ PostgreSQL (via connection string)
  - ✅ SQLite (via file path)
- Mermaid ERD generation
- Prisma to SQL conversion
- Database creation from SQL scripts
- Version tracking and schema comparison
- Auto-update documentation on schema changes

### Features
- ✅ Auto-generate Mermaid Entity Relationship Diagrams
- ✅ Parse Prisma schema and relationships
- ✅ Direct database scanning (MySQL, PostgreSQL, SQLite)
- ✅ Generate comprehensive documentation
- ✅ AI-powered database analysis prompts
- ✅ Migration planning and optimization
- ✅ Auto context injection when editing DB code
- ✅ Schema change detection and alerts
- ✅ Migration history tracking
- ✅ Convert Prisma schema to SQL (MySQL, PostgreSQL, SQLite)
- ✅ Execute SQL scripts to create databases

### Documentation
- Comprehensive README with installation and usage guide
- QUICKSTART guide for fast setup
- FEATURES_SUMMARY with complete feature list
- ARCHITECTURE documentation
- COMPLETE_WORKFLOW end-to-end workflow guide
- DB_HOOKS_GUIDE for auto hooks system
- DIRECT_DATABASE_SCANNING guide for MySQL/PostgreSQL/SQLite
- SQL_GENERATION guide for Prisma to SQL conversion
- APPROACHES_COMPARISON comparing different scanning methods
