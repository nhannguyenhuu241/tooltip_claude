---
description: Pull latest + đồng bộ team context + kiểm tra conflict. Giúp dev hiểu changes gần đây trước khi code.
argument-hint: [module-name]
---

# Team Sync Command

Command này giúp developers nắm được:
- Ai đã thay đổi gì (từ CHANGES.md + CONTEXT.md)
- Module nào đang hot (conflict risk)
- Local changes có conflict với remote không

## Usage

```
/sync                    # Pull + sync all
/sync auth              # Pull + deep dive module auth
```

## Workflow

### Bước 0: Pull Latest + Cập nhật docs

1. Hỏi user: "Pull latest từ remote trước khi sync?" (dùng `AskUserQuestion`)
   - "Yes, git pull --rebase" → chạy `git pull --rebase`
   - "No, chỉ đọc local" → skip
2. Nếu đã pull, chạy auto-doc-sync hook thủ công để cập nhật docs:
   - `node .claude/hooks/auto-doc-sync/auto-doc-sync.js` (nếu tồn tại)
   - Nếu không tồn tại, skip

### Bước 1: Conflict Check

1. Chạy `git status` → lấy danh sách uncommitted changes
2. Chạy `git log --oneline -10` → 10 commit gần nhất từ remote
3. So sánh: file nào local đang sửa mà remote cũng vừa thay đổi → cảnh báo:
   ```
   ⚠️ Conflict Risk:
   - src/auth/login.ts — bạn đang sửa, @john cũng commit 2h trước
   - src/api/routes.ts — bạn đang sửa, @sarah commit 4h trước
   ```

### Bước 2: Đọc Team Context

1. Read `docs/CONTEXT.md` (AI context tổng hợp)
2. Read `CHANGES.md` (10 commit gần nhất)
3. Nếu có `$ARGUMENTS` (module name):
   - Read `docs/modules/{module}.md` cho deep dive

### Bước 3: Summary

Tổng hợp output:

```markdown
📊 **Team Activity (Last 24h)**

3 modules changed:
- auth (5 commits) — ⚠️ HIGH ACTIVITY
- api (3 commits)
- ui (1 commit)

⚠️ **Conflict Risk**:
- src/auth/login.ts — bạn sửa, @john cũng commit
- (hoặc "Không có conflict risk" nếu sạch)

💡 **Recommendations**:
- Coordinate với @john trước khi sửa auth
- Run `npm install` (dependencies updated)
```

---

## Output Mong Đợi

### 1. Phân Tích Changes (24h gần nhất)

```markdown
## Team Activity Summary (Last 24h)

### Modules Changed
- **auth**: 5 commits by 3 developers
- **api**: 12 commits by 5 developers
- **components**: 3 commits by 2 developers

### Top Contributors
1. @john - 8 commits (auth, api)
2. @sarah - 5 commits (components)
3. @mike - 4 commits (api)
```

### 2. Module Context

```markdown
## Auth Module - Current State

**Last Updated**: 2 hours ago by @john
**Status**: In development - Breaking changes expected

### Recent Changes:
- Added OAuth2 support (@john, 2h ago)
- Fixed session timeout bug (@sarah, 4h ago)
- Refactored token validation (@mike, 6h ago)

### Active Developers (this week):
- @john - Working on OAuth2
- @sarah - Bug fixes
- @mike - Refactoring

### ⚠️ Heads Up:
- API breaking change planned tomorrow
- New auth flow requires DB migration
```

### 3. Detailed Diff (với --diff flag)

