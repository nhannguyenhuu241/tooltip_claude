# Auto-Doc-Sync — Luồng hoạt động

```mermaid
flowchart LR
    subgraph COMMIT["Sau mỗi commit"]
        A1["Dev A\ngit commit"] -->|"post-commit"| A2["auto-doc-sync.js"]
        A2 --> A3["CHANGES.md\nCONTEXT.md\nmodules/*.md"]
        A3 --> A4["git push"]
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
        C1["/sync auth"] --> C2["git pull"]
        C2 --> C3["Conflict check:\nlocal vs remote"]
        C3 --> C4["Đọc docs\ndeep dive module"]
        C4 --> C5["Summary +\ncảnh báo conflict"]
    end

    A4 ==>|"remote"| B1
    B7 --> CLAUDE["Claude biết\nai làm gì"]
    C5 --> CLAUDE
```

## 3 luồng

1. **Ghi** — mỗi commit tự cập nhật docs, push lên remote
2. **Đọc tự động** — Claude session mới, tool đầu tiên trigger hook, inject team context 1 lần
3. **/sync thủ công** — pull + conflict check + deep dive module cụ thể
