# Multi-Dev Coordination System

Hệ thống phối hợp khi nhiều developer cùng sử dụng Claude AI trên một project.

## Vấn đề cần giải quyết

Khi nhiều developer sử dụng Claude AI đồng thời:
- Claude có thể miss context về thay đổi của người khác
- Có thể xảy ra conflict khi edit cùng file
- Dependency/library có thể không đồng bộ
- Không biết ai đang làm gì

## Giải pháp

### 1. Real-time WIP Tracking

**File**: `templates/wip-tracker.js`

Theo dõi file nào đang được edit bởi Claude session nào.

```
.claude/wip/
├── dev-a-abc123.json    # Session của Dev A
├── dev-b-xyz789.json    # Session của Dev B
```

**Cách hoạt động**:
- PostToolUse hook chạy sau mỗi Edit/Write
- Ghi lại file đang được edit vào `.claude/wip/`
- Các session khác có thể đọc để biết ai đang làm gì

### 2. Conflict Checker (PreToolUse)

**File**: `templates/conflict-checker.js`

Kiểm tra conflict TRƯỚC khi edit:

1. **WIP Conflicts**: Session khác đang edit file này?
2. **Remote Changes**: File có thay đổi trên remote chưa pull?
3. **Local Changes**: File có uncommitted changes?

**Output mẫu**:
```
⚠️ [CONFLICT-CHECKER] Potential conflicts detected

File: lib/auth/login.dart

🔴 **ACTIVE CONFLICT**: Other Claude sessions editing this file!
   • dev-b@macbook — 5 edits, last 2m ago
   → Coordinate before proceeding

🟡 **REMOTE CHANGES**: File modified on remote!
   Recent commits:
   • abc1234: fix: auth bug
   → Run 'git pull' before editing
```

### 3. Remote Sync Checker

**File**: `templates/remote-sync-checker.js`

Proactively check remote changes khi bắt đầu session:

- Tự động `git fetch`
- So sánh local vs remote
- Warn về dependency changes
- Phát hiện breaking changes

**Output mẫu**:
```
📡 [REMOTE-SYNC] Remote changes detected!
   Branch: main ← origin/main

📊 **Sync Status**:
   ↓ 5 commit(s) behind remote

📦 **Dependency files changed**:
   • pubspec.yaml
   → Run 'flutter pub get' after pulling

⚠️ **Core/shared code changed**:
   • lib/core/api_client.dart
   • lib/shared/utils.dart
```

### 4. Session Manager

**File**: `templates/session-manager.js`

Quản lý lifecycle của Claude sessions:

- Register session khi bắt đầu
- Heartbeat để mark active
- Cleanup stale sessions (>30 phút inactive)
- End session khi hoàn thành

**Commands**:
```bash
node session-manager.js register   # Đăng ký session
node session-manager.js list       # Xem tất cả sessions
node session-manager.js status     # Xem trạng thái hiện tại
node session-manager.js cleanup    # Dọn sessions cũ
node session-manager.js end        # Kết thúc session
```

## MCP Tools mới

### `check_conflicts`
Kiểm tra conflict cho một file cụ thể.

```json
{
  "tool": "check_conflicts",
  "arguments": {
    "project_path": "/path/to/project",
    "file_path": "lib/auth/login.dart"
  }
}
```

### `list_sessions`
Xem tất cả Claude sessions đang active.

```json
{
  "tool": "list_sessions",
  "arguments": {
    "project_path": "/path/to/project",
    "include_stale": false
  }
}
```

### `register_session`
Đăng ký session hiện tại để tracking.

```json
{
  "tool": "register_session",
  "arguments": {
    "project_path": "/path/to/project",
    "working_on": "Implementing login feature"
  }
}
```

### `cleanup_sessions`
Dọn dẹp sessions đã stale.

```json
{
  "tool": "cleanup_sessions",
  "arguments": {
    "project_path": "/path/to/project"
  }
}
```

### `end_session`
Kết thúc session hiện tại.

```json
{
  "tool": "end_session",
  "arguments": {
    "project_path": "/path/to/project"
  }
}
```

## Cấu hình hooks

Thêm vào `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/multi-dev-coord/conflict-checker.js"
        }]
      },
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/multi-dev-coord/remote-sync-checker.js"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/multi-dev-coord/wip-tracker.js"
        }]
      }
    ]
  }
}
```

## Flow hoạt động

