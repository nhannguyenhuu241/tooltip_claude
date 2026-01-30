# DB Context Sync - Quick Start

## 5 Phút Setup

### 1. Install (1 phút)

```bash
cd mcp-servers/db-context-sync
./install.sh
```

### 2. Restart Claude Desktop (30 giây)

Quit và mở lại Claude Desktop.

### 3. Scan Database (30 giây)

Trong Claude Code:

```
User: Scan database từ Prisma schema
```

### 4. View Schema (1 phút)

```
User: Xem docs/database-schema.md
```

### 5. Analysis (2 phút)

```
User: Use prompt database-analysis
```

## ✅ Done!

Giờ bạn có:
- ✅ Mermaid ERD diagram
- ✅ Database context docs
- ✅ AI có full database knowledge
- ✅ Ready cho migrations, optimizations

## Kịch Bản Thực Tế

### Scenario 1: New Feature Cần Database Changes

```
User: I need to add comments feature to my blog
Claude: Let me analyze database schema first
Claude: [reads docs/database-context.md]
Claude: I see you have User and Post tables. I recommend:
  1. Create Comment table với fields: id, content, authorId, postId
  2. Add relationships: User hasMany Comments, Post hasMany Comments
  3. Migration plan: [generates Prisma migration]
```

### Scenario 2: Performance Issue

```
User: Queries are slow when fetching posts with authors
Claude: [reads docs/database-schema.md]
Claude: I see the issue - missing index on Post.authorId
Claude: Recommendations:
  1. Add @@index([authorId]) to Post model
  2. Use Prisma include to avoid N+1 queries:
     prisma.post.findMany({ include: { author: true } })
```

### Scenario 3: Code Review

```
User: Review this Prisma query
Claude: [reads database context]
Claude: ⚠️  This query has N+1 problem
Claude: Current: fetching posts then looping to get authors
Claude: Better: use include or select with nested relations
Claude: [provides optimized code]
```

## Tips

### Tip 1: Update Schema After Changes

```
User: Update database schema
```

Chạy sau khi modify Prisma schema để sync documentation.

### Tip 2: Compare Before Deploy

```
User: Compare schemas
```

See what changed trước khi deploy migrations.

### Tip 3: Use Prompts Regularly

```
User: Use prompt query-optimization
```

Để get AI suggestions về database performance.

## Workflow Integration

### Daily:
- ✅ Review schema before coding
- ✅ Use database-analysis prompt when unsure

### Before Commit:
- ✅ Update schema if models changed
- ✅ Compare schemas to track changes

### Before Deploy:
- ✅ Compare schemas
- ✅ Use migration-planning prompt
- ✅ Review generated migration plan

---

**Mục tiêu: AI luôn biết database structure → Better code, migrations, optimizations!** 🎯
