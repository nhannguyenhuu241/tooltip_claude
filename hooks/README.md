# Claude Code Hooks

Collection of hooks để tăng năng suất, ngăn lỗi và thông báo cho Claude Code.

## Cấu Trúc

```
hooks/
├── scout-block/          # ⭐ Chặn thư mục nặng (khuyên dùng)
│   ├── README.md
│   ├── scout-block.js    # Entry point
│   ├── scout-block.cjs   # CommonJS fallback
│   ├── scout-block.sh    # Unix/Linux/macOS
│   └── scout-block.ps1   # Windows PowerShell
│
├── dev-rules-reminder/   # Nhắc nhở coding rules
│   ├── README.md
│   ├── dev-rules-reminder.js
│   └── dev-rules-reminder.cjs
│
├── discord-notify/       # Thông báo Discord
│   ├── README.md
│   ├── discord_notify.sh
│   ├── send-discord.sh
│   └── discord-hook-setup.md
│
└── telegram-notify/      # Thông báo Telegram
    ├── README.md
    ├── telegram_notify.sh
    └── telegram-hook-setup.md
```

## Quick Reference

| Hook | Type | Khi nào dùng | Platform |
|------|------|--------------|----------|
| **scout-block** | PreToolUse | Luôn luôn (chặn node_modules) | All |
| **dev-rules-reminder** | PreToolUse | Khi có coding standards | All |
| **discord-notify** | PostToolUse | Team collaboration | All |
| **telegram-notify** | PostToolUse | Personal notifications | All |

## Hook Types Explained

### PreToolUse Hooks
Chạy **TRƯỚC** khi Claude thực thi tool.

**Ví dụ:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/scout-block.js"
      }]
    }]
  }
}
```

### PostToolUse Hooks
Chạy **SAU** khi Claude thực thi tool.

**Ví dụ:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "bash .claude/hooks/discord_notify.sh"
      }]
    }]
  }
}
```

## Cài Đặt Nhanh

### 1. Scout-Block (Khuyên dùng nhất)

```bash
# Copy hook
cp hooks/scout-block/* your-project/.claude/hooks/

# Thêm vào settings.json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/scout-block.js"
      }]
    }]
  }
}
```

**Lợi ích:**
- ⚡ Giảm 90% thời gian chờ khi Claude scan folders
- 💰 Tiết kiệm tokens (không đọc node_modules)
- 🛡️ Bảo vệ .git history

### 2. Dev Rules Reminder

```bash
cp hooks/dev-rules-reminder/* your-project/.claude/hooks/
```

### 3. Discord Notify

```bash
cp hooks/discord-notify/* your-project/.claude/hooks/
# Xem discord-notify/README.md để setup webhook
```

### 4. Telegram Notify

```bash
cp hooks/telegram-notify/* your-project/.claude/hooks/
# Xem telegram-notify/README.md để setup bot
```

## Download Từng Hook

Mỗi hook có thể tải về độc lập:

```bash
# Chỉ cần scout-block
curl -O https://.../hooks/scout-block/scout-block.js

# Hoặc clone toàn bộ
git clone <repo> && cp -r hooks/scout-block your-project/.claude/hooks/
```

## Combining Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/scout-block.js"
        }]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/dev-rules-reminder.js"
        }]
      }
    ],
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "bash \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/telegram_notify.sh"
        }
      ]
    }]
  }
}
```

## Tạo Hook Mới

Template cơ bản:

```javascript
#!/usr/bin/env node
const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);

  // Your logic
  console.log('Hook executed:', data.tool_name);

  process.exit(0); // 0 = allow, 2 = block
} catch (error) {
  console.error('Error:', error.message);
  process.exit(2);
}
```

## Troubleshooting

**Hook không chạy:**
```bash
chmod +x .claude/hooks/*.sh
chmod +x .claude/hooks/*.js
```

**Test hook:**
```bash
echo '{"tool_input":{"command":"test"}}' | node .claude/hooks/scout-block.js
```

## Learn More

- [Claude Code Hooks Docs](https://docs.anthropic.com/claude-code/hooks)
- Xem README.md trong từng hook folder để biết chi tiết
