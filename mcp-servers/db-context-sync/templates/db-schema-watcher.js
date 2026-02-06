#!/usr/bin/env node

/**
 * DB Schema Watcher - PostToolUse Hook
 *
 * Automatically detects database schema changes and triggers re-sync:
 * 1. After Prisma migration commands (prisma migrate, prisma db push)
 * 2. After schema.prisma file edits
 * 3. After SQL migration file changes
 *
 * Usage: PostToolUse hook for Bash|Edit|Write tools
 *
 * Exit Codes:
 *   0 - Success (always allows operation to continue)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const cacheDir = path.join(projectDir, '.claude/cache');
const docsDir = path.join(projectDir, 'docs');

// Migration command patterns to detect
const MIGRATION_PATTERNS = [
  /prisma\s+migrate\s+(dev|deploy|reset|resolve)/i,
  /prisma\s+db\s+(push|pull|seed)/i,
  /npx\s+prisma\s+migrate/i,
  /yarn\s+prisma\s+migrate/i,
  /pnpm\s+prisma\s+migrate/i,
  /sequelize\s+db:migrate/i,
  /typeorm\s+migration:run/i,
  /knex\s+migrate/i,
  /flask\s+db\s+(upgrade|migrate)/i,
  /alembic\s+upgrade/i,
  /rails\s+db:migrate/i,
  /diesel\s+migration\s+run/i,
];

// Schema file patterns
const SCHEMA_FILE_PATTERNS = [
  /schema\.prisma$/,
  /prisma\/schema\.prisma$/,
  /models\.py$/,           // Django
  /entity\.ts$/,           // TypeORM
  /\.entity\.ts$/,
  /migrations\/.*\.sql$/,
  /migrations\/.*\.ts$/,
  /migrations\/.*\.js$/,
];

/**
 * Ensure cache directory exists
 */
function ensureCacheDir() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

/**
 * Get hash of schema file for change detection
 */
function getSchemaHash() {
  const schemaPath = path.join(projectDir, 'prisma/schema.prisma');
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    return crypto.createHash('md5').update(content).digest('hex');
  }
  return null;
}

/**
 * Get last known schema hash from cache
 */
