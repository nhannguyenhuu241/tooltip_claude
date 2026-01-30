# Git Hooks Guide - Auto-Doc-Sync

Hướng dẫn setup hook để hoạt động với **TẤT CẢ** Git tools (GitHub Desktop, SourceTree, terminal, etc.)

---

## 🎯 Vấn Đề

### Hook Hiện Tại (PostToolUse)

File `.claude/settings.json` định nghĩa `PostToolUse` hook:

```json
{
  "hooks": {
    "PostToolUse": [...]
  }
}
```

**Đây là Claude Code hook, KHÔNG phải Git hook!**

### ❌ Không Hoạt Động Với:

| Tool | Hoạt động? | Lý do |
|------|------------|-------|
| GitHub Desktop | ❌ | Không dùng Claude Code |
| SourceTree | ❌ | Không dùng Claude Code |
| GitKraken | ❌ | Không dùng Claude Code |
| VSCode Git GUI | ❌ | Không dùng Claude Code |
| IntelliJ Git | ❌ | Không dùng Claude Code |
| Terminal `git commit` | ❌ | Không qua Claude Code |
| Fork | ❌ | Không dùng Claude Code |
| Tower | ❌ | Không dùng Claude Code |

### ✅ Chỉ Hoạt Động Khi:

- ✅ Commit qua Claude Code CLI
- ✅ Chạy manual: `node .claude/hooks/auto-doc-sync/auto-doc-sync.js`

---

## 💡 Giải Pháp: Git Post-Commit Hook

Convert sang **Git native hook** để hoạt động với **MỌI** tool.

---

## 🚀 Quick Install

### Option 1: Automatic Installation (Recommended)

```bash
# Chạy từ Flutter project root
./.claude/hooks/auto-doc-sync/install-git-hook.sh
```

**Output:**
```
📦 Installing Auto-Doc-Sync Git Hook
======================================

✅ Found auto-doc-sync.js
ℹ️  Hooks directory ready
✅ post-commit hook installed and executable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Installation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Auto-Doc-Sync now works with:
   ✅ GitHub Desktop
   ✅ SourceTree
   ✅ GitKraken
   ✅ VSCode Git
   ✅ IntelliJ IDEA Git
   ✅ Terminal (git commit)
   ✅ Claude Code
```

### Option 2: Manual Installation

```bash
# 1. Create post-commit hook
cat > .git/hooks/post-commit << 'EOF'
#!/bin/sh
echo "🔄 Auto-Doc-Sync: Analyzing recent changes..."
GIT_ROOT=$(git rev-parse --show-toplevel)
cd "$GIT_ROOT"
node .claude/hooks/auto-doc-sync/auto-doc-sync.js
exit 0
EOF

# 2. Make executable
chmod +x .git/hooks/post-commit

# 3. Test
echo "test" > test.txt
git add test.txt
git commit -m "test: git hook"
cat CHANGES.md  # Should show update
```

---

## 🧪 Testing

### Test với GitHub Desktop:

1. Open GitHub Desktop
2. Make a change to any file
3. Write commit message
4. Click "Commit to main"
5. **Hook tự động chạy!**
6. Check `CHANGES.md` → Should be updated

### Test với SourceTree:

1. Open SourceTree
2. Stage files
3. Write commit message
4. Click "Commit"
5. **Hook tự động chạy!**
6. Check `CHANGES.md` → Should be updated

### Test với VSCode Git:

1. Open VSCode
2. Make changes
3. Stage files (Ctrl+K Ctrl+S)
4. Write message
5. Click Commit ✓
6. **Hook tự động chạy!**
7. Check `CHANGES.md` → Updated

### Test với Terminal:

```bash
# Make change
echo "test" > test.txt

# Commit
git add test.txt
git commit -m "test: verify git hook"

# Output sẽ show:
# 🔄 Auto-Doc-Sync: Analyzing recent changes...
# ✅ Documentation updated successfully!

# Verify
cat CHANGES.md | head -20
```

---

## 📋 How It Works

### Before (PostToolUse Hook):

```
User commits via GitHub Desktop
    ↓
GitHub Desktop runs: git commit
    ↓
Commit successful
    ↓
❌ No hook runs (PostToolUse only works with Claude Code)
    ↓
CHANGES.md NOT updated
```

### After (Git Post-Commit Hook):

```
User commits via ANY tool (GitHub Desktop, SourceTree, etc.)
    ↓
Tool runs: git commit
    ↓
Commit successful
    ↓
✅ Git runs: .git/hooks/post-commit
    ↓
Hook runs: node .claude/hooks/auto-doc-sync/auto-doc-sync.js
    ↓
CHANGES.md updated ✓
docs/modules/ updated ✓
docs/CONTEXT.md updated ✓
```

