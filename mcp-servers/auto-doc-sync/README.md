# Auto-Doc-Sync MCP Server

**Tự động đồng bộ documentation cho mọi dự án** - Giúp team tránh conflicts và hiểu context codebase ngay lập tức.

## 🎯 Tính Năng

- ✅ **Tự động cập nhật CHANGES.md** sau mỗi commit
- ✅ **Tạo AI Context** (CONTEXT.md) với phân loại thay đổi
- ✅ **Module docs** chi tiết cho từng module
- ✅ **Deduplication** - Không bị trùng lặp
- ✅ **Dependency warnings** - Cảnh báo khi cần install packages
- ✅ **Team sync** - Xem ai đang làm gì, module nào hot
- ✅ **Multi-language** - Hỗ trợ Flutter, Node.js, Python, Ruby, Go
- ✨ **AI Prompts** - Auto-generate prompts theo tech stack (BE/FE/Mobile)

## 📦 Cài Đặt

### 1. Cài MCP Server

```bash
npm install -g @claudekit/auto-doc-sync-mcp
```

### 2. Cấu Hình Claude Desktop

Thêm vào `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "auto-doc-sync": {
      "command": "auto-doc-sync-mcp"
    }
  }
}
```

### 3. Restart Claude Desktop

Restart Claude Desktop để load MCP server.

## 🚀 Sử Dụng

### Bước 1: Install vào Project

Trong Claude Code, chạy:

```
User: Install auto-doc-sync vào project này

Claude sẽ tự động:
1. Detect project type (Flutter, Node.js, etc.)
2. Tạo .claude/hooks/auto-doc-sync/auto-doc-sync.js
3. Install git post-commit hook
4. Tạo CHANGES.md, docs/CONTEXT.md, docs/modules/
```

### Bước 2: Test Hook

Tạo một commit bất kỳ:

```bash
git add .
git commit -m "test: verify auto-doc-sync"
```

