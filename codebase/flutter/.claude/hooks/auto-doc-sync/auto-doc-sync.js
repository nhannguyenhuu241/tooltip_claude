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

// Check if running from Git hook (no stdin) or PostToolUse (has stdin)
let isGitHookMode = false;
let data = null;

// Try to read stdin (PostToolUse mode)
try {
  const stat = fs.fstatSync(0);
  if (stat.size > 0) {
    const hookInput = fs.readFileSync(0, 'utf-8');
    data = JSON.parse(hookInput);

    // Check if this is a git operation
    const isGitOperation = data.tool_name === 'Bash' &&
      data.tool_input?.command?.match(/git\s+(commit|push|pull|merge)/);

    if (!isGitOperation) {
      process.exit(0); // Allow non-git operations
    }
  } else {
    // No stdin input = Git hook mode
    isGitHookMode = true;
  }
} catch (error) {
  // No stdin = Git hook mode
  isGitHookMode = true;
}

// Get project directory
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const configPath = path.join(projectDir, '.claude/hooks/auto-doc-sync/config.json');

// Configuration
const config = {
  changesFile: path.join(projectDir, 'CHANGES.md'),
  moduleDocsDir: path.join(projectDir, 'docs/modules'),
  contextFile: path.join(projectDir, 'docs/CONTEXT.md'),
  maxChangesEntries: 50,
  moduleRules: loadModuleRules()
};

/**
 * Load module detection rules from config.json
 */
function loadModuleRules() {
  try {
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (Array.isArray(data.modules) && data.modules.length > 0) {
        return data.modules;
      }
    }
  } catch (error) {
    // Config parse error — fall back to default rules
  }
  return [];
}

/**
 * Match file path against a glob-style pattern
 * Supports ** (any depth) and * (single segment)
 */
function matchesPattern(filePath, pattern) {
  const regexStr = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{GLOBSTAR}}/g, '.*');
  return new RegExp(`^${regexStr}$`).test(filePath);
}

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
 * Get current branch name
 */
function getCurrentBranch() {
  return exec('git rev-parse --abbrev-ref HEAD') || 'unknown';
}

/**
 * Get branch name for a specific commit
 */
function getBranchForCommit(hash) {
  // Try to get branch from commit
  const branches = exec(`git branch --contains ${hash} 2>/dev/null`);
  if (branches) {
    const lines = branches.split('\n');
    for (const line of lines) {
      if (line.includes('*')) {
        return line.replace('*', '').trim();
      }
    }
    return lines[0]?.trim() || getCurrentBranch();
  }
  return getCurrentBranch();
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
        branch: getBranchForCommit(hash),
        files: [],
        modules: new Set()
      };
      commits.push(currentCommit);
    } else if (line.trim() && currentCommit) {
      // File change line: M\tpath/to/file
      const match = line.match(/^([AMD])\s+(.+)$/);
      if (match) {
        const [, status, file] = match;
        currentCommit.files.push({ status, file });
        // Detect module for this file
        const module = detectFlutterModule(file);
        currentCommit.modules.add(module);
      }
    }
  });

  // Convert Set to Array
  commits.forEach(commit => {
    commit.modules = Array.from(commit.modules);
  });

  return commits;
}

/**
 * Detect Flutter module from file path
 * Checks custom rules from config.json first, then falls back to Flutter defaults
 */
