# Quick Start Guide - Auto-Doc-Sync MCP

## 🚀 Cài Đặt Nhanh (5 phút)

### Bước 1: Install MCP Server

```bash
cd mcp-servers/auto-doc-sync
./install.sh local
```

### Bước 2: Restart Claude Desktop

Tắt và mở lại Claude Desktop app.

### Bước 3: Verify Installation

Trong Claude Desktop, mở bất kỳ project nào và hỏi:

```
User: Install auto-doc-sync vào project này
```

Claude sẽ trả lời và show available MCP tools.

## 📝 Test trong Construction Project

### Test 1: Install Hook

```
User: Install auto-doc-sync vào /path/to/construction-project/codebase/flutter
```

**Expected Output:**
```
✅ Auto-Doc-Sync installed successfully!

Project Type Detected: flutter

Files Created:
- .claude/hooks/auto-doc-sync/auto-doc-sync.js
- .git/hooks/post-commit
- CHANGES.md
- docs/CONTEXT.md
- docs/modules/
```

### Test 2: Make a Commit

```bash
cd /path/to/construction-project/codebase/flutter
echo "test" > TEST.md
git add TEST.md
git commit -m "test: verify auto-doc-sync MCP"
```

**Expected Output:**
```
🔄 Auto-Doc-Sync (Flutter): Analyzing recent changes...
Found 1 commit(s) in last 24 hours
Affected modules: other
✓ Updated CHANGES.md with 1 new commit(s)
✓ Updated docs/modules/other.md with 1 new commit(s)
✓ Updated docs/CONTEXT.md
✅ Documentation updated successfully!
```

### Test 3: Sync Documentation

```
User: /sync
```

**Expected Output:**
```
# Team Sync Report

## 🎯 Recent Changes Summary (Last 24h)

### ✨ New Features (1)
- **abc1234**: test: verify auto-doc-sync MCP
  - Affects: other

## 📊 Module Activity Analysis
...
```

### Test 4: Deep Dive Module

```
User: /sync widgets
```

**Expected Output:**
```
## Deep Dive: widgets Module

# widgets Module

## Overview
Flutter module for widgets.

## Recent Changes

### 2026-01-30
- update code base (bda0ab7) by Nguyen Huu Nhan
...
```

### Test 5: Deduplicate

```
User: Deduplicate all documentation
```

**Expected Output:**
```
✅ Deduplication complete!

CHANGES.md: Removed 0 duplicate lines
Module docs: Removed 0 duplicate lines across all modules
```

## 🎯 Use Cases

### Use Case 1: Onboarding Mới Developer

**Scenario**: Developer mới join team

```
1. Dev clone repo
2. Dev: /sync
3. Claude show:
   - Recent changes last 24h
   - Active modules
   - Breaking changes
   - Cần install dependencies gì
4. Dev hiểu context ngay, không cần hỏi team
```

### Use Case 2: Review Code Sau Pull

**Scenario**: Dev pull code từ main branch

```
1. git pull origin main
2. Hook auto update docs
3. Dev: /sync widgets
4. Claude show widgets module changes
5. Dev biết widgets module vừa thay đổi gì
6. Dev avoid conflicts khi code
```

### Use Case 3: Planning Feature Mới

**Scenario**: Dev muốn add feature vào widgets module

```
1. Dev: /sync widgets
2. Claude: "widgets module has 19 commits in 24h - High activity"
3. Dev: "Ah, module này đang hot, tôi nên hỏi team"
4. Dev coordinate với team
5. Avoid merge conflicts
```

## 🐛 Troubleshooting

### MCP Server không xuất hiện trong Claude?

**Check 1**: Verify config file

```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Should contain:
```json
{
  "mcpServers": {
    "auto-doc-sync": {
      "command": "node",
      "args": ["/path/to/mcp-servers/auto-doc-sync/index.js"]
    }
  }
}
```

**Check 2**: Restart Claude Desktop

Phải restart Claude Desktop sau khi thay đổi config.

**Check 3**: Check logs

Claude Desktop logs: `~/Library/Logs/Claude/mcp*.log`

### Hook không chạy sau commit?

**Check 1**: Git hook exists?

```bash
ls -la .git/hooks/post-commit
```

**Check 2**: Hook executable?

```bash
chmod +x .git/hooks/post-commit
```

**Check 3**: Test manually

```bash
node .claude/hooks/auto-doc-sync/auto-doc-sync.js
```

### Duplicate entries vẫn xuất hiện?

**Solution**: Run deduplicate

```
User: Deduplicate all documentation
```

Or manually:

```bash
node .claude/hooks/auto-doc-sync/deduplicate-changes.js
node .claude/hooks/auto-doc-sync/deduplicate-module-docs.js
```

## 📚 Next Steps

1. **Try it in your own project**:
   ```
   User: Install auto-doc-sync vào /path/to/your-project
   ```

2. **Customize module detection**:
   ```
   User: Configure modules với custom rules
   ```

3. **Share with team**:
   - Commit .claude/hooks/ to Git
   - Team members auto get the hook when they clone
   - Everyone has same documentation workflow

## 🎉 Success Criteria

You know it's working when:

- ✅ CHANGES.md updates after every commit
- ✅ docs/CONTEXT.md shows AI-readable context
- ✅ Module docs track changes per module
- ✅ No duplicate entries
- ✅ Dependency warnings show up
- ✅ `/sync` shows comprehensive team activity

Happy coding! 🚀