```
┌─────────────────────────────────────────────────────────────────┐
│                    Multi-Dev Coordination Flow                   │
└─────────────────────────────────────────────────────────────────┘

Developer A (Claude Session)              Developer B (Claude Session)
         │                                          │
         ▼                                          ▼
┌─────────────────┐                      ┌─────────────────┐
│ register_session│                      │ register_session│
└────────┬────────┘                      └────────┬────────┘
         │                                          │
         ▼                                          ▼
┌─────────────────┐                      ┌─────────────────┐
│ .claude/sessions│◄────── shared ──────►│ .claude/sessions│
│ .claude/wip     │       storage        │ .claude/wip     │
└────────┬────────┘                      └────────┬────────┘
         │                                          │
         │  Edit file X                             │
         ▼                                          │
┌─────────────────┐                                 │
│ conflict-checker│ ◄── Check .claude/wip ─────────┤
│   (PreToolUse)  │                                 │
└────────┬────────┘                                 │
         │ No conflict                              │
         ▼                                          │
┌─────────────────┐                                 │
│   Edit file X   │                                 │
└────────┬────────┘                                 │
         │                                          │
         ▼                                          │
┌─────────────────┐                                 │
│   wip-tracker   │ ── Update .claude/wip ─────────┤
│  (PostToolUse)  │                                 │
└────────┬────────┘                                 │
         │                                          │
         │                                          │  Edit file X
         │                                          ▼
         │                               ┌─────────────────┐
         │                               │ conflict-checker│
         │                               │   (PreToolUse)  │
         │                               └────────┬────────┘
         │                                        │
         │                                        ▼
         │                               ┌─────────────────┐
         │                               │ ⚠️ WARNING:     │
         │                               │ Dev A editing X │
         │                               └─────────────────┘
         │
         ▼
┌─────────────────┐
│   git commit    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  auto-doc-sync  │ ── Update CHANGES.md, CONTEXT.md
│ (post-commit)   │
└────────┬────────┘
         │
         │                                          │
         ▼                                          ▼
┌─────────────────┐                      ┌─────────────────┐
│  team-context-  │                      │  remote-sync-   │
│  sync (inject)  │                      │  checker (warn) │
└─────────────────┘                      └─────────────────┘
```

## Cấu trúc thư mục

```
project/
├── .claude/
│   ├── hooks/
│   │   ├── auto-doc-sync/
│   │   │   ├── auto-doc-sync.js
│   │   │   ├── deduplicate-changes.js
│   │   │   └── deduplicate-module-docs.js
│   │   ├── team-context-sync/
│   │   │   └── team-context-sync.js
│   │   └── multi-dev-coord/
│   │       ├── wip-tracker.js
│   │       ├── conflict-checker.js
│   │       ├── remote-sync-checker.js
│   │       └── session-manager.js
│   ├── wip/                    # WIP tracking (gitignored)
│   │   ├── dev-a-abc123.json
│   │   └── dev-b-xyz789.json
│   ├── sessions/               # Session registry (gitignored)
│   │   ├── dev-a-abc123.json
│   │   └── dev-b-xyz789.json
│   └── cache/                  # Cache (gitignored)
│       └── remote-sync-last-check.json
├── CHANGES.md
├── docs/
│   ├── CONTEXT.md
│   └── modules/
│       ├── auth.md
│       └── widgets.md
└── .gitignore                  # Includes .claude/wip, sessions, cache
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLAUDE_PROJECT_DIR` | Project root directory | `process.cwd()` |
| `CLAUDE_SESSION_ID` | Session identifier | Auto-generated |
| `CONFLICT_CHECK_MODE` | `warn` / `block` / `skip` | `warn` |

## Best Practices

1. **Luôn register session** khi bắt đầu làm việc
2. **End session** khi hoàn thành để free resources
3. **Pull trước khi edit** nếu có remote changes
4. **Coordinate** với team member nếu có WIP conflict
5. **Commit thường xuyên** để sync documentation
6. **Run cleanup** định kỳ để dọn stale sessions

## Troubleshooting

### Hook không chạy
- Check path trong settings.json
- Verify node có trong PATH
- Check file permissions

### Session không hiển thị
- Verify đã run `register_session`
- Check `.claude/sessions/` directory
- Run `cleanup_sessions` để clear stale data

### False positive conflicts
- Adjust `staleThreshold` trong session-manager.js
- Run cleanup để remove orphaned sessions
- Check system time sync giữa các machines
