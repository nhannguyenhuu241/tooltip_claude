# Complete Workflow - Prisma to Production

## 🎯 Full Journey: Development → Production Database

```mermaid
graph TB
    Start([Developer starts project])

    Prisma[Create Prisma Schema<br/>prisma/schema.prisma]

    subgraph "Documentation Phase"
        Scan[Scan Database<br/>Tool: scan_database]
        MermaidGen[Generate Mermaid ERD<br/>docs/database-schema.md]
        ContextGen[Generate Context<br/>docs/database-context.md]
    end

    subgraph "SQL Generation Phase"
        GenSQL[Generate SQL<br/>Tool: generate_sql]
        MySQL[schema-mysql.sql]
        PostgreSQL[schema-postgresql.sql]
        SQLite[schema-sqlite.sql]
    end

    subgraph "Database Creation Phase"
        CreateDB[Create Database<br/>Tool: create_database]
        ProdDB[(Production MySQL)]
        TestDB[(Testing SQLite)]
    end

    subgraph "AI Analysis Phase"
        Analysis[Database Analysis<br/>Prompt: database-analysis]
        Migration[Migration Planning<br/>Prompt: migration-planning]
        Optimization[Query Optimization<br/>Prompt: query-optimization]
    end

    Start --> Prisma
    Prisma --> Scan
    Scan --> MermaidGen
    Scan --> ContextGen

    MermaidGen --> GenSQL
    GenSQL --> MySQL
    GenSQL --> PostgreSQL
    GenSQL --> SQLite

    MySQL --> CreateDB
    PostgreSQL --> CreateDB
    SQLite --> CreateDB

    CreateDB --> ProdDB
    CreateDB --> TestDB

    MermaidGen -.-> Analysis
    ContextGen -.-> Analysis
    Analysis --> Migration
    Migration --> Optimization

    style Start fill:#90EE90
    style ProdDB fill:#FFD700
    style TestDB fill:#87CEEB
```

---

## 📋 Step-by-Step Guide

### Phase 1: Prisma Schema Setup

**1. Create Prisma Schema**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())

  @@index([authorId])
}
```

**2. Scan Database**
```
User: Scan database từ Prisma schema
```

**Result:**
- ✅ `docs/database-schema.md` created (Mermaid ERD)
- ✅ `docs/database-context.md` created (AI context)

---

### Phase 2: Visual Documentation

**Generated Mermaid ERD:**
```mermaid
erDiagram
    User {
        Int id PK
        String email UNIQUE
        String name
        DateTime createdAt
    }
    Post {
        Int id PK
        String title
        String content
        Boolean published
        Int authorId FK
        DateTime createdAt
    }
    User ||--o{ Post : "posts"
```

**Benefits:**
- ✅ Visual representation cho team
- ✅ AI có full context
- ✅ Easy to understand relationships
- ✅ Documentation always up-to-date

---

### Phase 3: SQL Generation

**For Production (MySQL):**
```
User: Generate MySQL SQL from Prisma schema
```

**Generated `schema-mysql.sql`:**
```sql
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Post` (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `authorId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `Post`
  ADD CONSTRAINT `fk_Post_authorId`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX `idx_Post_authorId` ON `Post` (`authorId`);
```

**For Testing (SQLite):**
```
User: Generate SQLite SQL from Prisma schema
```

**Generated `schema-sqlite.sql`:**
```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "User" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "createdAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Post" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "published" INTEGER NOT NULL DEFAULT 0,
  "authorId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TEXT NOT NULL
);

CREATE INDEX "idx_Post_authorId" ON "Post" ("authorId");
```

---

### Phase 4: Database Creation

**Create Production Database (MySQL):**
```
User: Create MySQL database from schema-mysql.sql with connection mysql://admin:password@prod.example.com:3306/myapp
```

**Result:**
```
✅ Database created successfully!

