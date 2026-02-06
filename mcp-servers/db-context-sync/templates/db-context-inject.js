#!/usr/bin/env node

/**
 * DB Context Inject - PreToolUse Hook
 *
 * Automatically injects database context when Claude is working with:
 * 1. Database-related code (Prisma, queries, repositories)
 * 2. Migration files
 * 3. Model/Entity definitions
 *
 * Prevents Claude from missing database context and making incorrect assumptions.
 *
 * Usage: PreToolUse hook for Edit|Write|Bash tools
 *
 * Exit Codes:
 *   0 - Success (always allows operation)
 */

const fs = require('fs');
const path = require('path');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const cacheDir = path.join(projectDir, '.claude/cache');
const docsDir = path.join(projectDir, 'docs');

const INJECT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes - don't re-inject too often
const MARKER = '[DB-CONTEXT-INJECT]';

// Keywords that trigger context injection
const DB_KEYWORDS = [
  // Prisma
  'prisma', 'findmany', 'findunique', 'findfirst', 'create', 'createmany',
  'update', 'updatemany', 'delete', 'deletemany', 'upsert', 'aggregate',
  'groupby', '@relation', '@id', '@unique', '@default',

  // General DB
  'repository', 'entity', 'model', 'schema', 'migration', 'database',
  'query', 'select', 'insert', 'where', 'join', 'foreign key',

  // ORM/DB libraries
  'typeorm', 'sequelize', 'knex', 'mongoose', 'sqlalchemy', 'activerecord',

  // SQL
  'create table', 'alter table', 'drop table', 'add column', 'index',
];

// File patterns that should trigger injection
const DB_FILE_PATTERNS = [
  /\.repository\.(ts|js)$/,
  /\.entity\.(ts|js)$/,
  /\.model\.(ts|js)$/,
  /repository\//,
  /entities\//,
  /models\//,
  /prisma\//,
  /migrations\//,
  /schema\.prisma$/,
  /\.migration\.(ts|js|sql)$/,
];

/**
 * Check if we should inject context based on tool input
 */
function shouldInjectContext(toolName, toolInput) {
  // Check file path patterns
  const filePath = toolInput.file_path || toolInput.path || '';
  if (filePath) {
    const relativePath = path.relative(projectDir, filePath).toLowerCase();
    if (DB_FILE_PATTERNS.some(p => p.test(relativePath))) {
      return { inject: true, reason: `DB file: ${path.basename(filePath)}` };
    }
  }

  // Check command for Bash
  if (toolName === 'Bash') {
    const command = (toolInput.command || '').toLowerCase();
    if (DB_KEYWORDS.some(k => command.includes(k.toLowerCase()))) {
      return { inject: true, reason: 'DB command detected' };
    }
  }

  // Check content for Edit
  if (toolName === 'Edit') {
    const oldString = (toolInput.old_string || '').toLowerCase();
    const newString = (toolInput.new_string || '').toLowerCase();
    const content = oldString + ' ' + newString;

    if (DB_KEYWORDS.some(k => content.includes(k.toLowerCase()))) {
      return { inject: true, reason: 'DB code modification' };
    }
  }

  // Check content for Write
  if (toolName === 'Write') {
    const content = (toolInput.content || '').toLowerCase();
    const keywordCount = DB_KEYWORDS.filter(k => content.includes(k.toLowerCase())).length;

    // Only inject if multiple DB keywords found (avoid false positives)
    if (keywordCount >= 2) {
      return { inject: true, reason: 'DB code creation' };
    }
  }

  return { inject: false };
}

/**
 * Check if we recently injected context
 */
function wasRecentlyInjected() {
  const cacheFile = path.join(cacheDir, 'db-context-inject-last.json');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const lastInject = new Date(data.timestamp).getTime();
      if (Date.now() - lastInject < INJECT_CACHE_TTL) {
        return true;
      }
    } catch {
      // Corrupted cache
    }
  }

  return false;
}

/**
 * Mark context as injected
 */
function markInjected() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cacheFile = path.join(cacheDir, 'db-context-inject-last.json');
  fs.writeFileSync(cacheFile, JSON.stringify({
    timestamp: new Date().toISOString()
  }, null, 2), 'utf-8');
}

/**
 * Get database schema summary
 */
