#!/usr/bin/env node

/**
 * Auto Documentation Sync Hook - Flutter Edition
 *
 * Tự động cập nhật documentation khi có git changes:
 * - Phát hiện git operations (commit, pull, merge)
 * - Phân tích changes theo Flutter modules
 * - Cập nhật CHANGES.md
 * - Cập nhật module docs
 * - Notify team
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Read hook input
let hookInput;
try {
  hookInput = fs.readFileSync(0, 'utf-8');
} catch (error) {
  console.error('ERROR: Cannot read hook input');
  process.exit(2);
}

// Parse input
let data;
try {
  data = JSON.parse(hookInput);
} catch (error) {
  console.error('ERROR: Invalid JSON input');
  process.exit(2);
}

// Check if this is a git operation
const isGitOperation = data.tool_name === 'Bash' &&
  data.tool_input?.command?.match(/git\s+(commit|push|pull|merge)/);

if (!isGitOperation) {
  process.exit(0); // Allow non-git operations
}

// Get project directory
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

// Configuration
const config = {
  changesFile: path.join(projectDir, 'CHANGES.md'),
  moduleDocsDir: path.join(projectDir, 'docs/modules'),
  contextFile: path.join(projectDir, 'docs/CONTEXT.md'),
  maxChangesEntries: 50
};

/**
 * Execute shell command safely
 */