function getLastSchemaHash() {
  const cacheFile = path.join(cacheDir, 'schema-hash.json');
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      return data.hash;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Save current schema hash to cache
 */
function saveSchemaHash(hash) {
  ensureCacheDir();
  const cacheFile = path.join(cacheDir, 'schema-hash.json');
  fs.writeFileSync(cacheFile, JSON.stringify({
    hash,
    timestamp: new Date().toISOString()
  }, null, 2), 'utf-8');
}

/**
 * Check if command is a migration command
 */
function isMigrationCommand(command) {
  return MIGRATION_PATTERNS.some(pattern => pattern.test(command));
}

/**
 * Check if file is a schema file
 */
function isSchemaFile(filePath) {
  const relativePath = path.relative(projectDir, filePath);
  return SCHEMA_FILE_PATTERNS.some(pattern => pattern.test(relativePath));
}

/**
 * Get migration count from prisma/migrations
 */
function getMigrationCount() {
  const migrationsDir = path.join(projectDir, 'prisma/migrations');
  if (!fs.existsSync(migrationsDir)) return 0;

  return fs.readdirSync(migrationsDir)
    .filter(f => fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .length;
}

/**
 * Get latest migration info
 */
function getLatestMigration() {
  const migrationsDir = path.join(projectDir, 'prisma/migrations');
  if (!fs.existsSync(migrationsDir)) return null;

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .sort()
    .reverse();

  if (migrations.length === 0) return null;

  const latest = migrations[0];
  const sqlPath = path.join(migrationsDir, latest, 'migration.sql');

  return {
    name: latest,
    date: latest.split('_')[0],
    hasSql: fs.existsSync(sqlPath),
    sqlPreview: fs.existsSync(sqlPath)
      ? fs.readFileSync(sqlPath, 'utf-8').slice(0, 500)
      : null
  };
}

/**
 * Parse Prisma schema and extract summary
 */
function parseSchemaQuick() {
  const schemaPath = path.join(projectDir, 'prisma/schema.prisma');
  if (!fs.existsSync(schemaPath)) return null;

  const content = fs.readFileSync(schemaPath, 'utf-8');

  // Count models
  const modelMatches = content.match(/model\s+\w+\s*{/g) || [];
  const enumMatches = content.match(/enum\s+\w+\s*{/g) || [];

  // Extract model names
  const modelNames = modelMatches.map(m => m.match(/model\s+(\w+)/)[1]);

  return {
    modelCount: modelMatches.length,
    enumCount: enumMatches.length,
    models: modelNames
  };
}

/**
 * Update database context docs
 */
function updateDatabaseDocs() {
  ensureCacheDir();

  const schemaInfo = parseSchemaQuick();
  if (!schemaInfo) return;

  const migrationCount = getMigrationCount();
  const latestMigration = getLatestMigration();
  const currentHash = getSchemaHash();

  // Update context file with quick info
  const contextPath = path.join(docsDir, 'database-context.md');

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  let contextDoc = `# Database Context

**Auto-updated by db-schema-watcher**
Last updated: ${new Date().toISOString()}

## Quick Summary

- **Models**: ${schemaInfo.modelCount} (${schemaInfo.models.join(', ')})
- **Enums**: ${schemaInfo.enumCount}
- **Migrations**: ${migrationCount}
- **Schema Hash**: \`${currentHash?.slice(0, 8)}...\`

`;

  if (latestMigration) {
    contextDoc += `## Latest Migration

- **Name**: \`${latestMigration.name}\`
- **Date**: ${latestMigration.date}

`;

    if (latestMigration.sqlPreview) {
      contextDoc += `**SQL Preview**:
\`\`\`sql
${latestMigration.sqlPreview}${latestMigration.sqlPreview.length >= 500 ? '\n...' : ''}
\`\`\`

`;
    }
  }

  contextDoc += `## AI Recommendations

### Before Database Changes:
1. Check current schema in \`prisma/schema.prisma\`
2. Review existing migrations in \`prisma/migrations/\`
3. Consider data migration impact

### After Running Migration:
1. Schema docs auto-updated ✅
2. Run \`/db-sync\` for full ERD refresh
3. Update related code if needed

---
*Auto-generated by db-schema-watcher hook*
`;

  fs.writeFileSync(contextPath, contextDoc, 'utf-8');

  // Save current hash
  saveSchemaHash(currentHash);

  return {
    models: schemaInfo.modelCount,
    migrations: migrationCount,
    latest: latestMigration?.name
  };
}

/**
 * Generate notification message
 */
function generateNotification(trigger, updateResult) {
  let msg = `\n📊 [DB-SCHEMA-WATCHER] Database context updated!\n`;
  msg += `   Trigger: ${trigger}\n`;

  if (updateResult) {
    msg += `   Models: ${updateResult.models}\n`;
    msg += `   Migrations: ${updateResult.migrations}\n`;
    if (updateResult.latest) {
      msg += `   Latest: ${updateResult.latest}\n`;
    }
  }

  msg += `   Updated: docs/database-context.md\n`;
  msg += `\n   💡 Run \`scan_database\` for full ERD regeneration\n`;

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
    const toolResult = payload.tool_result;

    let shouldUpdate = false;
    let trigger = '';

    // Check 1: Migration command in Bash
    if (toolName === 'Bash') {
      const command = toolInput.command || '';
      if (isMigrationCommand(command)) {
        // Only update if command succeeded
        if (!toolResult?.includes('Error') && !toolResult?.includes('error')) {
          shouldUpdate = true;
          trigger = `Migration command: ${command.slice(0, 50)}...`;
        }
      }
    }

    // Check 2: Schema file edited
    if (['Edit', 'Write'].includes(toolName)) {
      const filePath = toolInput.file_path || toolInput.path || '';
      if (isSchemaFile(filePath)) {
        shouldUpdate = true;
        trigger = `Schema file changed: ${path.basename(filePath)}`;
      }
    }

    // Check 3: Schema hash changed (regardless of tool)
    const currentHash = getSchemaHash();
    const lastHash = getLastSchemaHash();
    if (currentHash && lastHash && currentHash !== lastHash) {
      shouldUpdate = true;
      trigger = trigger || 'Schema content changed';
    }

    if (shouldUpdate) {
      const result = updateDatabaseDocs();
      console.log(generateNotification(trigger, result));
    }

    process.exit(0);
  } catch (error) {
    console.error(`[DB-SCHEMA-WATCHER] Error: ${error.message}`);
    process.exit(0);
  }
}

// Export for testing
module.exports = {
  isMigrationCommand,
  isSchemaFile,
  parseSchemaQuick,
  getLatestMigration,
  updateDatabaseDocs
};

if (require.main === module) {
  main();
}
