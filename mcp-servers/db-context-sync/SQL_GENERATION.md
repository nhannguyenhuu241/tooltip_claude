# SQL Generation - Prisma to SQL Database

## 🎯 Tính Năng Mới

Convert Prisma schema thành SQL database với full support cho:
- ✅ MySQL
- ✅ PostgreSQL
- ✅ SQLite

## 🔄 Workflow

```mermaid
sequenceDiagram
    participant User
    participant Claude
    participant MCP as MCP Server
    participant Parser as Prisma Parser
    participant SQLGen as SQL Generator
    participant DB as Database

    User->>Claude: "Convert Prisma schema to MySQL"
    Claude->>MCP: tools/call: generate_sql
    MCP->>Parser: Parse prisma/schema.prisma
    Parser-->>MCP: {tables, relationships}

    MCP->>SQLGen: Generate MySQL SQL
    SQLGen->>SQLGen: Convert types<br/>Prisma → MySQL
    SQLGen->>SQLGen: Create tables
    SQLGen->>SQLGen: Add foreign keys
    SQLGen->>SQLGen: Create indexes
    SQLGen-->>MCP: SQL script

    MCP->>MCP: Save schema-mysql.sql
    MCP-->>Claude: ✅ SQL generated
    Claude-->>User: "SQL file created!"

    User->>Claude: "Create database from SQL"
    Claude->>MCP: tools/call: create_database
    MCP->>DB: Execute SQL script
    DB-->>MCP: ✅ Database created
    MCP-->>Claude: Success
    Claude-->>User: "Database ready!"
```

---

## 🛠️ Tools Available

### 1. `generate_sql`

Generate SQL CREATE TABLE statements từ Prisma schema

**Usage:**
```
User: Generate MySQL SQL from Prisma schema
User: Convert Prisma to PostgreSQL
User: Create SQLite schema from Prisma
```

**Parameters:**
- `project_path` (required): Project root path
- `target_db` (required): 'mysql' | 'postgresql' | 'sqlite'
- `output_file` (optional): Custom output path (default: `schema-{db}.sql`)

**Output:**
- SQL file: `schema-mysql.sql`, `schema-postgresql.sql`, or `schema-sqlite.sql`
- Preview trong Claude response

### 2. `create_database`

Execute SQL script để tạo database

**Usage:**
```
User: Create MySQL database from schema-mysql.sql
User: Execute PostgreSQL schema
```

**Parameters:**
- `sql_file` (required): Path to SQL file
- `connection_string` (required): Database connection string
- `db_type` (required): 'mysql' | 'postgresql' | 'sqlite'

**Connection String Examples:**
```bash
# MySQL
mysql://user:password@localhost:3306/dbname

# PostgreSQL
postgresql://user:password@localhost:5432/dbname

# SQLite
/path/to/database.db
```

---

## 📊 Type Mapping

### Prisma → MySQL

| Prisma Type | MySQL Type | Notes |
|-------------|------------|-------|
| String | VARCHAR(255) | Default length 255 |
| Int | INT | 32-bit integer |
| BigInt | BIGINT | 64-bit integer |
| Float | DOUBLE | Double precision |
| Decimal | DECIMAL(10,2) | Fixed precision |
| Boolean | TINYINT(1) | 0 or 1 |
| DateTime | DATETIME | Full date + time |
| Json | JSON | Native JSON type |
| Bytes | BLOB | Binary data |

### Prisma → PostgreSQL

| Prisma Type | PostgreSQL Type | Notes |
|-------------|-----------------|-------|
| String | VARCHAR(255) | Variable length |
| Int | INTEGER | 32-bit |
| BigInt | BIGINT | 64-bit |
| Float | DOUBLE PRECISION | High precision |
| Decimal | DECIMAL(10,2) | Exact decimal |
| Boolean | BOOLEAN | Native boolean |
| DateTime | TIMESTAMP | With timezone |
| Json | JSONB | Binary JSON (faster) |
| Bytes | BYTEA | Binary array |

### Prisma → SQLite

| Prisma Type | SQLite Type | Notes |
|-------------|-------------|-------|
| String | TEXT | No length limit |
| Int | INTEGER | Flexible size |
| BigInt | INTEGER | Same as Int |
| Float | REAL | Floating point |
| Decimal | REAL | Stored as float |
| Boolean | INTEGER | 0 or 1 |
| DateTime | TEXT | ISO 8601 format |
| Json | TEXT | JSON string |
| Bytes | BLOB | Binary data |

---

## 📝 Example Usage

### Example 1: MySQL Full Workflow

**Step 1: Prisma Schema**
```prisma
// prisma/schema.prisma
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
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

**Step 2: Generate SQL**
```
User: Generate MySQL SQL from Prisma schema
```

**Generated SQL (schema-mysql.sql):**
```sql
-- MySQL Schema Generated from Prisma
-- Generated at: 2026-01-30T09:00:00.000Z

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
  `authorId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `Post`
  ADD CONSTRAINT `fk_Post_authorId`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
```