Hook sẽ tự động chạy và cập nhật:
- ✅ CHANGES.md
- ✅ docs/CONTEXT.md
- ✅ docs/modules/*.md

### Bước 3: Sync với Team

Sau khi `git pull`, chạy:

```
User: /sync

Claude sẽ hiển thị:
- Recent changes (last 24h)
- Breaking changes
- Active modules
- Dependencies cần update
```

## 🛠️ MCP Tools Available

### 1. `install`
Cài đặt auto-doc-sync vào project

```
User: Install auto-doc-sync vào /path/to/project
```

**Parameters:**
- `project_path` (required): Đường dẫn đến project root
- `auto_detect` (optional): Auto-detect project type (default: true)

### 2. `sync`
Xem recent changes và team activity

```
User: Sync project documentation
User: Sync widgets module
```

**Parameters:**
- `project_path` (required): Project root path
- `module` (optional): Module cụ thể để deep dive

### 3. `configure_modules`
Cấu hình custom module detection rules

```
User: Configure modules với rules:
- core-* cho lib/core/*
- widgets cho lib/features/widgets/*
```

**Parameters:**
- `project_path` (required)
- `module_rules` (required): Array of {name, pattern}

### 4. `deduplicate`
Dọn dẹp duplicate entries

```
User: Deduplicate documentation
User: Deduplicate CHANGES.md only
```

**Parameters:**
- `project_path` (required)
- `target` (optional): 'all', 'changes', 'modules' (default: 'all')

### 5. `run_hook`
Chạy hook manually (không cần commit)

```
User: Run auto-doc-sync hook manually
```

## 📚 MCP Resources Available

### Tự động expose documentation files:

- `CHANGES.md` - Global changelog
- `docs/CONTEXT.md` - AI context
- `docs/modules/*.md` - Module-specific docs

Claude có thể đọc các files này trực tiếp qua MCP resources.

## 🤖 MCP Prompts Available

### Auto-generated prompts theo tech stack của project:

**4 prompts tự động customize** dựa trên Flutter/Node.js/Python/Ruby/Go:

1. **`sync-and-review`** - Xem changes + recommendations tránh conflicts
   ```
   User: Use prompt sync-and-review
   ```

2. **`onboarding-guide`** - Tạo hướng dẫn onboarding cho dev mới
   ```
   User: Use prompt onboarding-guide
   ```

3. **`tech-stack-analysis`** - Best practices cho tech stack hiện tại
   ```
   User: Use prompt tech-stack-analysis
   ```

4. **`module-coordination`** - Check module nào cần coordinate
   ```
   User: Use prompt module-coordination for widgets
   ```

**Tất cả prompts tự động:**
- ✅ Detect tech stack (Flutter, Node.js, Python, etc.)
- ✅ Read CONTEXT.md để hiểu current state
- ✅ Generate language-specific best practices
- ✅ Output bằng Tiếng Việt cho team

📖 **Chi tiết**: Xem [PROMPTS.md](PROMPTS.md)

## 🎨 Workflow Thực Tế

### Kịch Bản 1: Dev Bắt Đầu Làm Feature Mới

```
1. Dev: git pull
2. Hook tự động update docs
3. Dev: /sync
4. Claude hiển thị:
   - widgets module: 19 commits - High activity
   - Breaking changes: None
   - Dependencies: No updates needed
5. Dev: "Widgets module đang hot, tôi nên hỏi team trước"
```

### Kịch Bản 2: Review Code Sau Pull

```
1. Dev: git pull origin main
2. Hook update docs
3. Dev: /sync widgets
4. Claude show:
   - Recent changes in widgets module
   - Files affected
   - Who made changes
5. Dev biết chính xác widgets module vừa thay đổi gì
```

### Kịch Bản 3: Dependencies Update

```
1. Dev A commits pubspec.yaml changes
2. Hook detects dependency update
3. CHANGES.md shows: ⚠️ Dependencies updated - Run: flutter pub get
4. Dev B pulls code
5. Dev B: /sync
6. Claude warns: "Dependencies changed, run flutter pub get"
7. Dev B: flutter pub get
```

## 🔧 Supported Project Types

- **Flutter**: Detects `pubspec.yaml`, tracks modules in `lib/`
- **Node.js**: Detects `package.json`, tracks `src/`, `lib/`
- **Python**: Detects `requirements.txt`, tracks modules
- **Ruby**: Detects `Gemfile`
- **Go**: Detects `go.mod`
- **Generic**: Works with any Git project

## 📖 Output Examples

### CHANGES.md
```markdown
# Changes Log

## 2026-01-30

- **2a42b28** by Nguyen Huu Nhan (0 seconds ago)
  📌 Branch: `main`
  feat(docs): improve CONTEXT.md with comprehensive AI context
  📦 Modules: `other`
  Files: auto-doc-sync.js, CONTEXT.md

- **e1ca242** by Nguyen Huu Nhan (1 minute ago)
  📌 Branch: `main`
  test: verify library update detection
  📦 Modules: `other`
  ⚠️  **Dependencies updated** - Run: `flutter pub get`
  Files: pubspec.yaml
```

### docs/CONTEXT.md
```markdown
# Project Context

**Auto-generated AI Context** - Last updated: 2026-01-30T06:57:10.793Z

## 🎯 Recent Changes Summary (Last 24h)

### ✨ New Features (1)
- **2a42b28**: feat(docs): improve CONTEXT.md with comprehensive AI context
  - Affects: other

## 📊 Module Activity Analysis

### widgets
- **19 commit(s)** in last 24h
- **19 file(s)** changed
- ⚠️  **Updated**: Check [widgets.md](../modules/widgets.md) for latest changes

**Recent changes:**
- update code base (bda0ab7)

**Key files modified:**
- lib/features/widgets/buttons/primary_button.dart
- lib/features/widgets/cards/info_card.dart
- ... and 14 more

## 🤖 AI Context & Recommendations

### What AI Should Know:

1. **Activity Level**: 12 commit(s) in last 24h
2. **Most Active Modules**:
   - `widgets`: 19 commits - **High activity, coordinate before changes**

### Before You Code:
1. Check recent changes in modules you'll modify
2. Coordinate with team on highly active modules
```

## 🎯 Benefits

### For Developers
- ✅ Biết ngay module nào đang hot → tránh conflicts
- ✅ Thấy dependencies updates → không bị build errors
- ✅ Hiểu context nhanh → onboard dễ dàng

### For Teams
- ✅ Transparency: Ai làm gì, ở đâu
- ✅ Coordination: Biết module nào cần phối hợp
- ✅ History: Track changes chi tiết

### For AI Assistants
- ✅ Comprehensive context về codebase state
- ✅ Breaking changes highlighted
- ✅ Module dependencies rõ ràng

## 🐛 Troubleshooting

### Hook không chạy sau commit?

```bash
# Check git hook exists
ls -la .git/hooks/post-commit

# Make it executable
chmod +x .git/hooks/post-commit

# Test manually
node .claude/hooks/auto-doc-sync/auto-doc-sync.js
```

### Duplicate entries?

```
User: Deduplicate all documentation
```

### Custom modules không detect?

```
User: Configure modules với custom rules
```

## 📝 License

MIT

## 🤝 Contributing

PRs welcome! Đây là MCP server được extract từ Construction Project - một hệ thống đã tested và proven to work.

## 🔗 Links

- [Construction Project Example](../codebase/flutter/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Desktop Config](https://docs.anthropic.com/claude/docs/mcp)
