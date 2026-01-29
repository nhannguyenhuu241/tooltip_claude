# Scout-Block Hook

Tự động chặn Claude Code truy cập vào các thư mục nặng, tránh lag và tốn tokens.

## Chức Năng

Chặn truy cập vào:
- `node_modules/` - Packages Node.js
- `__pycache__/` - Python cache
- `.git/` - Git history
- `dist/`, `build/` - Build artifacts
- Custom patterns trong `.claude/.ckignore`

## Cài Đặt

### Bước 1: Copy files

```bash
# Copy tất cả files vào hooks
cp scout-block/* your-project/.claude/hooks/
```

### Bước 2: Cấu hình settings.json

Thêm vào `.claude/settings.json`:

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

## Tùy Chỉnh

Tạo file `.claude/.ckignore` để chặn thêm patterns:

```
# Example .ckignore
node_modules
__pycache__
.git
dist
build
.next
.nuxt
vendor
```

## Files

| File | Platform | Mô tả |
|------|----------|-------|
| `scout-block.js` | Cross-platform | Entry point, dispatcher |
| `scout-block.cjs` | Node.js (CommonJS) | Fallback cho old Node |
| `scout-block.sh` | Unix/macOS/Linux | Bash implementation |
| `scout-block.ps1` | Windows | PowerShell implementation |

## Test

```bash
# Test hook hoạt động
echo '{"tool_input":{"command":"ls node_modules"}}' | node .claude/hooks/scout-block.js

# Kết quả mong đợi: ERROR: Blocked directory pattern
```
