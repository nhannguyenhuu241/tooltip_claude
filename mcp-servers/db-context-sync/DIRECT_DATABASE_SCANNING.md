# Direct Database Scanning - Reverse Engineering

## 🎯 Không Cần Prisma Schema

Scan **trực tiếp từ database thực tế** (MySQL, PostgreSQL, SQLite) và generate:
- ✅ Mermaid ERD
- ✅ Documentation
- ✅ Prisma schema (reverse engineering)
- ✅ SQL exports

## 🔄 Workflow: Database → Documentation

```mermaid
graph TB
    subgraph "Existing Database"
        MySQL[(MySQL<br/>Production DB)]
        PostgreSQL[(PostgreSQL<br/>Staging DB)]
        SQLite[(SQLite<br/>Local DB)]
    end

    subgraph "MCP Server - Reverse Engineering"
        Connect[Connect to Database]
        Query[Query Schema<br/>INFORMATION_SCHEMA]
        Parse[Parse Tables<br/>Columns, Indexes, FKs]
    end

    subgraph "Generated Documentation"
        Mermaid[Mermaid ERD<br/>docs/database-schema.md]
        Context[Database Context<br/>docs/database-context.md]
        PrismaSchema[Prisma Schema<br/>prisma/schema.prisma]
        SQLExport[SQL Export<br/>schema-export.sql]
    end

    subgraph "AI Analysis"
        Analysis[Database Analysis]
        Optimization[Query Optimization]
        Migration[Migration Planning]
    end

    MySQL --> Connect
    PostgreSQL --> Connect
    SQLite --> Connect

    Connect --> Query
    Query --> Parse

    Parse --> Mermaid
    Parse --> Context
    Parse --> PrismaSchema
    Parse --> SQLExport

    Mermaid -.-> Analysis
    Context -.-> Optimization
    PrismaSchema -.-> Migration

    style MySQL fill:#4479A1
    style PostgreSQL fill:#336791
    style SQLite fill:#003B57
```

---

## 📊 Database Schema Query Methods

### MySQL - Query INFORMATION_SCHEMA

```sql
-- Get all tables
SELECT
  TABLE_NAME,
  TABLE_COMMENT,
  ENGINE,
  TABLE_COLLATION
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_TYPE = 'BASE TABLE';

-- Get all columns
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_KEY,
  COLUMN_DEFAULT,
  EXTRA,
  COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Get foreign keys
SELECT
  CONSTRAINT_NAME,
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME,
  UPDATE_RULE,
  DELETE_RULE
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Get indexes
SELECT
  TABLE_NAME,
  INDEX_NAME,
  COLUMN_NAME,
  NON_UNIQUE,
  INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

### PostgreSQL - Query information_schema

```sql
-- Get all tables
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- Get all columns
SELECT
  table_name,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Get foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';

-- Get indexes
SELECT
  t.relname AS table_name,
  i.relname AS index_name,
  a.attname AS column_name,
  ix.indisunique AS is_unique,
  ix.indisprimary AS is_primary
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid
WHERE t.relkind = 'r'
  AND a.attnum = ANY(ix.indkey)
ORDER BY t.relname, i.relname;
```

### SQLite - Query sqlite_master

```sql
-- Get all tables
SELECT
  name,
  type,
  sql
FROM sqlite_master
WHERE type = 'table'
  AND name NOT LIKE 'sqlite_%';

-- Parse CREATE TABLE statements for columns
-- SQLite doesn't have INFORMATION_SCHEMA
-- Need to parse SQL from sqlite_master

-- Get indexes
SELECT
  name,
  tbl_name,
  sql
FROM sqlite_master
WHERE type = 'index'
  AND name NOT LIKE 'sqlite_%';