function getSchemaContext() {
  const schemaPath = path.join(projectDir, 'prisma/schema.prisma');

  if (!fs.existsSync(schemaPath)) {
    return null;
  }

  const content = fs.readFileSync(schemaPath, 'utf-8');

  // Extract models with their fields
  const models = [];
  const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;
  let match;

  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    const fieldsContent = match[2];

    // Extract field names and types
    const fields = [];
    const fieldLines = fieldsContent.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));

    for (const line of fieldLines) {
      const fieldMatch = line.match(/^\s*(\w+)\s+(\w+)(\?|\[\])?\s*/);
      if (fieldMatch) {
        const [, name, type, modifier] = fieldMatch;
        const isOptional = modifier === '?';
        const isArray = modifier === '[]';
        const isPK = line.includes('@id');
        const isFK = line.includes('@relation');
        const isUnique = line.includes('@unique');

        let fieldStr = `${name}: ${type}`;
        if (isArray) fieldStr += '[]';
        if (isOptional) fieldStr += '?';
        if (isPK) fieldStr += ' [PK]';
        if (isFK) fieldStr += ' [FK]';
        if (isUnique) fieldStr += ' [UNIQUE]';

        fields.push(fieldStr);
      }
    }

    models.push({ name: modelName, fields });
  }

  // Extract enums
  const enums = [];
  const enumRegex = /enum\s+(\w+)\s*{([^}]+)}/g;
  while ((match = enumRegex.exec(content)) !== null) {
    const enumName = match[1];
    const values = match[2].split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('//'));
    enums.push({ name: enumName, values });
  }

  return { models, enums };
}

/**
 * Get recent migrations
 */
function getRecentMigrations(limit = 3) {
  const migrationsDir = path.join(projectDir, 'prisma/migrations');
  if (!fs.existsSync(migrationsDir)) return [];

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .sort()
    .reverse()
    .slice(0, limit);

  return migrations.map(m => {
    const sqlPath = path.join(migrationsDir, m, 'migration.sql');
    return {
      name: m,
      hasSql: fs.existsSync(sqlPath)
    };
  });
}

/**
 * Build context injection message
 */
function buildContextMessage(reason) {
  const schema = getSchemaContext();
  const migrations = getRecentMigrations();

  if (!schema) {
    return null;
  }

  let msg = `\n📊 ${MARKER} Database Context (auto-injected)\n`;
  msg += `   Reason: ${reason}\n\n`;

  // Models summary (compact)
  msg += `## Models (${schema.models.length})\n\n`;
  for (const model of schema.models) {
    msg += `### ${model.name}\n`;
    msg += `${model.fields.slice(0, 8).join(', ')}`;
    if (model.fields.length > 8) {
      msg += `, ... (+${model.fields.length - 8} more)`;
    }
    msg += '\n\n';
  }

  // Enums
  if (schema.enums.length > 0) {
    msg += `## Enums (${schema.enums.length})\n`;
    for (const e of schema.enums) {
      msg += `- ${e.name}: ${e.values.slice(0, 5).join(', ')}`;
      if (e.values.length > 5) msg += `, ...`;
      msg += '\n';
    }
    msg += '\n';
  }

  // Recent migrations
  if (migrations.length > 0) {
    msg += `## Recent Migrations\n`;
    for (const m of migrations) {
      msg += `- ${m.name}\n`;
    }
    msg += '\n';
  }

  // Tips
  msg += `## Quick Tips\n`;
  msg += `- Full schema: \`prisma/schema.prisma\`\n`;
  msg += `- ERD diagram: \`docs/database-schema.md\`\n`;
  msg += `- After schema changes: Run \`prisma migrate dev\`\n`;

  return msg;
}

/**
 * Main hook execution
 */
function main() {
  try {
    let input = '';
    try {
      input = fs.readFileSync(0, 'utf-8').trim();
    } catch {
      process.exit(0);
    }

    if (!input) {
      process.exit(0);
    }

    const payload = JSON.parse(input);
    const toolName = payload.tool_name;
    const toolInput = payload.tool_input || {};

    // Check if should inject
    const { inject, reason } = shouldInjectContext(toolName, toolInput);

    if (!inject) {
      process.exit(0);
    }

    // Check if recently injected (avoid spam)
    if (wasRecentlyInjected()) {
      process.exit(0);
    }

    // Build and output context
    const contextMsg = buildContextMessage(reason);
    if (contextMsg) {
      console.log(contextMsg);
      markInjected();
    }

    process.exit(0);
  } catch (error) {
    console.error(`[DB-CONTEXT-INJECT] Error: ${error.message}`);
    process.exit(0);
  }
}

// Export for testing
module.exports = {
  shouldInjectContext,
  getSchemaContext,
  buildContextMessage
};

if (require.main === module) {
  main();
}
