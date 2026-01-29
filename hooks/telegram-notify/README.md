# Telegram Notify Hook

Gửi thông báo tới Telegram khi Claude thực hiện các thao tác quan trọng.

## Chức Năng

Thông báo realtime qua Telegram về:
- Git commits/pushes
- Build status
- Test results
- Deployment events
- Errors & warnings

## Setup

Xem hướng dẫn chi tiết trong [telegram-hook-setup.md](telegram-hook-setup.md)

### Quick Start

1. Tạo Telegram Bot:
   - Chat với [@BotFather](https://t.me/botfather)
   - `/newbot` → Đặt tên → Lấy token
   - Lấy Chat ID: Chat với [@userinfobot](https://t.me/userinfobot)

2. Copy files:
   ```bash
   cp telegram-notify/* your-project/.claude/hooks/
   ```

3. Cấu hình:
   ```bash
   export TELEGRAM_BOT_TOKEN="your-bot-token"
   export TELEGRAM_CHAT_ID="your-chat-id"
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
               "command": "bash \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/telegram_notify.sh"
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
| `telegram_notify.sh` | Main notification script |
| `telegram-hook-setup.md` | Hướng dẫn setup chi tiết |

## Test

```bash
export TELEGRAM_BOT_TOKEN="your-token"
export TELEGRAM_CHAT_ID="your-chat-id"
bash telegram_notify.sh "Test notification"
```

## Ưu điểm so với Discord

- Nhẹ hơn, ít resources
- Notifications nhanh hơn
- Mobile app tốt hơn
- Free unlimited messages
