# Hướng Dẫn Cấu Hình Mạng Cho Claude Code

Hướng dẫn này giúp bạn giải quyết vấn đề kết nối Claude Code khi bị chặn bởi mạng nội bộ (LAN), proxy, hoặc firewall.

---

## Mục Lục

1. [Kiểm Tra Kết Nối](#kiểm-tra-kết-nối)
2. [Domains Cần Whitelist](#domains-cần-whitelist)
3. [Bypass Proxy](#bypass-proxy)
4. [VPN Solutions](#vpn-solutions)
5. [Proxy Configuration](#proxy-configuration)
6. [SSH Tunnel](#ssh-tunnel)
7. [Troubleshooting](#troubleshooting)

---

## Kiểm Tra Kết Nối

### Test cơ bản

```bash
# Test kết nối tới Anthropic API
curl -I https://api.anthropic.com/v1/messages

# Kết quả mong đợi: HTTP 401 (unauthorized nhưng kết nối được)
# Nếu bị chặn: timeout, connection refused, hoặc 403
```

### Test chi tiết

```bash
# Test DNS resolution
nslookup api.anthropic.com

# Test port 443
nc -zv api.anthropic.com 443

# Test với verbose
curl -v https://api.anthropic.com/v1/messages 2>&1 | head -20
```

---

## Domains Cần Whitelist

Yêu cầu IT department hoặc network admin whitelist các domain sau:

| Domain | Mục đích |
|--------|----------|
| `api.anthropic.com` | API chính của Claude |
| `claude.ai` | Web interface |
| `*.anthropic.com` | Tất cả subdomain của Anthropic |
| `statsigapi.net` | Analytics (optional) |
| `sentry.io` | Error tracking (optional) |

### Email mẫu gửi IT

```
Subject: Request whitelist domains for Claude AI development tool

Hi IT Team,

Tôi cần sử dụng Claude Code (AI coding assistant) cho công việc development.
Xin whitelist các domains sau:

- api.anthropic.com (port 443)
- claude.ai (port 443)
- *.anthropic.com (port 443)

Đây là công cụ hỗ trợ lập trình chính thức từ Anthropic.
Documentation: https://docs.anthropic.com

Thanks!
```

---

## Bypass Proxy

### macOS

#### Cách 1: System Preferences

1. **System Settings** → **Network** → **Wi-Fi** (hoặc Ethernet)
2. Click **Details...** → **Proxies**
3. Tìm **Bypass proxy settings for these Hosts & Domains**
4. Thêm:
   ```
   api.anthropic.com, claude.ai, *.anthropic.com
   ```
5. Click **OK** → **Apply**

#### Cách 2: Environment Variables

```bash
# Thêm vào ~/.zshrc hoặc ~/.bashrc
export NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com,localhost,127.0.0.1"
export no_proxy="api.anthropic.com,claude.ai,.anthropic.com,localhost,127.0.0.1"

# Reload
source ~/.zshrc
```

#### Cách 3: Chạy Claude với bypass

```bash
# One-time bypass
NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com" claude

# Hoặc tạo alias
alias claude-bypass='NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com" claude'
```

### Windows

#### Cách 1: System Settings

1. **Settings** → **Network & Internet** → **Proxy**
2. Trong **Manual proxy setup**
3. Tìm **Do not use proxy for these addresses**
4. Thêm:
   ```
   api.anthropic.com;claude.ai;*.anthropic.com
   ```

#### Cách 2: Environment Variables

```powershell
# PowerShell - Temporary
$env:NO_PROXY = "api.anthropic.com,claude.ai,.anthropic.com"

# PowerShell - Permanent
[Environment]::SetEnvironmentVariable("NO_PROXY", "api.anthropic.com,claude.ai,.anthropic.com", "User")
```

#### Cách 3: Command Prompt

```cmd
set NO_PROXY=api.anthropic.com,claude.ai,.anthropic.com
claude
```

### Linux

```bash
# Thêm vào ~/.bashrc hoặc ~/.profile
export NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com,localhost,127.0.0.1"
export no_proxy="api.anthropic.com,claude.ai,.anthropic.com,localhost,127.0.0.1"

# Reload
source ~/.bashrc
```

---

## VPN Solutions

Nếu bypass proxy không hoạt động, sử dụng VPN.

### Cloudflare WARP (Miễn phí - Khuyên dùng)

1. Download: https://1.1.1.1/
2. Cài đặt
3. Bật **WARP** mode
4. Test lại kết nối

### Các VPN khác

| VPN | Giá | Tốc độ |
|-----|-----|--------|
| Cloudflare WARP | Miễn phí | Nhanh |
| ProtonVPN | Miễn phí/Paid | Trung bình |
| NordVPN | ~$3/tháng | Nhanh |
| ExpressVPN | ~$8/tháng | Rất nhanh |

---

## Proxy Configuration

Nếu cần đi qua proxy (không bypass được):

### Set Proxy cho Claude

```bash
# HTTP Proxy
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# Với authentication
export HTTP_PROXY=http://username:password@proxy.company.com:8080
export HTTPS_PROXY=http://username:password@proxy.company.com:8080

# Chạy Claude
claude
```

### SOCKS Proxy

```bash
export ALL_PROXY=socks5://proxy.company.com:1080
claude
```

### Proxy với npm (nếu cần)

```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

---

## SSH Tunnel

Nếu có server bên ngoài mạng nội bộ:

### Tạo SOCKS Proxy

```bash
# Tạo tunnel (giữ terminal mở)
ssh -D 1080 -N -C user@your-server.com

# Terminal khác - set proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Chạy Claude
claude
```

### Tạo tunnel background

```bash
# Chạy background
ssh -D 1080 -N -C -f user@your-server.com

# Kiểm tra tunnel
lsof -i :1080
```

### Script tự động

```bash
#!/bin/bash
# File: claude-tunnel.sh

# Start SSH tunnel if not running
if ! lsof -i :1080 > /dev/null 2>&1; then
    echo "Starting SSH tunnel..."
    ssh -D 1080 -N -C -f user@your-server.com
    sleep 2
fi

# Run Claude with proxy
ALL_PROXY=socks5://127.0.0.1:1080 claude "$@"
```

---

## Mobile Hotspot

Giải pháp đơn giản nhất khi không có quyền config mạng:

1. Bật **Personal Hotspot** trên điện thoại (4G/5G)
2. Kết nối laptop vào hotspot
3. Chạy Claude bình thường

**Lưu ý:** Tốn data di động, nên dùng khi cần thiết.

---

## Troubleshooting

### Lỗi: Connection timeout

```bash
# Kiểm tra có đi qua proxy không
curl -v https://api.anthropic.com 2>&1 | grep -i proxy

# Nếu có, thử bypass
NO_PROXY="api.anthropic.com" curl -I https://api.anthropic.com
```

### Lỗi: SSL Certificate Error

```bash
# Có thể do proxy intercept SSL
# Kiểm tra certificate
openssl s_client -connect api.anthropic.com:443 -servername api.anthropic.com

# Nếu certificate không phải của Anthropic → proxy đang intercept
# Giải pháp: Dùng VPN hoặc xin IT bypass SSL inspection
```

### Lỗi: 403 Forbidden

```bash
# Firewall đang block
# Giải pháp: Xin IT whitelist hoặc dùng VPN
```

### Lỗi: DNS resolution failed

```bash
# Thử DNS khác
# macOS/Linux
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Hoặc dùng Cloudflare DNS
echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf
```

### Debug mode

```bash
# Chạy Claude với debug
DEBUG=* claude

# Hoặc
ANTHROPIC_LOG=debug claude
```

---

## Quick Reference

```bash
# Bypass proxy (macOS/Linux)
export NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com"

# Chạy với bypass
NO_PROXY="api.anthropic.com,claude.ai,.anthropic.com" claude

# Test kết nối
curl -I https://api.anthropic.com/v1/messages

# SSH tunnel
ssh -D 1080 -N -C user@server.com
ALL_PROXY=socks5://127.0.0.1:1080 claude
```

---

## Tài Liệu Tham Khảo

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Cloudflare WARP](https://1.1.1.1/)