function exec(command) {
  try {
    return execSync(command, {
      cwd: projectDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
  } catch (error) {
    return '';
  }
}

/**
 * Get recent git changes
 */
function getRecentChanges() {
  const since = '24 hours ago';
  const changes = exec(`git log --since="${since}" --pretty=format:"%h|%an|%ar|%s" --name-status`);

  if (!changes) return null;

  const commits = [];
  const lines = changes.split('\n');
  let currentCommit = null;

  lines.forEach(line => {
    if (line.includes('|')) {
      // Commit line: hash|author|time|message
      const [hash, author, time, message] = line.split('|');
      currentCommit = {
        hash,
        author,
        time,
        message,
        files: []
      };
      commits.push(currentCommit);
    } else if (line.trim() && currentCommit) {
      // File change line: M\tpath/to/file
      const match = line.match(/^([AMD])\s+(.+)$/);
      if (match) {
        const [, status, file] = match;
        currentCommit.files.push({ status, file });
      }
    }
  });

  return commits;
}

/**
 * Detect Flutter module from file path
 */
function detectFlutterModule(filePath) {
  // lib/core/* → core module
  if (filePath.startsWith('lib/core/')) {
    const parts = filePath.split('/');
    if (parts.length >= 3) {
      return `core-${parts[2]}`; // core/theme → core-theme
    }
    return 'core';
  }

  // lib/features/presentation/splash_module → splash
  if (filePath.includes('/features/presentation/')) {
    const match = filePath.match(/presentation\/([^/]+)_module/);
    if (match) return match[1];
  }

  // lib/features/widgets/* → widgets
  if (filePath.includes('/features/widgets/')) {
    return 'widgets';
  }

  // lib/l10n/* → localization
  if (filePath.startsWith('lib/l10n/')) {
    return 'localization';
  }

  // pubspec.yaml → dependencies
  if (filePath === 'pubspec.yaml') {
    return 'dependencies';
  }

  // test/* → tests
  if (filePath.startsWith('test/')) {
    return 'tests';
  }

  return 'other';
}

/**
 * Analyze changes and categorize by module
 */
function analyzeChanges(commits) {
  const moduleChanges = {};

  commits.forEach(commit => {
    commit.files.forEach(({ status, file }) => {
      const moduleName = detectFlutterModule(file);

      if (!moduleChanges[moduleName]) {
        moduleChanges[moduleName] = {
          commits: [],
          files: new Set()
        };
      }

      moduleChanges[moduleName].commits.push({
        hash: commit.hash,
        author: commit.author,
        message: commit.message
      });

      moduleChanges[moduleName].files.add(file);
    });
  });

  // Convert Set to Array
  Object.keys(moduleChanges).forEach(module => {
    moduleChanges[module].files = Array.from(moduleChanges[module].files);
  });

  return moduleChanges;
}

/**
 * Update CHANGES.md
 */
function updateChangesFile(commits) {
  const now = new Date().toISOString().split('T')[0];

  // Read existing CHANGES.md
  let content = '';
  if (fs.existsSync(config.changesFile)) {
    content = fs.readFileSync(config.changesFile, 'utf8');
  } else {
    content = '# Changes Log\n\nTrack all changes to the Construction Project codebase.\n\n';
  }

  // Generate new entries
  let newEntries = `## ${now}\n\n`;

  commits.forEach(commit => {
    newEntries += `- **${commit.hash}** by ${commit.author} (${commit.time})\n`;
    newEntries += `  ${commit.message}\n`;

    if (commit.files.length > 0) {
      newEntries += `  Files: ${commit.files.map(f => f.file).join(', ')}\n`;
    }
    newEntries += '\n';
  });

  // Insert new entries after header
  const headerEnd = content.indexOf('\n\n') + 2;
  const updatedContent = content.slice(0, headerEnd) +
                         newEntries +
                         content.slice(headerEnd);

  // Write back
  fs.writeFileSync(config.changesFile, updatedContent, 'utf8');

  console.log(`✓ Updated ${config.changesFile}`);
}

/**
 * Update module documentation
 */
function updateModuleDocs(moduleChanges) {
  // Ensure docs/modules directory exists
  if (!fs.existsSync(config.moduleDocsDir)) {
    fs.mkdirSync(config.moduleDocsDir, { recursive: true });
  }

  Object.keys(moduleChanges).forEach(moduleName => {
    const moduleDocPath = path.join(config.moduleDocsDir, `${moduleName}.md`);
    const changes = moduleChanges[moduleName];

    // Read or create module doc
    let content = '';
    if (fs.existsSync(moduleDocPath)) {
      content = fs.readFileSync(moduleDocPath, 'utf8');
    } else {
      content = `# ${moduleName} Module\n\n## Overview\n\nFlutter module for ${moduleName}.\n\n## Recent Changes\n\n`;
    }

    // Find "Recent Changes" section
    const changesHeader = '## Recent Changes';
    let changesIndex = content.indexOf(changesHeader);

    if (changesIndex === -1) {
      content += `\n${changesHeader}\n\n`;
      changesIndex = content.indexOf(changesHeader);
    }

    // Generate new changes entry
    const now = new Date().toISOString().split('T')[0];
    let newChanges = `### ${now}\n\n`;

    changes.commits.forEach(commit => {
      newChanges += `- ${commit.message} (${commit.hash}) by ${commit.author}\n`;
    });

    newChanges += `\nAffected files:\n`;
    changes.files.forEach(file => {
      newChanges += `- ${file}\n`;
    });
    newChanges += '\n';

    // Insert new changes
    const insertPosition = changesIndex + changesHeader.length + 2;
    const updatedContent = content.slice(0, insertPosition) +
                          newChanges +
                          content.slice(insertPosition);

    fs.writeFileSync(moduleDocPath, updatedContent, 'utf8');
    console.log(`✓ Updated ${moduleDocPath}`);
  });
}

/**
 * Update CONTEXT.md with team activity summary
 */
function updateContext(commits, moduleChanges) {
  const contextPath = config.contextFile;
  const contextDir = path.dirname(contextPath);

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  let content = '';
  if (fs.existsSync(contextPath)) {
    content = fs.readFileSync(contextPath, 'utf8');
  } else {
    content = `# Construction Project Context\n\nAuto-generated context for team synchronization.\n\n## Current State\n\nLast updated: ${new Date().toISOString()}\n\n`;
  }

  // Update "Last updated" timestamp
  content = content.replace(
    /Last updated: .+/,
    `Last updated: ${new Date().toISOString()}`
  );

  // Add summary section if not exists
  if (!content.includes('## Recent Activity Summary')) {
    content += '\n## Recent Activity Summary\n\n';
  }

  // Generate summary
  const summary = `### Last 24 Hours\n\n`;
  const moduleList = Object.keys(moduleChanges).map(module => {
    const count = moduleChanges[module].commits.length;
    return `- **${module}**: ${count} commit(s)`;
  }).join('\n');

  content = content.replace(
    /## Recent Activity Summary[\s\S]*?(?=\n## |$)/,
    `## Recent Activity Summary\n\n${summary}${moduleList}\n\n`
  );

  fs.writeFileSync(contextPath, content, 'utf8');
  console.log(`✓ Updated ${contextPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Auto-Doc-Sync (Flutter): Analyzing recent changes...');

  // Get recent changes
  const commits = getRecentChanges();

  if (!commits || commits.length === 0) {
    console.log('No recent changes to document.');
    process.exit(0);
  }

  console.log(`Found ${commits.length} commit(s) in last 24 hours`);

  // Analyze changes by module
  const moduleChanges = analyzeChanges(commits);
  console.log(`Affected modules: ${Object.keys(moduleChanges).join(', ')}`);

  // Update documentation files
  try {
    updateChangesFile(commits);
    updateModuleDocs(moduleChanges);
    updateContext(commits, moduleChanges);

    console.log('✅ Documentation updated successfully!');
    console.log('');
    console.log('📝 Updated files:');
    console.log(`   - ${config.changesFile}`);
    console.log(`   - ${config.contextFile}`);
    console.log(`   - docs/modules/*.md`);

  } catch (error) {
    console.error('❌ Error updating docs:', error.message);
  }

  process.exit(0);
}

main();
