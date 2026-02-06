# 📊 Auto-Doc-Sync Diagrams

## 🎨 Available Diagrams

### 1. architecture.drawio - Architecture Overview
**Mô tả:** Kiến trúc tổng thể của auto-doc-sync MCP server

**Nội dung:**
- 📡 Claude Desktop connection (MCP Protocol)
- 🛠️ MCP Tools (10 tools)
- 📚 MCP Resources (3 resources)
- 🤖 MCP Prompts (4 prompts)
- 📁 Project structure
- 🔗 Git hooks integration
- 👥 Multi-dev coordination system

**Components:**
```
Claude Desktop
    ↓ (MCP Protocol - stdio)
auto-doc-sync-mcp Server
    ↓
    ├─→ Tools (10)
    │   ├─ install
    │   ├─ sync
    │   ├─ configure_modules
    │   ├─ deduplicate
    │   ├─ check_conflicts
    │   ├─ list_sessions
    │   ├─ register_session
    │   ├─ cleanup_sessions
    │   └─ end_session
    │
    ├─→ Resources (3)
    │   ├─ CHANGES.md
    │   ├─ docs/CONTEXT.md
    │   └─ docs/modules/*.md
    │
    └─→ Prompts (4)
        ├─ sync-and-review
        ├─ onboarding-guide
        ├─ tech-stack-analysis
        └─ module-coordination
```

### 2. workflow.drawio - Complete Workflow
**Mô tả:** Quy trình hoạt động chi tiết từ đầu đến cuối

**Phases:**
1. **Phase 1: Installation**
   - Install npm package
   - Configure Claude Desktop
   - Restart Claude

2. **Phase 2: Project Setup**
   - Install hooks into project
   - Create directory structure
   - Setup git post-commit hook

3. **Phase 3: Daily Usage**
   - Developer commits code
   - Hook auto-updates docs
   - Claude reads context

**Detailed Flow:**
```
git commit
    ↓
post-commit hook
    ↓
auto-doc-sync.js
    ↓
    ├─→ Update CHANGES.md
    ├─→ Update CONTEXT.md
    └─→ Update modules/*.md
        ↓
Claude reads via MCP Resources
```

## 🚀 How to Use

### Option 1: View Online (draw.io)

1. Go to https://app.diagrams.net/
2. Click "Open Existing Diagram"
3. Upload `architecture.drawio` or `workflow.drawio`

### Option 2: View in VS Code

1. Install extension: "Draw.io Integration"
2. Open `.drawio` files directly in VS Code

### Option 3: Export to PNG/SVG

```bash
# Using draw.io desktop app
1. Open draw.io app
2. File → Open → Select .drawio file
3. File → Export as → PNG/SVG
```

## 📝 Edit Diagrams

### Online Editor
1. Open https://app.diagrams.net/
2. Upload diagram
3. Edit
4. Download updated file

### VS Code
1. Install "Draw.io Integration" extension
2. Open `.drawio` file
3. Edit directly in VS Code
4. Save

## 🎨 Color Coding

| Color | Component Type | Example |
|-------|----------------|---------|
| 🔵 Blue | Core components | Claude Desktop, MCP Server |
| 🟣 Purple | MCP Tools | install, sync, check_conflicts |
| 🟢 Green | MCP Resources | CHANGES.md, CONTEXT.md |
| 🔴 Red | MCP Prompts | sync-and-review, onboarding-guide |
| 🟡 Yellow | Workflow phases | Installation, Setup, Usage |
| 🟠 Orange | Project files | .claude/hooks, .claude/wip |
| ⚪ Gray | Multi-dev | wip-tracker, conflict-checker |

## 📊 Diagram Details

### architecture.drawio
- **Canvas:** 1169 x 827 px
- **Components:** 30+
- **Layers:** Single layer
- **Format:** XML (mxfile)

### workflow.drawio
- **Canvas:** 1169 x 827 px
- **Phases:** 3 main phases
- **Flow steps:** 15+
- **Format:** XML (mxfile)

## 🔗 References

- [Draw.io Documentation](https://www.diagrams.net/doc/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Auto-Doc-Sync README](README.md)

## 💡 Tips

### For Presentations
1. Export to SVG for best quality
2. Use transparent background
3. Export each section separately if needed

### For Documentation
1. Export to PNG (high DPI)
2. Include in README or wiki
3. Update diagrams when architecture changes

### For Collaboration
1. Keep `.drawio` files in git
2. Export PNG for quick preview
3. Use comments in draw.io for notes

## 🎯 Quick Export Commands

Using draw.io CLI (if installed):
```bash
# Export to PNG
drawio -x -f png -o architecture.png architecture.drawio

# Export to SVG
drawio -x -f svg -o workflow.svg workflow.drawio

# Export to PDF
drawio -x -f pdf -o architecture.pdf architecture.drawio
```

## 📱 Mobile Viewing

Diagrams can be viewed on mobile:
1. Upload to Google Drive
2. Open with draw.io mobile app
3. Or export to PNG and view in any image viewer

---

**Created for auto-doc-sync-mcp v1.0.0**