-- Get foreign keys (requires PRAGMA)
PRAGMA foreign_key_list(table_name);
```

---

## 🛠️ Implementation: scanMySQLDatabase()

```javascript
async scanMySQLDatabase(connectionString) {
  const mysql = await import('mysql2/promise');
  const connection = await mysql.createConnection(connectionString);

  try {
    // Get all tables
    const [tables] = await connection.execute(`
      SELECT
        TABLE_NAME,
        TABLE_COMMENT,
        ENGINE
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_TYPE = 'BASE TABLE'
    `);

    const schema = { tables: [], relationships: [] };

    for (const tableRow of tables) {
      const tableName = tableRow.TABLE_NAME;

      // Get columns for this table
      const [columns] = await connection.execute(`
        SELECT
          COLUMN_NAME,
          DATA_TYPE,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);

      const fields = columns.map(col => ({
        name: col.COLUMN_NAME,
        type: this.mysqlTypeToPrisma(col.DATA_TYPE),
        nullable: col.IS_NULLABLE === 'YES',
        isPrimaryKey: col.COLUMN_KEY === 'PRI',
        isUnique: col.COLUMN_KEY === 'UNI',
        isForeignKey: col.COLUMN_KEY === 'MUL',
        defaultValue: col.COLUMN_DEFAULT,
        autoIncrement: col.EXTRA.includes('auto_increment'),
      }));

      schema.tables.push({
        name: tableName,
        fields,
        comment: tableRow.TABLE_COMMENT,
        engine: tableRow.ENGINE,
      });
    }

    // Get foreign keys
    const [foreignKeys] = await connection.execute(`
      SELECT
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME,
        UPDATE_RULE,
        DELETE_RULE
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    for (const fk of foreignKeys) {
      schema.relationships.push({
        from: fk.TABLE_NAME,
        fromField: fk.COLUMN_NAME,
        to: fk.REFERENCED_TABLE_NAME,
        toField: fk.REFERENCED_COLUMN_NAME,
        onDelete: fk.DELETE_RULE,
        onUpdate: fk.UPDATE_RULE,
        type: 'many-to-one', // Detect from cardinality
      });
    }

    return schema;

  } finally {
    await connection.end();
  }
}

mysqlTypeToPrisma(mysqlType) {
  const typeMap = {
    'int': 'Int',
    'bigint': 'BigInt',
    'varchar': 'String',
    'text': 'String',
    'datetime': 'DateTime',
    'timestamp': 'DateTime',
    'tinyint': 'Boolean',
    'double': 'Float',
    'decimal': 'Decimal',
    'json': 'Json',
    'blob': 'Bytes',
  };
  return typeMap[mysqlType.toLowerCase()] || 'String';
}
```

---

## 📝 Example: Reverse Engineer MySQL

### Existing MySQL Database

```sql
-- Production database
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published TINYINT(1) DEFAULT 0,
  author_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_author_id (author_id),
  INDEX idx_published_created (published, created_at)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  author_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_author_id (author_id),
  INDEX idx_post_id (post_id)
);
```

### Scan Database

```
User: Scan MySQL database với connection mysql://user:pass@localhost:3306/myapp
```

### Generated Mermaid ERD

```mermaid
erDiagram
    users {
        INT id PK
        VARCHAR email UNIQUE
        VARCHAR name
        ENUM role
        DATETIME created_at
        DATETIME updated_at
    }
    posts {
        INT id PK
        VARCHAR title
        TEXT content
        TINYINT published
        INT author_id FK
        DATETIME created_at
    }
    comments {
        INT id PK
        TEXT content
        INT author_id FK
        INT post_id FK
        DATETIME created_at
    }
    users ||--o{ posts : "author"
    users ||--o{ comments : "author"
    posts ||--o{ comments : "post"
```

### Generated Prisma Schema

```prisma
// Reverse engineered from MySQL database
// Generated at: 2026-01-30T10:00:00.000Z

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model users {
  id         Int        @id @default(autoincrement())
  email      String     @unique @db.VarChar(255)
  name       String?    @db.VarChar(255)
  role       Role       @default(USER)
  created_at DateTime   @default(now())
  updated_at DateTime   @default(now()) @updatedAt

  posts      posts[]
  comments   comments[]

  @@index([email])
  @@map("users")
}

model posts {
  id         Int        @id @default(autoincrement())
  title      String     @db.VarChar(255)
  content    String?    @db.Text
  published  Boolean    @default(false)
  author_id  Int
  created_at DateTime   @default(now())

  author     users      @relation(fields: [author_id], references: [id], onDelete: Cascade)
  comments   comments[]

  @@index([author_id])
  @@index([published, created_at])
  @@map("posts")
}

model comments {
  id         Int      @id @default(autoincrement())
  content    String   @db.Text
  author_id  Int
  post_id    Int
  created_at DateTime @default(now())

  author     users    @relation(fields: [author_id], references: [id], onDelete: Cascade)
  post       posts    @relation(fields: [post_id], references: [id], onDelete: Cascade)

  @@index([author_id])
  @@index([post_id])
  @@map("comments")
}

enum Role {
  USER
  ADMIN
}
```

---

## 🔍 Advanced Features

### 1. Detect Relationships from Naming Conventions

```javascript
detectImplicitRelationships(tables) {
  const relationships = [];

  for (const table of tables) {
    for (const field of table.fields) {
      // Pattern: {table_name}_id → FK to {table_name}
      const match = field.name.match(/^(.+)_id$/);
      if (match) {
        const referencedTable = match[1] + 's'; // users, posts, etc.
        const targetTable = tables.find(t => t.name === referencedTable);

        if (targetTable) {
          relationships.push({
            from: table.name,
            fromField: field.name,
            to: referencedTable,
            toField: 'id',
            type: 'many-to-one',
            implicit: true, // Detected by naming convention
          });
        }
      }
    }
  }

  return relationships;
}
```

### 2. Detect Many-to-Many Junction Tables

```javascript
detectJunctionTables(tables) {
  const junctionTables = [];

  for (const table of tables) {
    // Junction table patterns:
    // - Exactly 2 foreign keys
    // - No other significant columns
    // - Name like "table1_table2" or "table1_has_table2"

    const foreignKeys = table.fields.filter(f => f.isForeignKey);

    if (foreignKeys.length === 2) {
      const otherFields = table.fields.filter(f =>
        !f.isForeignKey && !f.isPrimaryKey
      );

      if (otherFields.length === 0 ||
          (otherFields.length === 1 && otherFields[0].name === 'created_at')) {
        junctionTables.push({
          name: table.name,
          table1: foreignKeys[0].referencedTable,
          table2: foreignKeys[1].referencedTable,
          type: 'many-to-many',
        });
      }
    }
  }

  return junctionTables;
}
```

### 3. Export to Different Formats

```javascript
async exportToFormat(schema, format) {
  switch (format) {
    case 'prisma':
      return this.generatePrismaSchema(schema);

    case 'typeorm':
      return this.generateTypeORMEntities(schema);

    case 'sequelize':
      return this.generateSequelizeModels(schema);

    case 'mermaid':
      return this.generateMermaidERD(schema);

    case 'json':
      return JSON.stringify(schema, null, 2);

    case 'markdown':
      return this.generateMarkdownDoc(schema);

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
```

---

## 🎯 Use Cases

### Use Case 1: Legacy Database Documentation

**Scenario**: Inherited codebase với MySQL database nhưng không có documentation

**Workflow:**
```
1. User: "Scan MySQL database"
2. MCP: Connects, queries INFORMATION_SCHEMA
3. MCP: Generates Mermaid ERD + documentation
4. User: "Use prompt database-analysis"
5. Claude: Analyzes và suggests improvements
```

**Result:**
- ✅ Visual ERD cho toàn bộ team
- ✅ Documentation always up-to-date
- ✅ AI có context để help với queries

---

### Use Case 2: Database Migration Planning

**Scenario**: Muốn migrate từ MySQL sang PostgreSQL

**Workflow:**
```
1. User: "Scan MySQL production database"
2. User: "Generate PostgreSQL SQL from scanned schema"
3. User: "Compare MySQL and PostgreSQL schemas"
4. User: "Use prompt migration-planning"
5. Claude: Creates detailed migration plan
```

**Result:**
- ✅ SQL conversion script
- ✅ Migration plan với rollback strategy
- ✅ Data migration recommendations

---

### Use Case 3: Prisma Adoption

**Scenario**: Existing database, muốn sử dụng Prisma ORM

**Workflow:**
```
1. User: "Scan PostgreSQL database"
2. User: "Generate Prisma schema from database"
3. User: "Review generated schema"
4. User: Adjust schema if needed
5. User: "npx prisma generate"
```

**Result:**
- ✅ Prisma schema từ existing database
- ✅ Type-safe database access
- ✅ Easy migrations going forward

---

## 📊 Comparison: Prisma vs Direct Scan

| Feature | Prisma Schema → DB | Direct DB Scan |
|---------|-------------------|----------------|
| **Source** | Prisma schema file | Live database |
| **Use Case** | New projects | Existing databases |
| **Accuracy** | 100% (source of truth) | 100% (actual data) |
| **Dependencies** | Requires Prisma | Database only |
| **Speed** | Fast (file read) | Slower (network query) |
| **Reverse Engineering** | ❌ No | ✅ Yes |
| **Best For** | Greenfield projects | Legacy systems |

---

## 🚀 Implementation Roadmap

### Phase 1: Core Scanning ✅
- [x] MySQL INFORMATION_SCHEMA queries
- [x] PostgreSQL information_schema queries
- [x] SQLite sqlite_master parsing
- [x] Generate Mermaid ERD
- [x] Generate documentation

### Phase 2: Reverse Engineering ⚠️
- [ ] Generate Prisma schema from DB
- [ ] Detect implicit relationships
- [ ] Detect junction tables
- [ ] Generate TypeORM entities
- [ ] Generate Sequelize models

### Phase 3: Advanced Features ⚠️
- [ ] Multi-database comparison
- [ ] Schema diff visualization
- [ ] Data migration scripts
- [ ] Index optimization suggestions
- [ ] Query performance analysis

---

## 💡 Best Practices

### 1. Connection Security

```javascript
// ✅ Use environment variables
const connectionString = process.env.DATABASE_URL;

// ✅ Use read-only user for scanning
const readOnlyConnection = {
  host: 'localhost',
  user: 'readonly_user',
  password: 'secure_password',
  database: 'myapp',
};

// ❌ Never hardcode credentials
const badConnection = 'mysql://root:password123@localhost/prod';
```

### 2. Large Database Handling

```javascript
// ✅ Scan in batches
async scanLargeTables(connection) {
  const batchSize = 10;
  const tables = await this.getAllTables(connection);

  for (let i = 0; i < tables.length; i += batchSize) {
    const batch = tables.slice(i, i + batchSize);
    await this.processBatch(batch);
  }
}

// ✅ Use connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'user',
  password: 'pass',
  database: 'db',
});
```

### 3. Error Handling

```javascript
async scanDatabaseSafe(connectionString) {
  try {
    return await this.scanDatabase(connectionString);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Database connection refused. Check host and port.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Access denied. Check username and password.');
    } else {
      throw new Error(`Database scan failed: ${error.message}`);
    }
  }
}
```

---

**Scan any database → Generate documentation → AI-powered analysis!** 🎯
