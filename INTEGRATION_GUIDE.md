# Hướng Dẫn Tích Hợp Skills & Agents vào Dự Án

Hướng dẫn này giúp bạn áp dụng skills, agents, hooks và configuration từ repository này vào dự án đang có sẵn thư mục `.claude`.

## Mục Lục

1. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
2. [Tích Hợp Skills](#tích-hợp-skills)
3. [Tích Hợp Agents](#tích-hợp-agents)
4. [Cấu Hình Hooks](#cấu-hình-hooks)
5. [Cấu Hình Statusline](#cấu-hình-statusline)
6. [Merge Settings.json](#merge-settingsjson)

---

## Cấu Trúc Thư Mục

Đảm bảo dự án của bạn có cấu trúc như sau:

```
your-project/
├── .claude/
│   ├── settings.json      # Cấu hình Claude Code
│   ├── agents/            # Agent definitions
│   ├── hooks/             # Hook scripts
│   └── skills/            # Skills
└── ...
```

---

## Tích Hợp Skills

### Cách 1: Copy Toàn Bộ Skills

```bash
# Copy tất cả skills vào dự án
cp -r path/to/tooltip_claude/.claude/skills/* your-project/.claude/skills/
```

### Cách 2: Copy Skills Cụ Thể

```bash
# Chỉ copy skills cần thiết
cp -r path/to/tooltip_claude/.claude/skills/debugging your-project/.claude/skills/
cp -r path/to/tooltip_claude/.claude/skills/code-review your-project/.claude/skills/
cp -r path/to/tooltip_claude/.claude/skills/frontend-development your-project/.claude/skills/
```

### Skills Được Khuyên Dùng

| Loại Dự Án | Skills Nên Dùng |
|------------|-----------------|
| **Web Frontend** | `frontend-development`, `web-frameworks` |
| **Backend API** | `backend-development`, `databases` |
| **Mobile App** | `mobile-development` |
| **Full Stack** | `frontend-development`, `backend-development`, `databases` |
| **Tất cả** | `debugging`, `research` |

### Kiểm Tra Skill Hoạt Động

```bash
# Liệt kê tất cả skills
ls -la your-project/.claude/skills/

# Kiểm tra cấu trúc skill
cat your-project/.claude/skills/debugging/SKILL.md
```

---

## Tích Hợp Agents

### Copy Agents

```bash
# Tạo thư mục agents nếu chưa có
mkdir -p your-project/.claude/agents

# Copy tất cả agents
cp path/to/tooltip_claude/.claude/agents/*.md your-project/.claude/agents/
```

### Agents Có Sẵn

| Agent | Mục Đích |
|-------|----------|
| `code-reviewer.md` | Review code, kiểm tra chất lượng |
| `debugger.md` | Debug, phân tích lỗi |
| `database-admin.md` | Quản lý database |
| `planner.md` | Lập kế hoạch implementation |
| `project-manager.md` | Quản lý dự án |
| `ui-ux-designer.md` | Thiết kế UI/UX |
| `docs-manager.md` | Quản lý tài liệu |
| `researcher.md` | Nghiên cứu kỹ thuật |

---

## Cấu Hình Hooks

### Copy Hook Files

```bash
# Tạo thư mục hooks
mkdir -p your-project/.claude/hooks

# Copy hook scripts
cp path/to/tooltip_claude/.claude/hooks/scout-block.* your-project/.claude/hooks/
```

### Scout-Block Hook

Hook này chặn truy cập vào các thư mục nặng:
- `node_modules/`
- `__pycache__/`
- `.git/`
- `dist/`
- `build/`

### Thêm Hook vào settings.json

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/scout-block.js"
          }
        ]
      }
    ]
  }
}
```

---

## Cấu Hình Statusline

### Copy Statusline Scripts

```bash
# Copy statusline script
cp path/to/tooltip_claude/.claude/statusline.js your-project/.claude/
cp path/to/tooltip_claude/.claude/statusline.sh your-project/.claude/
cp path/to/tooltip_claude/.claude/statusline.ps1 your-project/.claude/
```

### Thêm vào settings.json

```json
{
  "statusLine": {
    "type": "command",
    "command": "node .claude/statusline.js",
    "padding": 0
  }
}
```

### Statusline Hiển Thị

- 📁 Thư mục hiện tại
- 🌿 Git branch
- 🤖 Model đang dùng
- ⌛ Thời gian session còn lại
- 💵 Chi phí (nếu có ccusage)
- 📊 Tổng tokens

---

## Merge Settings.json

### Cấu Trúc settings.json Đầy Đủ

```json
{
  "includeCoAuthoredBy": false,
  "statusLine": {
    "type": "command",
    "command": "node .claude/statusline.js",
    "padding": 0
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/scout-block.js"
          }
        ]
      }
    ]
  }
}
```

### Merge Thủ Công

Nếu dự án đã có `settings.json`, merge các phần:

```bash
# Đọc settings hiện tại
cat your-project/.claude/settings.json

# Chỉnh sửa để thêm statusLine và hooks
```

---

## Script Tích Hợp Tự Động

Repository này đã có sẵn script `integrate.sh`. Sử dụng như sau:

```bash
# Chạy script tích hợp
./integrate.sh /path/to/your-project

# Ví dụ
./integrate.sh ~/projects/my-web-app
```

Script sẽ tự động:
- Tạo thư mục `.claude/skills`, `.claude/agents`, `.claude/hooks`
- Copy 7 skills (không bao gồm document-skills)
- Copy 8 agents
- Copy hooks và statusline scripts
- Phát hiện `settings.json` đã tồn tại → tạo `.new` để merge thủ công

---

## Xác Minh Tích Hợp

```bash
# Kiểm tra cấu trúc
tree your-project/.claude -L 2

# Hoặc
ls -laR your-project/.claude
```

### Checklist

- [ ] Skills đã copy vào `.claude/skills/`
- [ ] Agents đã copy vào `.claude/agents/`
- [ ] Hooks đã copy vào `.claude/hooks/`
- [ ] Statusline scripts đã copy
- [ ] `settings.json` đã cấu hình hooks và statusline
- [ ] Test Claude Code trong dự án

---

## Lưu Ý Quan Trọng

1. **Backup trước khi merge** - Luôn backup `.claude/settings.json` trước khi chỉnh sửa

2. **Không copy document-skills** - Skills `pdf`, `docx`, `pptx`, `xlsx` đã có sẵn trong Claude, không cần copy

3. **Tùy chỉnh hooks** - Có thể chỉnh sửa `scout-block.js` để thêm/bớt directories bị chặn

4. **Xung đột settings** - Nếu có xung đột, ưu tiên giữ cấu hình dự án hiện tại

5. **Permissions** - Đảm bảo scripts có quyền execute:
   ```bash
   chmod +x your-project/.claude/hooks/*.sh
   chmod +x your-project/.claude/statusline.sh
   ```
