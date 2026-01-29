# Claude Code Commands

Collection of slash commands để tăng tốc workflow development.

## Cấu Trúc

```
commands/
├── ask/           # /ask - Hỏi đáp kỹ thuật
├── bootstrap/     # /bootstrap - Tạo project mới
├── brainstorm/    # /brainstorm - Brainstorm ideas
├── code/          # /code - Implementation
├── cook/          # /cook - Quick implementation
├── debug/         # /debug - Debug issues
├── design/        # /design - UI/UX design
├── docs/          # /docs - Documentation
├── fix/           # /fix - Bug fixes
├── git/           # /git - Git operations
├── plan/          # /plan - Planning
├── review/        # /review - Code review
├── scout/         # /scout - Search codebase
├── skill/         # /skill - Manage skills
├── test/          # /test - Testing
└── ... (23 commands total)
```

## Commands by Category

### 🚀 Development

| Command | Mô tả | Khi nào dùng |
|---------|-------|--------------|
| `/cook` | Quick implementation | Làm feature nhanh |
| `/code` | Full implementation | Implementation có plan |
| `/fix` | Fix bugs | Sửa lỗi |
| `/debug` | Debug issues | Debug có hệ thống |
| `/test` | Run tests | Testing |

### 📋 Planning

| Command | Mô tả | Khi nào dùng |
|---------|-------|--------------|
| `/plan` | Create plan | Lập kế hoạch implementation |
| `/brainstorm` | Brainstorm | Tìm ý tưởng, giải pháp |
| `/ask` | Ask questions | Hỏi về architecture, patterns |

### 🎨 Design

| Command | Mô tả | Khi nào dùng |
|---------|-------|--------------|
| `/design` | UI/UX design | Thiết kế giao diện |
| `/design:screenshot` | Design from screenshot | Analyze UI |
| `/design:video` | Design from video | Analyze UX flow |

### 🔧 Tools

| Command | Mô tả | Khi nào dùng |
|---------|-------|--------------|
| `/git` | Git operations | Commit, push, PR |
| `/docs` | Documentation | Viết/cập nhật docs |
| `/review` | Code review | Review code quality |
| `/scout` | Search code | Tìm kiếm trong codebase |

### 🎯 Project

| Command | Mô tả | Khi nào dùng |
|---------|-------|--------------|
| `/bootstrap` | New project | Tạo project từ đầu |
| `/skill` | Manage skills | Quản lý skills |
| `/use-mcp` | Use MCP tools | Dùng MCP servers |

## Quick Examples

### Làm Feature Mới

```
/plan implement user authentication
# Claude tạo plan

/code
# Claude implement theo plan

/test
# Claude run tests
```

### Fix Bug

```
/debug login form not submitting
# Claude debug

/fix
# Claude fix issue

/git commit
# Claude commit changes
```

### Design UI

```
/design landing page for SaaS product
# Claude design UI

/design:screenshot analyze this mockup
# Claude analyze screenshot
```

## Download Commands

Mỗi command folder chứa:
- `command-name.md` - Instructions
- `*.sh` hoặc `*.js` - Scripts (nếu có)
- Subfolders cho variants

```bash
# Copy command cần thiết
cp commands/fix/* your-project/.claude/commands/
```

## Command Structure

Mỗi command folder có format:

```
command-name/
├── command-name.md    # Main instructions
├── README.md          # Setup guide (optional)
├── variant1/          # Subcommand (optional)
└── variant2/          # Subcommand (optional)
```

**Ví dụ:**

```
fix/
├── fix.md              # /fix base command
├── fix-fast/
│   └── fix-fast.md     # /fix:fast variant
├── fix-hard/
│   └── fix-hard.md     # /fix:hard variant
└── fix-test/
    └── fix-test.md     # /fix:test variant
```

## Tạo Command Mới

### Template

```markdown
---
command: my-command
description: What this command does
---

# My Command

Instructions for Claude...

## When to use
- Use case 1
- Use case 2

## Example
User: /my-command do something
Claude: [executes command]
```

## Best Practices

1. **Dùng đúng command** - `/cook` cho nhanh, `/code` cho kỹ
2. **Combine commands** - `/plan` → `/code` → `/test`
3. **Customize** - Edit .md files để fit workflow
4. **Version control** - Commit commands vào git

## Troubleshooting

**Command không có:**
- Kiểm tra folder `commands/command-name/`
- Đảm bảo có file `command-name.md`

**Command không hoạt động:**
- Check syntax trong .md file
- Xem logs của Claude Code

## Learn More

- [Claude Code Commands Docs](https://docs.anthropic.com/claude-code/commands)
- Xem README.md trong từng command folder