function detectFlutterModule(filePath) {
  // Check custom rules first
  for (const rule of config.moduleRules) {
    if (matchesPattern(filePath, rule.pattern)) {
      return rule.name;
    }
  }

  // Fallback: default Flutter detection logic
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

  // Extract existing commit hashes to avoid duplicates
  const existingHashes = new Set();
  const hashRegex = /- \*\*([a-f0-9]{7})\*\*/g;
  let match;
  while ((match = hashRegex.exec(content)) !== null) {
    existingHashes.add(match[1]);
  }

  // Filter out commits that already exist
  const newCommits = commits.filter(commit => !existingHashes.has(commit.hash));

  // If no new commits, skip update
  if (newCommits.length === 0) {
    console.log('✓ No new commits to add to CHANGES.md');
    return;
  }

  // Generate new entries
  let newEntries = '';

  // Check if today's section already exists
  const todayHeader = `## ${now}`;
  const hasTodaySection = content.includes(todayHeader);

  if (!hasTodaySection) {
    newEntries += `${todayHeader}\n\n`;
  }

  newCommits.forEach(commit => {
    // Header line with hash, author, time
    newEntries += `- **${commit.hash}** by ${commit.author} (${commit.time})\n`;

    // Branch info
    if (commit.branch) {
      newEntries += `  📌 Branch: \`${commit.branch}\`\n`;
    }

    // Commit message
    newEntries += `  ${commit.message}\n`;

    // Modules affected
    if (commit.modules && commit.modules.length > 0) {
      newEntries += `  📦 Modules: ${commit.modules.map(m => `\`${m}\``).join(', ')}\n`;
    }

    // Check for dependency file changes
    const dependencyFiles = commit.files.filter(f =>
      f.file.endsWith('pubspec.yaml') ||
      f.file.endsWith('package.json') ||
      f.file.endsWith('requirements.txt') ||
      f.file.endsWith('Gemfile') ||
      f.file.endsWith('go.mod')
    );

    if (dependencyFiles.length > 0) {
      // Detect which package manager
      let installCommand = '';
      if (dependencyFiles.some(f => f.file.endsWith('pubspec.yaml'))) {
        installCommand = 'flutter pub get';
      } else if (dependencyFiles.some(f => f.file.endsWith('package.json'))) {
        installCommand = 'npm install';
      } else if (dependencyFiles.some(f => f.file.endsWith('requirements.txt'))) {
        installCommand = 'pip install -r requirements.txt';
      } else if (dependencyFiles.some(f => f.file.endsWith('Gemfile'))) {
        installCommand = 'bundle install';
      } else if (dependencyFiles.some(f => f.file.endsWith('go.mod'))) {
        installCommand = 'go mod download';
      }

      newEntries += `  ⚠️  **Dependencies updated** - Run: \`${installCommand}\`\n`;
    }

    // Files changed
    if (commit.files.length > 0) {
      newEntries += `  Files: ${commit.files.map(f => f.file).join(', ')}\n`;
    }
    newEntries += '\n';
  });

  // Insert new entries
  let updatedContent;
  if (hasTodaySection) {
    // Insert after today's header
    const todayHeaderIndex = content.indexOf(todayHeader);
    const insertPosition = content.indexOf('\n\n', todayHeaderIndex) + 2;
    updatedContent = content.slice(0, insertPosition) +
                     newEntries +
                     content.slice(insertPosition);
  } else {
    // Insert after main header
    const headerEnd = content.indexOf('\n\n') + 2;
    updatedContent = content.slice(0, headerEnd) +
                     newEntries +
                     content.slice(headerEnd);
  }

  // Write back
  fs.writeFileSync(config.changesFile, updatedContent, 'utf8');

  console.log(`✓ Updated ${config.changesFile} with ${newCommits.length} new commit(s)`);
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

    // Extract existing commit hashes to avoid duplicates
    const existingHashes = new Set();
    const hashRegex = /\(([a-f0-9]{7})\)/g;
    let match;
    while ((match = hashRegex.exec(content)) !== null) {
      existingHashes.add(match[1]);
    }

    // Filter out commits that already exist
    const newCommits = changes.commits.filter(commit => !existingHashes.has(commit.hash));

    // If no new commits for this module, skip update
    if (newCommits.length === 0) {
      console.log(`✓ No new commits to add to ${moduleDocPath}`);
      return;
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

    newCommits.forEach(commit => {
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
    console.log(`✓ Updated ${moduleDocPath} with ${newCommits.length} new commit(s)`);
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

  const now = new Date().toISOString();

  // Build comprehensive context
  let contextContent = `# Construction Project Context

**Auto-generated AI Context** - Last updated: ${now}

> This file provides comprehensive context for AI assistants working on this codebase.
> It tracks what changed, why, and what impacts those changes have.

---

## 🎯 Recent Changes Summary (Last 24h)

`;

  // Detect change types
  const changeTypes = {
    features: [],
    fixes: [],
    refactors: [],
    breaking: [],
    dependencies: [],
    docs: [],
    tests: [],
    other: []
  };

  commits.forEach(commit => {
    const msg = commit.message.toLowerCase();
    const entry = {
      hash: commit.hash,
      message: commit.message,
      modules: Array.from(commit.modules),
      branch: commit.branch
    };

    if (msg.includes('breaking') || msg.includes('!:')) {
      changeTypes.breaking.push(entry);
    } else if (msg.startsWith('feat')) {
      changeTypes.features.push(entry);
    } else if (msg.startsWith('fix')) {
      changeTypes.fixes.push(entry);
    } else if (msg.startsWith('refactor')) {
      changeTypes.refactors.push(entry);
    } else if (msg.includes('pubspec') || msg.includes('package.json') || msg.includes('dependencies')) {
      changeTypes.dependencies.push(entry);
    } else if (msg.startsWith('docs')) {
      changeTypes.docs.push(entry);
    } else if (msg.startsWith('test')) {
      changeTypes.tests.push(entry);
    } else {
      changeTypes.other.push(entry);
    }
  });

  // Breaking Changes (highest priority)
  if (changeTypes.breaking.length > 0) {
    contextContent += `### ⚠️ BREAKING CHANGES (${changeTypes.breaking.length})\n\n`;
    contextContent += `**IMPORTANT**: These changes may break existing code!\n\n`;
    changeTypes.breaking.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
      contextContent += `  - Modules: ${change.modules.join(', ')}\n`;
      contextContent += `  - Branch: ${change.branch}\n\n`;
    });
  }

  // New Features
  if (changeTypes.features.length > 0) {
    contextContent += `### ✨ New Features (${changeTypes.features.length})\n\n`;
    changeTypes.features.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
      if (change.modules.length > 0) {
        contextContent += `  - Affects: ${change.modules.join(', ')}\n`;
      }
    });
    contextContent += '\n';
  }

  // Bug Fixes
  if (changeTypes.fixes.length > 0) {
    contextContent += `### 🐛 Bug Fixes (${changeTypes.fixes.length})\n\n`;
    changeTypes.fixes.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
      if (change.modules.length > 0) {
        contextContent += `  - Fixed in: ${change.modules.join(', ')}\n`;
      }
    });
    contextContent += '\n';
  }

  // Dependency Updates
  if (changeTypes.dependencies.length > 0) {
    contextContent += `### 📦 Dependencies Updated (${changeTypes.dependencies.length})\n\n`;
    contextContent += `**Action Required**: Run dependency installation after pulling these changes.\n\n`;
    changeTypes.dependencies.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
    });
    contextContent += '\n';
  }

  // Refactoring
  if (changeTypes.refactors.length > 0) {
    contextContent += `### 🔨 Code Refactoring (${changeTypes.refactors.length})\n\n`;
    changeTypes.refactors.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
      if (change.modules.length > 0) {
        contextContent += `  - Modules: ${change.modules.join(', ')}\n`;
      }
    });
    contextContent += '\n';
  }

  // Module Activity Analysis
  contextContent += `---

## 📊 Module Activity Analysis

`;

  Object.keys(moduleChanges).forEach(moduleName => {
    const module = moduleChanges[moduleName];
    contextContent += `### ${moduleName}\n\n`;
    contextContent += `- **${module.commits.length} commit(s)** in last 24h\n`;
    contextContent += `- **${module.files.length} file(s)** changed\n`;

    // Add clickable warning to check updated module docs
    contextContent += `- ⚠️  **Updated**: Check [${moduleName}.md](../modules/${moduleName}.md) for latest changes\n\n`;

    // Show recent changes for this module
    contextContent += `**Recent changes:**\n`;
    module.commits.slice(0, 3).forEach(commit => {
      contextContent += `- ${commit.message} (${commit.hash})\n`;
    });

    if (module.files.length > 0) {
      contextContent += `\n**Key files modified:**\n`;
      module.files.slice(0, 5).forEach(file => {
        contextContent += `- ${file}\n`;
      });
      if (module.files.length > 5) {
        contextContent += `- ... and ${module.files.length - 5} more\n`;
      }
    }
    contextContent += '\n';
  });

  // AI Context Section
  contextContent += `---

## 🤖 AI Context & Recommendations

### What AI Should Know:

`;

  // Detect patterns
  const totalChanges = commits.length;
  const hotspots = Object.entries(moduleChanges)
    .sort((a, b) => b[1].commits.length - a[1].commits.length)
    .slice(0, 3);

  contextContent += `1. **Activity Level**: ${totalChanges} commit(s) in last 24h\n`;

  if (hotspots.length > 0) {
    contextContent += `2. **Most Active Modules**:\n`;
    hotspots.forEach(([module, data]) => {
      contextContent += `   - \`${module}\`: ${data.commits.length} commits - **High activity, coordinate before changes**\n`;
    });
  }

  if (changeTypes.breaking.length > 0) {
    contextContent += `3. **Breaking Changes Present**: Review migration guides before implementing features\n`;
  }

  if (changeTypes.dependencies.length > 0) {
    contextContent += `4. **Dependencies Changed**: Ensure all packages are up-to-date before coding\n`;
  }

  contextContent += `
### Current Codebase State:

- **Architecture**: Flutter with Provider pattern
- **State Management**: Provider-based
- **Theme System**: Custom theme with AppColors, AppTextStyles
- **Localization**: Multi-language support (en, vi, zh)
- **Modules**: Modular architecture with core + feature modules

### Before You Code:

1. Check recent changes in modules you'll modify
2. Review breaking changes if any
3. Update dependencies if needed
4. Read module-specific docs in \`docs/modules/\`
5. Coordinate with team on highly active modules

---

## 📚 Quick Links

- [CHANGES.md](../../CHANGES.md) - Full changelog
- [Module Docs](../modules/) - Per-module documentation
- [Theme System](../context/libs/theme-system.md) - Theme guide
- [Provider Pattern](../context/libs/provider-pattern.md) - State management

---

*Auto-generated by auto-doc-sync hook. Do not edit manually.*
`;

  fs.writeFileSync(contextPath, contextContent, 'utf8');
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