---

## 🔧 Team Setup

### Problem: Git Hooks Không Được Track

Git hooks ở `.git/hooks/` **KHÔNG** được commit vào repo (theo design của Git).

**Mỗi developer phải setup riêng!**

### Solution 1: Onboarding Script

Add vào onboarding checklist:

```markdown
## Developer Onboarding

1. Clone repo
   ```bash
   git clone https://github.com/your-org/construction-project.git
   cd construction-project
   ```

2. Install dependencies
   ```bash
   flutter pub get
   ```

3. **Install Git hooks** ⭐
   ```bash
   ./.claude/hooks/auto-doc-sync/install-git-hook.sh
   ```

4. Done! Start coding.
```

### Solution 2: Husky-like Setup (Advanced)

Tạo package.json script (nếu dùng npm):

```json
{
  "scripts": {
    "postinstall": "./.claude/hooks/auto-doc-sync/install-git-hook.sh"
  }
}
```

Khi developer chạy `npm install` → hook tự động install.

### Solution 3: Documentation

Add to README.md:

```markdown
## ⚙️ Setup

**IMPORTANT:** After cloning, install Git hooks:

```bash
./.claude/hooks/auto-doc-sync/install-git-hook.sh
```

This enables auto-documentation for all commit tools (GitHub Desktop, SourceTree, etc.)
```

---

## 🎯 Compatibility Matrix

| Tool | Before Git Hook | After Git Hook |
|------|-----------------|----------------|
| **Claude Code** | ✅ (PostToolUse) | ✅ (Git hook) |
| **GitHub Desktop** | ❌ | ✅ |
| **SourceTree** | ❌ | ✅ |
| **GitKraken** | ❌ | ✅ |
| **VSCode Git** | ❌ | ✅ |
| **IntelliJ IDEA** | ❌ | ✅ |
| **Terminal git** | ❌ | ✅ |
| **Fork** | ❌ | ✅ |
| **Tower** | ❌ | ✅ |

---

## 🔄 Both Hooks Together

Bạn có thể dùng **CẢ HAI** hooks cùng lúc:

- **PostToolUse** (.claude/settings.json) - Cho Claude Code users
- **Git Hook** (.git/hooks/post-commit) - Cho GUI tool users

Hook sẽ **KHÔNG** chạy 2 lần vì:
- PostToolUse chỉ trigger từ Claude Code
- Git hook chỉ trigger từ git commit

Nếu commit qua Claude Code → Chỉ PostToolUse chạy
Nếu commit qua GitHub Desktop → Chỉ Git hook chạy

---

## ⚠️ Troubleshooting

### Hook không chạy với GitHub Desktop?

```bash
# 1. Check hook exists
ls -la .git/hooks/post-commit

# 2. Check executable
chmod +x .git/hooks/post-commit

# 3. Test manually
.git/hooks/post-commit

# 4. Check GitHub Desktop settings
# Preferences → Advanced → "Use external editor"
```

### Hook không chạy với SourceTree?

```bash
# SourceTree có thể disable hooks
# Tools → Options → Git → Enable Git Hooks ✓
```

### Hook chạy nhưng không update docs?

```bash
# Check Node.js installed
node --version

# Check script path
ls -la .claude/hooks/auto-doc-sync/auto-doc-sync.js

# Run hook manually để see errors
.git/hooks/post-commit
```

### Hook bị skip?

```bash
# Git commit với --no-verify sẽ skip hooks
git commit --no-verify  # ❌ Hook không chạy

# Dùng normal commit
git commit  # ✅ Hook chạy
```

---

## 📊 Performance

Git hook overhead:
- Hook execution: ~100-200ms
- User không cảm nhận được
- GitHub Desktop/SourceTree: Vẫn responsive

---

## 🔐 Security

Git hooks chạy **local code** → Cần trust:
- ✅ Safe: Hook chỉ đọc git log và update markdown files
- ✅ No network calls
- ✅ No sensitive data access
- ✅ Source code visible: `.claude/hooks/auto-doc-sync/auto-doc-sync.js`

---

## 📚 Learn More

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [auto-doc-sync.js](./auto-doc-sync.js) - Hook implementation
- [TEST_MULTI_MODULE.md](./TEST_MULTI_MODULE.md) - Test guide

---

## ✅ Next Steps

1. **Install hook on your machine:**
   ```bash
   ./.claude/hooks/auto-doc-sync/install-git-hook.sh
   ```

2. **Test with your preferred Git tool**

3. **Share with team:**
   - Add to onboarding docs
   - Update README.md
   - Send Slack/Discord message

4. **Verify team members installed:**
   ```bash
   # Ask team to run:
   ls -la .git/hooks/post-commit
   ```

---

**Happy committing with any tool! 🎉**