🗄️ Database: mysql
📄 SQL file: schema-mysql.sql
🔗 Connection: mysql://admin:****@prod.example.com:3306/myapp
```

**Create Testing Database (SQLite):**
```
User: Create SQLite database from schema-sqlite.sql with path ./test.db
```

**Result:**
```
✅ Database created successfully!

🗄️ Database: sqlite
📄 SQL file: schema-sqlite.sql
🔗 Connection: ./test.db
```

---

### Phase 5: AI-Powered Analysis

**Database Analysis:**
```
User: Use prompt database-analysis
```

**Claude Output:**
```markdown
# Database Analysis

## ✅ Điểm Tốt

1. **Cấu trúc tables**: Well-normalized, proper relationships
2. **Primary Keys**: All tables có PK với AUTO_INCREMENT
3. **Foreign Keys**: Properly configured với CASCADE
4. **Indexes**: Index on authorId cho better query performance

## ⚠️ Vấn Đề Cần Chú Ý

1. **Missing Indexes**:
   - Consider index on Post.createdAt cho time-based queries
   - Consider index on Post.published cho filtering

2. **Email Validation**:
   - Thêm constraint để validate email format
   - Consider max length cho email

3. **Content Field**:
   - VARCHAR(255) might be too small for long content
   - Consider TEXT type instead

## 🔧 Recommendations

1. Add index on Post.createdAt:
   ```sql
   CREATE INDEX idx_Post_createdAt ON Post (createdAt);
   ```

2. Add composite index for common queries:
   ```sql
   CREATE INDEX idx_Post_published_createdAt
     ON Post (published, createdAt);
   ```

3. Add check constraint for email:
   ```sql
   ALTER TABLE User
     ADD CONSTRAINT chk_email_format
     CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$');
   ```
```

---

### Phase 6: Query Optimization

**Query Optimization Prompt:**
```
User: Use prompt query-optimization
```

**Claude Output:**
```markdown
# Query Optimization Suggestions

## Current Common Queries

### ❌ Query 1: Get Posts with Authors (N+1 Problem)
```typescript
// Bad: N+1 queries
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId }
  });
}
```

### ✅ Optimized: Use include
```typescript
const posts = await prisma.post.findMany({
  include: {
    author: true
  }
});
```

**Performance Impact:**
- Before: 1 + N queries (N = number of posts)
- After: 1 query with JOIN
- Speedup: ~10-100x

---

## Index Recommendations

### 1. Time-Based Queries
```sql
CREATE INDEX idx_Post_createdAt ON Post (createdAt DESC);
```

**Benefits:**
- Fast sorting by creation date
- Efficient pagination queries

### 2. Composite Index for Filtering
```sql
CREATE INDEX idx_Post_published_createdAt
  ON Post (published, createdAt DESC);
```

**Use Case:**
```typescript
// Optimized query
const publishedPosts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' }
});
```

### 3. Author Lookup Optimization
Already indexed: `idx_Post_authorId`

**Use Case:**
```typescript
// Fast query
const userPosts = await prisma.post.findMany({
  where: { authorId: userId }
});
```
```

---

### Phase 7: Migration Planning

**When Adding New Feature:**
```
User: I need to add Comments feature
```

**Claude reads database-context.md and suggests:**

```markdown
# Migration Plan: Add Comments Feature

## Step 1: Update Prisma Schema

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  createdAt DateTime @default(now())

  @@index([authorId])
  @@index([postId])
}

model User {
  // existing fields...
  comments  Comment[]
}

