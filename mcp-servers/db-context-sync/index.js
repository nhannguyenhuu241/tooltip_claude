#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * DB Context Sync MCP Server
 *
 * Tự động scan database schema và generate Mermaid diagrams
 * Lưu vào context files để AI có thể đọc và phân tích
 */
class DBContextSyncServer {
  constructor() {
    this.server = new Server(
      {
        name: 'db-context-sync',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(
      { method: 'tools/list' },
      async () => {
        return {
          tools: [
            {
              name: 'scan_database',
              description: 'Scan database schema and generate Mermaid ERD',
              inputSchema: {
                type: 'object',
                properties: {
                  project_path: {
                    type: 'string',
                    description: 'Project root path',
                  },
                  db_type: {
                    type: 'string',
                    enum: ['mysql', 'postgresql', 'sqlite', 'prisma'],
                    description: 'Database type',
                  },
                  connection_string: {
                    type: 'string',
                    description: 'Database connection string (optional for Prisma)',
                  },
                },
                required: ['project_path', 'db_type'],
              },
            },
            {
              name: 'update_schema',
              description: 'Update database schema documentation',
              inputSchema: {
                type: 'object',
                properties: {
                  project_path: {
                    type: 'string',
                    description: 'Project root path',
                  },
                },
                required: ['project_path'],
              },
            },
            {
              name: 'compare_schemas',
              description: 'Compare current schema with previous version',
              inputSchema: {
                type: 'object',
                properties: {
                  project_path: {
                    type: 'string',
                    description: 'Project root path',
                  },
                },
                required: ['project_path'],
              },
            },
            {
              name: 'generate_sql',
              description: 'Generate SQL CREATE TABLE statements from Prisma schema',
              inputSchema: {
                type: 'object',
                properties: {
                  project_path: {
                    type: 'string',
                    description: 'Project root path',
                  },
                  target_db: {
                    type: 'string',
                    enum: ['mysql', 'postgresql', 'sqlite'],
                    description: 'Target database type',
                  },
                  output_file: {
                    type: 'string',
                    description: 'Output SQL file path (optional, defaults to schema.sql)',
                  },
                },
                required: ['project_path', 'target_db'],
              },
            },
            {
              name: 'create_database',
              description: 'Execute SQL to create database from generated SQL',
              inputSchema: {
                type: 'object',
                properties: {
                  sql_file: {
                    type: 'string',
                    description: 'Path to SQL file',
                  },
                  connection_string: {
                    type: 'string',
                    description: 'Database connection string',
                  },
                  db_type: {
                    type: 'string',
                    enum: ['mysql', 'postgresql', 'sqlite'],
                    description: 'Database type',
                  },
                },
                required: ['sql_file', 'connection_string', 'db_type'],
              },
            },
          ],
        };
      }
    );

    this.server.setRequestHandler(
      { method: 'tools/call' },
      async (request) => {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'scan_database':
            return await this.handleScanDatabase(args);
          case 'update_schema':
            return await this.handleUpdateSchema(args);
          case 'compare_schemas':
            return await this.handleCompareSchemas(args);
          case 'generate_sql':
            return await this.handleGenerateSQL(args);
          case 'create_database':
            return await this.handleCreateDatabase(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      }
    );
  }

  setupResourceHandlers() {
    this.server.setRequestHandler(
      { method: 'resources/list' },
      async (request) => {
        const { project_path } = request.params || {};

        const resources = [];

        if (project_path) {
          const schemaPath = join(project_path, 'docs/database-schema.md');
          const contextPath = join(project_path, 'docs/database-context.md');

          if (existsSync(schemaPath)) {
            resources.push({
              uri: `file://${schemaPath}`,
              name: 'Database Schema (Mermaid)',
              description: 'Mermaid ERD of database schema',
              mimeType: 'text/markdown',
              server: 'db-context-sync',
            });
          }

          if (existsSync(contextPath)) {
            resources.push({
              uri: `file://${contextPath}`,
              name: 'Database Context',
              description: 'Database metadata and relationships',
              mimeType: 'text/markdown',
              server: 'db-context-sync',
            });
          }
        }

        return { resources };
      }
    );

    this.server.setRequestHandler(
      { method: 'resources/read' },
      async (request) => {
        const { uri } = request.params;
        const filePath = uri.replace('file://', '');

        if (!existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const content = readFileSync(filePath, 'utf-8');

        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      }
    );
  }

  setupPromptHandlers() {
    this.server.setRequestHandler(
      { method: 'prompts/list' },
      async () => {
        return {
          prompts: [
            {
              name: 'database-analysis',
              description: 'Analyze database structure and suggest improvements',
            },
            {
              name: 'migration-planning',
              description: 'Plan database migrations based on schema changes',
            },
            {
              name: 'query-optimization',
              description: 'Suggest query optimizations based on schema',
            },
          ],
        };
      }
    );

    this.server.setRequestHandler(
      { method: 'prompts/get' },
      async (request) => {
        const { name, arguments: args } = request.params;
        const projectPath = args?.project_path;

        switch (name) {
          case 'database-analysis':
            return this.generateDatabaseAnalysisPrompt(projectPath);
          case 'migration-planning':
            return this.generateMigrationPlanningPrompt(projectPath);
          case 'query-optimization':
            return this.generateQueryOptimizationPrompt(projectPath);
          default:
            throw new Error(`Unknown prompt: ${name}`);
        }
      }
    );
  }

  async handleScanDatabase(args) {
    const { project_path, db_type, connection_string } = args;

    try {
      let schema;

      switch (db_type) {
        case 'prisma':
          schema = await this.scanPrismaSchema(project_path);
          break;
        case 'mysql':
          schema = await this.scanMySQLSchema(connection_string);
          break;
        case 'postgresql':
          schema = await this.scanPostgreSQLSchema(connection_string);
          break;
        case 'sqlite':
          schema = await this.scanSQLiteSchema(connection_string);
          break;
        default:
          throw new Error(`Unsupported database type: ${db_type}`);
      }

      // Generate Mermaid diagram
      const mermaidDiagram = this.generateMermaidERD(schema);

      // Generate context documentation
      const contextDoc = this.generateContextDoc(schema);

      // Ensure docs directory exists
      const docsDir = join(project_path, 'docs');
      if (!existsSync(docsDir)) {
        mkdirSync(docsDir, { recursive: true });
      }

      // Save files
      const schemaPath = join(docsDir, 'database-schema.md');
      const contextPath = join(docsDir, 'database-context.md');

      writeFileSync(schemaPath, mermaidDiagram, 'utf-8');
      writeFileSync(contextPath, contextDoc, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: `✅ Database schema scanned successfully!\n\n` +
                  `📊 Tables: ${schema.tables.length}\n` +
                  `🔗 Relationships: ${schema.relationships.length}\n\n` +
                  `Files created:\n` +
                  `- ${schemaPath}\n` +
                  `- ${contextPath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error scanning database: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async scanPrismaSchema(projectPath) {
    const prismaSchemaPath = join(projectPath, 'prisma/schema.prisma');

    if (!existsSync(prismaSchemaPath)) {
      throw new Error('Prisma schema not found at prisma/schema.prisma');
    }

    const schemaContent = readFileSync(prismaSchemaPath, 'utf-8');

    // Parse Prisma schema
    const tables = [];
    const relationships = [];

    // Simple regex parsing (in production, use @prisma/internals)
    const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;
    let match;

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      const tableName = match[1];
      const fieldsContent = match[2];

      const fields = [];
      const fieldLines = fieldsContent.split('\n').filter(line => line.trim());

      for (const line of fieldLines) {
        const fieldMatch = line.match(/^\s*(\w+)\s+(\w+)(\?|\[\])?\s*(.*)?$/);
        if (fieldMatch) {
          const [, fieldName, fieldType, modifier, attributes] = fieldMatch;

          fields.push({
            name: fieldName,
            type: fieldType,
            nullable: modifier === '?',
            isArray: modifier === '[]',
            isPrimaryKey: attributes?.includes('@id'),
            isUnique: attributes?.includes('@unique'),
            isForeignKey: attributes?.includes('@relation'),
          });

          // Extract relationships
          if (attributes?.includes('@relation')) {
            const relMatch = attributes.match(/@relation\(.*?references:\s*\[(\w+)\]/);
            if (relMatch) {
              relationships.push({
                from: tableName,
                to: fieldType,
                fromField: fieldName,
                toField: relMatch[1],
                type: modifier === '[]' ? 'one-to-many' : 'many-to-one',
              });
            }
          }
        }
      }

      tables.push({
        name: tableName,
        fields,
      });
    }

    return { tables, relationships };
  }

  async scanMySQLSchema(connectionString) {
    // In production, use mysql2 to connect and query INFORMATION_SCHEMA
    throw new Error('MySQL scanning not yet implemented. Use Prisma schema instead.');
  }

  async scanPostgreSQLSchema(connectionString) {
    // In production, use pg to connect and query information_schema
    throw new Error('PostgreSQL scanning not yet implemented. Use Prisma schema instead.');
  }

  async scanSQLiteSchema(connectionString) {
    // In production, use better-sqlite3 to read schema
    throw new Error('SQLite scanning not yet implemented. Use Prisma schema instead.');
  }

  generateMermaidERD(schema) {
    const { tables, relationships } = schema;

    let mermaid = '# Database Schema\n\n';
    mermaid += '**Auto-generated database schema documentation**\n\n';
    mermaid += '## Entity Relationship Diagram\n\n';
    mermaid += '```mermaid\nerDiagram\n';

    // Generate tables
    for (const table of tables) {
      mermaid += `    ${table.name} {\n`;
      for (const field of table.fields) {
        let typeStr = field.type;
        if (field.isPrimaryKey) typeStr += ' PK';
        if (field.isForeignKey) typeStr += ' FK';
        if (field.isUnique) typeStr += ' UNIQUE';
        if (!field.nullable) typeStr += ' NOT NULL';

        mermaid += `        ${typeStr} ${field.name}\n`;
      }
      mermaid += `    }\n`;
    }

    // Generate relationships
    for (const rel of relationships) {
      const relationshipType = rel.type === 'one-to-many' ? '||--o{' : '}o--||';
      mermaid += `    ${rel.from} ${relationshipType} ${rel.to} : "${rel.fromField}"\n`;
    }

    mermaid += '```\n\n';

    // Add table details
    mermaid += '## Tables\n\n';
    for (const table of tables) {
      mermaid += `### ${table.name}\n\n`;
      mermaid += '| Column | Type | Constraints |\n';
      mermaid += '|--------|------|-------------|\n';

      for (const field of table.fields) {
        const constraints = [];
        if (field.isPrimaryKey) constraints.push('PRIMARY KEY');
        if (field.isForeignKey) constraints.push('FOREIGN KEY');
        if (field.isUnique) constraints.push('UNIQUE');
        if (!field.nullable) constraints.push('NOT NULL');

        mermaid += `| ${field.name} | ${field.type}${field.isArray ? '[]' : ''} | ${constraints.join(', ')} |\n`;
      }

      mermaid += '\n';
    }

    mermaid += `\n---\n\n*Auto-generated: ${new Date().toISOString()}*\n`;

    return mermaid;
  }

  generateContextDoc(schema) {
    const { tables, relationships } = schema;

    let doc = '# Database Context\n\n';
    doc += '**Auto-generated database context for AI assistants**\n\n';
    doc += `Last updated: ${new Date().toISOString()}\n\n`;

    doc += '## Summary\n\n';
    doc += `- **Total Tables**: ${tables.length}\n`;
    doc += `- **Total Relationships**: ${relationships.length}\n\n`;

    doc += '## Table Overview\n\n';
    for (const table of tables) {
      const pkFields = table.fields.filter(f => f.isPrimaryKey);
      const fkFields = table.fields.filter(f => f.isForeignKey);

      doc += `### ${table.name}\n`;
      doc += `- Fields: ${table.fields.length}\n`;
      doc += `- Primary Keys: ${pkFields.map(f => f.name).join(', ') || 'None'}\n`;
      doc += `- Foreign Keys: ${fkFields.map(f => f.name).join(', ') || 'None'}\n\n`;
    }

    doc += '## Relationships\n\n';
    for (const rel of relationships) {
      doc += `- **${rel.from}** → **${rel.to}** (${rel.type})\n`;
      doc += `  - Field: ${rel.fromField} → ${rel.toField}\n\n`;
    }

    doc += '## AI Recommendations\n\n';
    doc += '### Before Modifying Schema:\n';
    doc += '1. Check relationships that might be affected\n';
    doc += '2. Review foreign key constraints\n';
    doc += '3. Consider data migration impact\n';
    doc += '4. Update Mermaid diagram after changes\n\n';

    doc += '### Query Optimization Tips:\n';
    doc += '1. Use indexes on frequently queried fields\n';
    doc += '2. Avoid N+1 queries on relationships\n';
    doc += '3. Consider database-specific optimizations\n\n';

    return doc;
  }

  async handleUpdateSchema(args) {
    const { project_path } = args;

    // Re-scan database using previous settings
    const settingsPath = join(project_path, '.db-sync-settings.json');

    if (!existsSync(settingsPath)) {
      throw new Error('No previous scan settings found. Run scan_database first.');
    }

    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));

    return await this.handleScanDatabase({
      project_path,
      db_type: settings.db_type,
      connection_string: settings.connection_string,
    });
  }

  async handleCompareSchemas(args) {
    const { project_path } = args;

    const currentSchemaPath = join(project_path, 'docs/database-schema.md');
    const previousSchemaPath = join(project_path, 'docs/.database-schema.previous.md');

    if (!existsSync(currentSchemaPath)) {
      throw new Error('No current schema found. Run scan_database first.');
    }

    if (!existsSync(previousSchemaPath)) {
      return {
        content: [
          {
            type: 'text',
            text: 'No previous schema found for comparison.',
          },
        ],
      };
    }

    const current = readFileSync(currentSchemaPath, 'utf-8');
    const previous = readFileSync(previousSchemaPath, 'utf-8');

    // Simple diff (in production, use proper diff library)
    const changes = current !== previous ? 'Schema has changed' : 'No changes detected';

    return {
      content: [
        {
          type: 'text',
          text: `Schema Comparison:\n\n${changes}`,
        },
      ],
    };
  }

  async handleGenerateSQL(args) {
    const { project_path, target_db, output_file } = args;

    try {
      // Parse Prisma schema
      const schema = await this.scanPrismaSchema(project_path);

      // Generate SQL based on target database
      let sql;
      switch (target_db) {
        case 'mysql':
          sql = this.generateMySQLSchema(schema);
          break;
        case 'postgresql':
          sql = this.generatePostgreSQLSchema(schema);
          break;
        case 'sqlite':
          sql = this.generateSQLiteSchema(schema);
          break;
        default:
          throw new Error(`Unsupported database type: ${target_db}`);
      }

      // Save SQL file
      const sqlFilePath = output_file || join(project_path, `schema-${target_db}.sql`);
      writeFileSync(sqlFilePath, sql, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: `✅ SQL schema generated successfully!\n\n` +
                  `📊 Database: ${target_db}\n` +
                  `📄 File: ${sqlFilePath}\n` +
                  `📝 Tables: ${schema.tables.length}\n\n` +
                  `Preview:\n\`\`\`sql\n${sql.split('\n').slice(0, 20).join('\n')}\n...\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error generating SQL: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleCreateDatabase(args) {
    const { sql_file, connection_string, db_type } = args;

    try {
      if (!existsSync(sql_file)) {
        throw new Error(`SQL file not found: ${sql_file}`);
      }

      const sql = readFileSync(sql_file, 'utf-8');

      // Execute SQL based on database type
      switch (db_type) {
        case 'mysql':
          await this.executeMySQLScript(connection_string, sql);
          break;
        case 'postgresql':
          await this.executePostgreSQLScript(connection_string, sql);
          break;
        case 'sqlite':
          await this.executeSQLiteScript(connection_string, sql);
          break;
        default:
          throw new Error(`Unsupported database type: ${db_type}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ Database created successfully!\n\n` +
                  `🗄️ Database: ${db_type}\n` +
                  `📄 SQL file: ${sql_file}\n` +
                  `🔗 Connection: ${connection_string.replace(/:[^:]*@/, ':****@')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error creating database: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  generateMySQLSchema(schema) {
    const { tables, relationships } = schema;
    let sql = `-- MySQL Schema Generated from Prisma\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

    // Create tables
    for (const table of tables) {
      sql += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;

      const fieldDefinitions = [];
      const primaryKeys = [];
      const uniqueKeys = [];

      for (const field of table.fields) {
        let fieldDef = `  \`${field.name}\` ${this.prismaTypeToMySQL(field.type)}`;

        if (!field.nullable && !field.isPrimaryKey) {
          fieldDef += ' NOT NULL';
        }

        if (field.isPrimaryKey) {
          fieldDef += ' AUTO_INCREMENT';
          primaryKeys.push(field.name);
        }

        if (field.isUnique && !field.isPrimaryKey) {
          uniqueKeys.push(field.name);
        }

        fieldDefinitions.push(fieldDef);
      }

      sql += fieldDefinitions.join(',\n');

      if (primaryKeys.length > 0) {
        sql += `,\n  PRIMARY KEY (\`${primaryKeys.join('`, `')}\`)`;
      }

      if (uniqueKeys.length > 0) {
        for (const key of uniqueKeys) {
          sql += `,\n  UNIQUE KEY \`${key}_unique\` (\`${key}\`)`;
        }
      }

      sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';
    }

    // Add foreign keys
    for (const rel of relationships) {
      sql += `ALTER TABLE \`${rel.from}\`\n`;
      sql += `  ADD CONSTRAINT \`fk_${rel.from}_${rel.fromField}\`\n`;
      sql += `  FOREIGN KEY (\`${rel.fromField}\`) REFERENCES \`${rel.to}\`(\`${rel.toField}\`)\n`;
      sql += `  ON DELETE CASCADE ON UPDATE CASCADE;\n\n`;
    }

    return sql;
  }

  generatePostgreSQLSchema(schema) {
    const { tables, relationships } = schema;
    let sql = `-- PostgreSQL Schema Generated from Prisma\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

    // Create tables
    for (const table of tables) {
      sql += `CREATE TABLE IF NOT EXISTS "${table.name}" (\n`;

      const fieldDefinitions = [];

      for (const field of table.fields) {
        let fieldDef = `  "${field.name}" ${this.prismaTypeToPostgreSQL(field.type)}`;

        if (!field.nullable && !field.isPrimaryKey) {
          fieldDef += ' NOT NULL';
        }

        if (field.isPrimaryKey) {
          fieldDef += ' PRIMARY KEY';
        }

        if (field.isUnique && !field.isPrimaryKey) {
          fieldDef += ' UNIQUE';
        }

        fieldDefinitions.push(fieldDef);
      }

      sql += fieldDefinitions.join(',\n');
      sql += '\n);\n\n';
    }

    // Add foreign keys
    for (const rel of relationships) {
      sql += `ALTER TABLE "${rel.from}"\n`;
      sql += `  ADD CONSTRAINT "fk_${rel.from}_${rel.fromField}"\n`;
      sql += `  FOREIGN KEY ("${rel.fromField}") REFERENCES "${rel.to}"("${rel.toField}")\n`;
      sql += `  ON DELETE CASCADE ON UPDATE CASCADE;\n\n`;
    }

    // Create indexes
    for (const table of tables) {
      for (const field of table.fields) {
        if (field.isForeignKey && !field.isPrimaryKey) {
          sql += `CREATE INDEX IF NOT EXISTS "idx_${table.name}_${field.name}"\n`;
          sql += `  ON "${table.name}" ("${field.name}");\n\n`;
        }
      }
    }

    return sql;
  }

  generateSQLiteSchema(schema) {
    const { tables, relationships } = schema;
    let sql = `-- SQLite Schema Generated from Prisma\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

    sql += `PRAGMA foreign_keys = ON;\n\n`;

    // Create tables
    for (const table of tables) {
      sql += `CREATE TABLE IF NOT EXISTS "${table.name}" (\n`;

      const fieldDefinitions = [];

      for (const field of table.fields) {
        let fieldDef = `  "${field.name}" ${this.prismaTypeToSQLite(field.type)}`;

        if (field.isPrimaryKey) {
          fieldDef += ' PRIMARY KEY AUTOINCREMENT';
        }

        if (!field.nullable && !field.isPrimaryKey) {
          fieldDef += ' NOT NULL';
        }

        if (field.isUnique && !field.isPrimaryKey) {
          fieldDef += ' UNIQUE';
        }

        fieldDefinitions.push(fieldDef);
      }

      // Add foreign keys inline for SQLite
      for (const rel of relationships) {
        if (rel.from === table.name) {
          const fkField = table.fields.find(f => f.name === rel.fromField);
          if (fkField) {
            const fkIndex = fieldDefinitions.findIndex(def => def.includes(`"${rel.fromField}"`));
            if (fkIndex !== -1) {
              fieldDefinitions[fkIndex] += ` REFERENCES "${rel.to}"("${rel.toField}") ON DELETE CASCADE ON UPDATE CASCADE`;
            }
          }
        }
      }

      sql += fieldDefinitions.join(',\n');
      sql += '\n);\n\n';
    }

    // Create indexes
    for (const table of tables) {
      for (const field of table.fields) {
        if (field.isForeignKey && !field.isPrimaryKey) {
          sql += `CREATE INDEX IF NOT EXISTS "idx_${table.name}_${field.name}"\n`;
          sql += `  ON "${table.name}" ("${field.name}");\n\n`;
        }
      }
    }

    return sql;
  }

  prismaTypeToMySQL(type) {
    const typeMap = {
      'String': 'VARCHAR(255)',
      'Int': 'INT',
      'BigInt': 'BIGINT',
      'Float': 'DOUBLE',
      'Decimal': 'DECIMAL(10,2)',
      'Boolean': 'TINYINT(1)',
      'DateTime': 'DATETIME',
      'Json': 'JSON',
      'Bytes': 'BLOB',
    };
    return typeMap[type] || 'TEXT';
  }

  prismaTypeToPostgreSQL(type) {
    const typeMap = {
      'String': 'VARCHAR(255)',
      'Int': 'INTEGER',
      'BigInt': 'BIGINT',
      'Float': 'DOUBLE PRECISION',
      'Decimal': 'DECIMAL(10,2)',
      'Boolean': 'BOOLEAN',
      'DateTime': 'TIMESTAMP',
      'Json': 'JSONB',
      'Bytes': 'BYTEA',
    };
    return typeMap[type] || 'TEXT';
  }

  prismaTypeToSQLite(type) {
    const typeMap = {
      'String': 'TEXT',
      'Int': 'INTEGER',
      'BigInt': 'INTEGER',
      'Float': 'REAL',
      'Decimal': 'REAL',
      'Boolean': 'INTEGER',
      'DateTime': 'TEXT',
      'Json': 'TEXT',
      'Bytes': 'BLOB',
    };
    return typeMap[type] || 'TEXT';
  }

  async executeMySQLScript(connectionString, sql) {
    // Import mysql2 dynamically
    const mysql = await import('mysql2/promise');

    const connection = await mysql.createConnection(connectionString);

    try {
      // Split SQL into individual statements
      const statements = sql.split(';').filter(s => s.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }
    } finally {
      await connection.end();
    }
  }

  async executePostgreSQLScript(connectionString, sql) {
    // Import pg dynamically
    const { Client } = await import('pg');

    const client = new Client({ connectionString });
    await client.connect();

    try {
      await client.query(sql);
    } finally {
      await client.end();
    }
  }

  async executeSQLiteScript(dbPath, sql) {
    // Import better-sqlite3 dynamically
    const Database = (await import('better-sqlite3')).default;

    const db = new Database(dbPath);

    try {
      db.exec(sql);
    } finally {
      db.close();
    }
  }

  generateDatabaseAnalysisPrompt(projectPath) {
    const schemaPath = join(projectPath, 'docs/database-schema.md');
    const contextPath = join(projectPath, 'docs/database-context.md');

    let prompt = `Analyze database schema và đưa ra recommendations:\n\n`;

    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, 'utf-8');
      prompt += `## Current Schema\n\n${schema}\n\n`;
    }

    if (existsSync(contextPath)) {
      const context = readFileSync(contextPath, 'utf-8');
      prompt += `## Context\n\n${context}\n\n`;
    }

    prompt += `## Analysis Tasks\n\n`;
    prompt += `1. Review table structure và relationships\n`;
    prompt += `2. Identify missing indexes\n`;
    prompt += `3. Check for normalization issues\n`;
    prompt += `4. Suggest performance improvements\n`;
    prompt += `5. Review naming conventions\n\n`;

    prompt += `Output bằng Tiếng Việt với:\n`;
    prompt += `- ✅ Điểm tốt\n`;
    prompt += `- ⚠️  Vấn đề cần chú ý\n`;
    prompt += `- 🔧 Recommendations\n`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt,
          },
        },
      ],
    };
  }

  generateMigrationPlanningPrompt(projectPath) {
    const schemaPath = join(projectPath, 'docs/database-schema.md');

    let prompt = `Plan database migration dựa trên schema changes:\n\n`;

    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, 'utf-8');
      prompt += `## Current Schema\n\n${schema}\n\n`;
    }

