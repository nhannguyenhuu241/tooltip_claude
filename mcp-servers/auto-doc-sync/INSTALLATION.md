# Installation Guide - auto-doc-sync-mcp

## ✨ Super Easy Installation!

### Global Installation (Recommended)

```bash
npm install -g auto-doc-sync-mcp
```

### Using npx (No installation required)

```bash
npx auto-doc-sync-mcp
```

## 🚀 Quick Start

### 1. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "auto-doc-sync": {
      "command": "auto-doc-sync-mcp"
    }
  }
}
```

### 2. Restart Claude Desktop

Restart Claude Desktop to load the MCP server.

### 3. Install in Your Project

In Claude Code, run:

```
User: Install auto-doc-sync into this project
```

Claude will automatically:
1. Detect project type (Flutter, Node.js, Python, etc.)
2. Create `.claude/hooks/auto-doc-sync/auto-doc-sync.js`
3. Install git post-commit hook
4. Create `CHANGES.md`, `docs/CONTEXT.md`, `docs/modules/`

## 📦 Package Information

- **Package Name:** `auto-doc-sync-mcp` (unscoped)
- **Version:** 1.0.0
- **License:** MIT
- **Author:** NhanNH26

## 🔗 Links

- **npm:** https://www.npmjs.com/package/auto-doc-sync-mcp
- **GitHub:** https://github.com/NhanNH26/auto-doc-sync-mcp

## 💡 Why Unscoped?

Unscoped packages are easier to use:

✅ Short command: `npm install -g auto-doc-sync-mcp`
✅ Simple npx: `npx auto-doc-sync-mcp`
❌ No scope needed: No `@username/` prefix

Compare with scoped packages:
- Scoped: `npm install -g @username/package-name`
- Unscoped: `npm install -g package-name` ← Much simpler!

## 🆘 Troubleshooting

### "command not found: auto-doc-sync-mcp"

Install globally first:
```bash
npm install -g auto-doc-sync-mcp
```

### "Cannot find module"

Ensure Node.js ≥18.0.0:
```bash
node --version
```

### MCP server not appearing in Claude

1. Check config file path
2. Ensure JSON syntax is correct
3. Restart Claude Desktop completely

## 🎉 You're Ready!

Start using auto-doc-sync in your projects with simple commands:

```bash
# Install
npm install -g auto-doc-sync-mcp

# Or use directly
npx auto-doc-sync-mcp
```

Happy coding! 🚀
