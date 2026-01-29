# Discord Notify Hook

Gửi thông báo tới Discord khi Claude thực hiện các thao tác quan trọng.

## Chức Năng

Thông báo khi:
- Code được commit/push
- Build thành công/thất bại
- Tests pass/fail
- Deployment events
- Custom events

## Setup

Xem hướng dẫn chi tiết trong [discord-hook-setup.md](discord-hook-setup.md)

### Quick Start

1. Tạo Discord webhook:
   - Discord → Server Settings → Integrations → Webhooks
   - Copy webhook URL

2. Copy files:
   ```bash
   cp discord-notify/* your-project/.claude/hooks/
   ```

3. Cấu hình webhook:
   ```bash
   # Tạo file .env hoặc export
   export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
   ```

4. Thêm vào settings.json:
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",
               "command": "bash \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/discord_notify.sh"
             }
           ]
         }
       ]
     }
   }
   ```

## Files

| File | Mô tả |
|------|-------|
| `discord_notify.sh` | Main script gửi Discord |
| `send-discord.sh` | Helper script |
| `discord-hook-setup.md` | Hướng dẫn chi tiết |

## Test

```bash
export DISCORD_WEBHOOK_URL="your-webhook-url"
bash discord_notify.sh "Test message"
```
