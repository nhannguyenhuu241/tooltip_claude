# Auto-Doc-Sync — Luồng hoạt động (Flutter)

```mermaid
flowchart LR
    subgraph COMMIT["Sau mỗi commit"]
        A1["Dev A\ngit commit"] -->|"post-commit"| A2["auto-doc-sync.js\nFlutter Edition"]
        A2 --> A3["detectFlutterModule:\nlib/core/* → core-theme\nlib/features/widgets/* → widgets\nlib/l10n/* → localization\npubspec.yaml → dependencies\ntest/* → tests\n+ config.json custom rules"]
        A3 --> A4["CHANGES.md\nCONTEXT.md\nmodules/widgets.md\nmodules/splash.md\nmodules/other.md"]
        A4 --> A5["git push"]
    end

    subgraph AUTO["Tự động đầu session"]
        B1["Dev B\ngit pull"] --> B2["Mở Claude\ndùng tool đầu tiên"]
        B2 -->|"PreToolUse"| B3["team-context-sync.js"]
        B3 --> B4{"Đã inject?"}
        B4 -->|"Rồi"| B5["Skip"]
        B4 -->|"Chưa"| B6["Đọc CONTEXT.md\n+ CHANGES.md"]
        B6 --> B7["Inject summary\nvào Claude"]
    end

    subgraph MANUAL["/sync - thủ công"]
        C1["/sync widgets"] --> C2["git pull"]
        C2 --> C3["Conflict check:\nlocal vs remote"]
        C3 --> C4["Đọc docs\nmodules/widgets.md"]
        C4 --> C5["Summary +\ncảnh báo conflict"]
    end

    A5 ==>|"remote"| B1
    B7 --> CLAUDE["Claude biết\nai làm gì"]
    C5 --> CLAUDE
```

## Cấu trúc file trong Flutter project

```
codebase/flutter/
├── .claude/hooks/
│   ├── auto-doc-sync/          # PostToolUse — GHI docs sau commit
│   │   ├── auto-doc-sync.js    # Flutter module detection + config.json
│   │   ├── deduplicate-changes.js
│   │   └── deduplicate-module-docs.js
│   └── team-context-sync/      # PreToolUse — ĐỌC docs đầu session
│       └── team-context-sync.js
├── CHANGES.md                  # Auto-generated changelog
└── docs/
    ├── CONTEXT.md              # Auto-generated AI context
    └── modules/
        ├── widgets.md
        ├── splash.md
        └── other.md
```

## Flutter module detection

| File path | Module |
|-----------|--------|
| `lib/core/theme/*` | `core-theme` |
| `lib/core/utils/*` | `core-utils` |
| `lib/features/presentation/auth_module/*` | `auth` |
| `lib/features/widgets/*` | `widgets` |
| `lib/l10n/*` | `localization` |
| `pubspec.yaml` | `dependencies` |
| `test/*` | `tests` |
| Custom rules từ `config.json` | Ưu tiên check trước |

## settings.json cần có

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/team-context-sync/team-context-sync.js"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/auto-doc-sync/auto-doc-sync.js"
        }]
      }
    ]
  }
}
```