model Post {
  // existing fields...
  comments  Comment[]
}
```

## Step 2: Generate SQL Migration

### MySQL:
```sql
CREATE TABLE IF NOT EXISTS `Comment` (
  `id` INT AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `authorId` INT NOT NULL,
  `postId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_Comment_authorId`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_Comment_postId`
  FOREIGN KEY (`postId`) REFERENCES `Post`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX `idx_Comment_authorId` ON `Comment` (`authorId`);
CREATE INDEX `idx_Comment_postId` ON `Comment` (`postId`);
```

## Step 3: Execute Migration

```
User: Generate SQL from updated Prisma schema
User: Create database from new SQL
```

## Step 4: Rollback Plan (if needed)

```sql
DROP TABLE IF EXISTS `Comment`;
-- Relationships automatically removed with CASCADE
```
```

---

## 🔄 Complete Workflow Diagram

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Prisma as Prisma Schema
    participant MCP as DB Context Sync MCP
    participant Docs as Documentation
    participant SQL as SQL Files
    participant DB as Database

    Note over Dev: Phase 1: Setup
    Dev->>Prisma: Create schema
    Dev->>MCP: Scan database
    MCP->>Docs: Generate Mermaid ERD
    MCP->>Docs: Generate context

    Note over Dev: Phase 2: SQL Generation
    Dev->>MCP: Generate MySQL SQL
    MCP->>SQL: Create schema-mysql.sql
    Dev->>MCP: Generate SQLite SQL
    MCP->>SQL: Create schema-sqlite.sql

    Note over Dev: Phase 3: Database Creation
    Dev->>MCP: Create MySQL database
    MCP->>DB: Execute MySQL script
    Dev->>MCP: Create SQLite database
    MCP->>DB: Execute SQLite script

    Note over Dev: Phase 4: AI Analysis
    Dev->>MCP: Prompt: database-analysis
    MCP->>Docs: Read ERD + context
    MCP-->>Dev: Recommendations

    Dev->>MCP: Prompt: query-optimization
    MCP-->>Dev: Optimized queries

    Note over Dev: Phase 5: Feature Development
    Dev->>Prisma: Add Comment model
    Dev->>MCP: Update schema
    MCP->>Docs: Update documentation
    Dev->>MCP: Generate SQL migration
    MCP->>SQL: Create migration.sql
    Dev->>MCP: Execute migration
    MCP->>DB: Update database
```

---

## 🎯 Real-World Scenarios

### Scenario 1: Startup MVP → Production

1. **Day 1**: Create Prisma schema cho MVP
2. **Day 1**: Scan database → Get Mermaid diagram
3. **Day 2**: Generate SQLite SQL → Test locally
4. **Day 3**: Test queries with AI optimization
5. **Week 2**: Generate MySQL SQL → Deploy to production
6. **Week 2**: Use database-analysis → Fix performance issues

### Scenario 2: Team Collaboration

1. **Developer A**: Creates Prisma schema
2. **Developer A**: Scans database → Generates docs
3. **Developer B**: Pulls code, views Mermaid ERD
4. **Developer B**: Understands schema instantly
5. **Developer B**: Uses query-optimization prompt
6. **Developer B**: Implements optimized queries

### Scenario 3: Multi-Environment Setup

1. **Development**: SQLite database (fast, local)
2. **Staging**: PostgreSQL (cloud, similar to production)
3. **Production**: MySQL (enterprise-grade)
4. **All environments**: Same Prisma schema
5. **One command**: Generate SQL for each environment

---

## 📊 Benefits Summary

| Phase | Tool/Prompt | Benefit | Time Saved |
|-------|-------------|---------|------------|
| Documentation | `scan_database` | Visual ERD + AI context | 2-3 hours |
| SQL Generation | `generate_sql` | Auto-convert Prisma → SQL | 1-2 hours |
| Database Setup | `create_database` | One-command deployment | 30 min |
| Analysis | `database-analysis` | AI-powered recommendations | 1-2 hours |
| Optimization | `query-optimization` | Performance improvements | 2-4 hours |
| Migration | `migration-planning` | Safe schema changes | 1-2 hours |

**Total Time Saved**: 7-13 hours per project! 🚀

---

**From Prisma schema to production database with AI-powered optimization in minutes!** ✨