    prompt += `## Migration Planning\n\n`;
    prompt += `1. Identify schema changes needed\n`;
    prompt += `2. Plan migration steps\n`;
    prompt += `3. Consider data migration\n`;
    prompt += `4. Create rollback plan\n`;
    prompt += `5. Generate migration scripts\n\n`;

    prompt += `Output Prisma migration hoặc SQL migration scripts.`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt,
          },
        },
      ],
    };
  }

  generateQueryOptimizationPrompt(projectPath) {
    const contextPath = join(projectPath, 'docs/database-context.md');

    let prompt = `Suggest query optimizations dựa trên database schema:\n\n`;

    if (existsSync(contextPath)) {
      const context = readFileSync(contextPath, 'utf-8');
      prompt += `## Database Context\n\n${context}\n\n`;
    }

    prompt += `## Optimization Tasks\n\n`;
    prompt += `1. Review common query patterns\n`;
    prompt += `2. Suggest indexes\n`;
    prompt += `3. Identify N+1 query risks\n`;
    prompt += `4. Recommend caching strategies\n`;
    prompt += `5. Database-specific optimizations\n\n`;

    prompt += `Provide specific SQL/Prisma query examples.`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt,
          },
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('DB Context Sync MCP Server running on stdio');
  }
}

const server = new DBContextSyncServer();
server.run().catch(console.error);
