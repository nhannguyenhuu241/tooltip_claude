# MCP Servers for Claude Desktop

**Version:** 1.0.0
**Author:** NhanNH26
**License:** MIT

---

## 📦 Two Powerful MCP Servers

### 1. auto-doc-sync-mcp
Auto documentation synchronization with multi-dev coordination

### 2. db-context-sync-mcp
Database schema scanning with Mermaid ERD generation

---

## 📖 Complete Documentation

**Read the comprehensive guide:**

👉 **[COMPLETE-GUIDE.md](COMPLETE-GUIDE.md)** 👈

This single file contains everything you need:
- ✅ Architecture diagrams
- ✅ Installation guide
- ✅ Usage examples
- ✅ Publishing guide
- ✅ Update workflow
- ✅ API reference
- ✅ Troubleshooting
- ✅ Best practices

---

## ⚡ Quick Start

### Install

```bash
npm install -g auto-doc-sync-mcp db-context-sync-mcp
```

### Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "auto-doc-sync": {
      "command": "auto-doc-sync-mcp"
    },
    "db-context-sync": {
      "command": "db-context-sync-mcp"
    }
  }
}
```

### Restart Claude Desktop

Restart to load MCP servers.

---

## 📚 Documentation Structure

```
mcp-servers/
├── README.md                   ← You are here
├── COMPLETE-GUIDE.md          ← 📖 READ THIS FIRST!
├── auto-doc-sync/
│   ├── README.md              ← npm package description
│   ├── QUICKSTART.md          ← quick reference
│   ├── CHANGELOG.md           ← version history
│   ├── architecture.drawio    ← architecture diagram
│   └── workflow.drawio        ← workflow diagram
└── db-context-sync/
    ├── README.md              ← npm package description
    ├── QUICKSTART.md          ← quick reference
    └── CHANGELOG.md           ← version history
```

---

## 🎯 What You Get

| Feature | auto-doc-sync | db-context-sync |
|---------|---------------|-----------------|
| **Auto Documentation** | ✅ CHANGES.md, CONTEXT.md | ✅ Schema docs, ERD |
| **Team Coordination** | ✅ Multi-dev sync | ❌ |
| **AI Context** | ✅ Real-time | ✅ Database structure |
| **Conflict Detection** | ✅ WIP tracking | ❌ |
| **Visual Diagrams** | ❌ | ✅ Mermaid ERD |
| **Multi-language** | ✅ 5 languages | ❌ |
| **Multi-database** | ❌ | ✅ 4 databases |

---

## 🚀 Quick Commands

### auto-doc-sync
```
User: Install auto-doc-sync
User: Sync project
User: Check conflicts for file.dart
User: List active sessions
```

### db-context-sync
```
User: Scan database from Prisma schema
User: Generate MySQL SQL from Prisma
User: Use prompt database-analysis
```

---

## 📞 Support

- **Documentation:** [COMPLETE-GUIDE.md](COMPLETE-GUIDE.md)
- **npm:**
  - https://www.npmjs.com/package/auto-doc-sync-mcp
  - https://www.npmjs.com/package/db-context-sync-mcp
- **GitHub:**
  - https://github.com/NhanNH26/auto-doc-sync-mcp
  - https://github.com/NhanNH26/db-context-sync-mcp

---

## 🎉 Get Started

👉 **[Read COMPLETE-GUIDE.md](COMPLETE-GUIDE.md)** 👈

Everything you need is there! 📚