```markdown
## Detailed Changes

### auth/login.ts
**Changed by**: @john (2 hours ago)
**Message**: Implement OAuth2 login flow

```diff
- function login(username, password) {
+ function login(provider, token) {
+   if (provider === 'oauth2') {
+     return validateOAuth2Token(token);
+   }
    return validatePassword(username, password);
  }
```

**Impact**:
- Affects 12 files
- Used by: LoginPage, SignupPage
- Breaking change: Yes
```

## Workflow Instructions

### Bước 1: Đọc Team Summary

```markdown
User: /sync

Claude analyzes:
1. Read CHANGES.md
2. Read docs/CONTEXT.md
3. Read docs/modules/*.md
4. Get git log --since="24 hours ago"

Claude responds:
📊 **Team Activity (Last 24h)**

3 modules changed:
- auth (5 commits)
- api (12 commits)
- ui (3 commits)

8 developers active:
- Most active: @john (auth, api)
- Recent: @sarah (ui), @mike (api)

⚠️ Attention needed:
- auth module: Breaking changes coming
- api module: High activity - possible conflicts
```

### Bước 2: Deep Dive vào Module

```markdown
User: /sync auth

Claude reads:
1. docs/modules/auth.md
2. git log --since="1 week ago" -- src/auth/*
3. Check active PRs related to auth

Claude responds:
🔍 **Auth Module Deep Dive**

## Current State
- Status: Active development
- Last change: 2h ago
- Active devs: 3 people

## Recent Commits (this week):
1. OAuth2 implementation (@john) - 2h ago
   - Added providers: Google, GitHub
   - Files: auth/oauth.ts, auth/providers/*

2. Session bug fix (@sarah) - 4h ago
   - Fixed timeout issue
   - Files: auth/session.ts

3. Token refactor (@mike) - 6h ago
   - Improved validation
   - Files: auth/token.ts

## Who's Working on What:
- @john: OAuth2 (active now)
- @sarah: Bug fixes (done)
- @mike: Refactoring (in review)

## ⚠️ Before You Code:
- Talk to @john if touching OAuth
- Migration script needed for new flow
- Breaking changes in next release
```

### Bước 3: Compare Detailed Diff

```markdown
User: /sync auth --diff

Claude executes:
1. git diff HEAD~5..HEAD -- src/auth/*
2. Analyze impact of changes
3. Find related files
4. Check for conflicts

Claude responds:
📝 **Detailed Diff: Auth Module**

## auth/login.ts
Changed by @john (2h ago)

```diff
@@ -10,15 +10,28 @@
 export class LoginService {
-  async login(username: string, password: string) {
+  async login(provider: AuthProvider, credentials: any) {
+    if (provider === 'oauth2') {
+      return this.handleOAuth2(credentials);
+    }
     return this.validatePassword(username, password);
   }
```

**Impact Analysis**:
- ✅ Backward compatible (password login still works)
- ⚠️ New OAuth2 flow needs testing
- 📦 Dependencies: auth/oauth.ts (new file)
- 🔗 Used by: LoginPage, SignupPage, AdminPanel

## Conflicts Check:
- ⚠️ You have uncommitted changes in auth/session.ts
- ⚠️ @sarah also modified auth/session.ts 4h ago
- 💡 Suggest: Pull latest & resolve conflicts

## Related Changes:
- auth/oauth.ts (new) - OAuth2 providers
- auth/types.ts (modified) - New AuthProvider type
- tests/auth.test.ts (modified) - Updated tests
```

## Integration với Hook

Hook `auto-doc-sync` tự động cập nhật docs sau mỗi commit:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/auto-doc-sync.js"
      }]
    }]
  }
}
```

## Files Được Sử Dụng

| File | Purpose |
|------|---------|
| `CHANGES.md` | Global changelog |
| `docs/CONTEXT.md` | Current project context |
| `docs/modules/*.md` | Per-module documentation |
| `git log` | Recent commits |
| `git diff` | Detailed changes |

## Example Scenario

### Scenario: Dev vào sáng thứ 2

```markdown
Dev: Vừa pull code mới, có gì thay đổi không?

/sync

Claude:
📊 Weekend Activity

Friday-Sunday changes:
- 47 commits by 12 developers
- 8 modules affected

🔥 Hot modules:
1. **api** - 23 commits (high activity!)
2. **auth** - 12 commits (breaking changes!)
3. **ui** - 8 commits

⚠️ Action needed:
- auth: New OAuth flow - migration required
- api: Endpoints changed - update your calls
- ui: New component library - read docs

💬 Talk to:
- @john about auth changes
- @sarah about API updates
```

### Scenario: Dev muốn code auth module

```markdown
Dev: Tôi muốn sửa bug trong auth

/sync auth

Claude:
🔍 Auth Module Status

⚠️ **High Activity Zone**

Currently working:
- @john: OAuth2 (coding now)
- @mike: Token refactor (in PR review)

Recent changes (today):
1. OAuth implementation (2h ago)
2. Session fix (4h ago)

💡 Recommendations:
- Coordinate with @john (same module)
- Pull latest before starting
- Check PR #234 (token refactor)

📝 Before coding:
1. Read docs/modules/auth.md
2. Review recent commits
3. Check for conflicts
```

## Best Practices

1. **Chạy /sync sau git pull** - Biết ngay có gì mới
2. **Chạy /sync module trước khi code** - Tránh conflicts
3. **Dùng --diff khi debug** - Hiểu chi tiết changes
4. **Update docs thường xuyên** - Giúp team sync

## Technical Implementation

Claude sẽ:

1. **Read documentation files**
   ```javascript
   - Read CHANGES.md
   - Read docs/CONTEXT.md
   - Read docs/modules/{module}.md
   ```

2. **Analyze git history**
   ```bash
   git log --since="24 hours ago" --pretty=format:"%h|%an|%ar|%s"
   git diff HEAD~10..HEAD
   ```

3. **Aggregate by module**
   - Group commits by file paths
   - Identify affected modules
   - Count contributors

4. **Generate insights**
   - Who's working on what
   - Potential conflicts
   - Breaking changes
   - Recommendations

## Configuration

Create `.claude/sync-config.json`:

```json
{
  "modulePatterns": {
    "auth": "src/auth/**",
    "api": "src/api/**",
    "ui": "src/components/**"
  },
  "lookbackHours": 24,
  "maxCommits": 50,
  "notifyBreakingChanges": true
}
```