**Step 3: Create Database**
```
User: Create MySQL database from schema-mysql.sql with connection mysql://root:password@localhost:3306/myapp
```

**Result:**
```
✅ Database created successfully!

🗄️ Database: mysql
📄 SQL file: schema-mysql.sql
🔗 Connection: mysql://root:****@localhost:3306/myapp
```

---

### Example 2: PostgreSQL

**Generate SQL:**
```
User: Convert Prisma to PostgreSQL
```

**Generated SQL (schema-postgresql.sql):**
```sql
-- PostgreSQL Schema Generated from Prisma
-- Generated at: 2026-01-30T09:00:00.000Z

CREATE TABLE IF NOT EXISTS "User" (
  "id" INTEGER PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "Post" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT,
  "authorId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL
);

ALTER TABLE "Post"
  ADD CONSTRAINT "fk_Post_authorId"
  FOREIGN KEY ("authorId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "idx_Post_authorId"
  ON "Post" ("authorId");
```

---

### Example 3: SQLite

**Generate SQL:**
```
User: Create SQLite schema from Prisma
```

**Generated SQL (schema-sqlite.sql):**
```sql
-- SQLite Schema Generated from Prisma
-- Generated at: 2026-01-30T09:00:00.000Z

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
  "authorId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_Post_authorId"
  ON "Post" ("authorId");
```

---

## 🔍 Features Detail

### Auto-Generated Elements

#### 1. **Primary Keys**
- MySQL: `AUTO_INCREMENT`
- PostgreSQL: `PRIMARY KEY` with SERIAL
- SQLite: `PRIMARY KEY AUTOINCREMENT`

#### 2. **Foreign Keys**
- Automatically detected from `@relation` attributes
- Includes `ON DELETE CASCADE ON UPDATE CASCADE`
- Proper constraint naming: `fk_{table}_{field}`

#### 3. **Indexes**
- Auto-creates indexes on foreign key columns
- Index naming: `idx_{table}_{field}`
- Improves query performance

#### 4. **Unique Constraints**
- Detected from `@unique` attribute
- MySQL: `UNIQUE KEY {field}_unique`
- PostgreSQL/SQLite: `UNIQUE` inline

#### 5. **Nullable Fields**
- Prisma `?` → SQL nullable
- No `?` → `NOT NULL`

---

## 📊 Complex Example

### Prisma Schema
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  role      Role      @default(USER)
  posts     Post[]
  comments  Comment[]
  profile   Profile?
  createdAt DateTime  @default(now())
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  avatar String?
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId Int    @unique
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  comments  Comment[]
}

model Comment {
  id       Int    @id @default(autoincrement())
  content  String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
  post     Post   @relation(fields: [postId], references: [id])
  postId   Int
}

enum Role {
  USER
  ADMIN
}
```

### Generated MySQL
```sql
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Profile` (
  `id` INT AUTO_INCREMENT,
  `bio` TEXT,
  `avatar` VARCHAR(255),
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_unique` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Post` (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `authorId` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Comment` (
  `id` INT AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `authorId` INT NOT NULL,
  `postId` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE `Profile`
  ADD CONSTRAINT `fk_Profile_userId`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Post`
  ADD CONSTRAINT `fk_Post_authorId`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_Comment_authorId`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_Comment_postId`
  FOREIGN KEY (`postId`) REFERENCES `Post`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 🎯 Use Cases

### Use Case 1: Migrate from Prisma to MySQL

```
Developer: "I have Prisma schema, need MySQL database"

Workflow:
1. Generate MySQL SQL from Prisma
2. Review generated SQL
3. Create database
4. Verify tables created
```

### Use Case 2: Multi-Database Support

```
Developer: "Support both MySQL (production) and SQLite (testing)"

Workflow:
1. Generate MySQL SQL → schema-mysql.sql
2. Generate SQLite SQL → schema-sqlite.sql
3. Create MySQL database (production)
4. Create SQLite database (local testing)
```

### Use Case 3: Database Migration

```
Developer: "Migrate from PostgreSQL to MySQL"

Workflow:
1. Export current PostgreSQL data
2. Generate MySQL schema from Prisma
3. Create MySQL database
4. Import data to MySQL
5. Update connection string
```

---

## 🚀 Next Steps

### Planned Features

- ✅ Enum support (MySQL ENUM, PostgreSQL custom types)
- ✅ Index customization
- ✅ Default values
- ⚠️  Many-to-many relationships (junction tables)
- ⚠️  Database migrations (ALTER TABLE)
- ⚠️  Data seeding

### Improvements

- Better error handling
- Transaction support
- Rollback capability
- Schema validation
- SQL optimization

---

**Convert Prisma → SQL → Database in seconds!** 🚀
