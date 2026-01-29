# Dev Rules Reminder Hook

Nhắc nhở các quy tắc development quan trọng trước khi Claude thực thi lệnh.

## Chức Năng

Hiển thị reminder về:
- Coding standards
- Security best practices
- Testing requirements
- Documentation rules
- Git conventions

## Cài Đặt

### Bước 1: Copy files

```bash
cp dev-rules-reminder/* your-project/.claude/hooks/
```

### Bước 2: Cấu hình settings.json

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/dev-rules-reminder.js"
          }
        ]
      }
    ]
  }
}
```

## Tùy Chỉnh Rules

Chỉnh sửa file `dev-rules-reminder.js` để thêm/bớt rules:

```javascript
const RULES = {
  'Write': [
    'Always add JSDoc comments',
    'Follow naming conventions',
    // Add more...
  ],
  'Edit': [
    'Run tests after editing',
    // Add more...
  ]
};
```

## Files

| File | Mô tả |
|------|-------|
| `dev-rules-reminder.js` | ES Module version |
| `dev-rules-reminder.cjs` | CommonJS version |
