#!/usr/bin/env node

/**
 * Auto Documentation Sync Hook - Generic Edition
 *
 * Works with any Git project. Detects modules based on directory structure.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

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
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // escape regex chars (except * and ?)
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
      const match = line.match(/^([AMD])\s+(.+)$/);
      if (match) {
        const [, status, file] = match;
        currentCommit.files.push({ status, file });
        const module = detectModule(file);
        currentCommit.modules.add(module);
      }
    }
  });

  commits.forEach(commit => {
    commit.modules = Array.from(commit.modules);
  });

  return commits;
}

/**
 * Detect module from file path
 * Checks custom rules from config.json first, then falls back to defaults
 */
function detectModule(filePath) {
  // Check custom rules first
  for (const rule of config.moduleRules) {
    if (matchesPattern(filePath, rule.pattern)) {
      return rule.name;
    }
  }

  // Fallback: default detection logic
  // src/module-name/* → module-name
  if (filePath.startsWith('src/')) {
    const parts = filePath.split('/');
    if (parts.length >= 2) {
      return parts[1];
    }
  }

  // lib/module-name/* → module-name
  if (filePath.startsWith('lib/')) {
    const parts = filePath.split('/');
    if (parts.length >= 2) {
      return parts[1];
    }
  }

  // packages/module-name/* → module-name
  if (filePath.startsWith('packages/')) {
    const parts = filePath.split('/');
    if (parts.length >= 2) {
      return parts[1];
    }
  }

  // Dependency files
  if (filePath === 'package.json' ||
      filePath === 'pubspec.yaml' ||
      filePath === 'requirements.txt' ||
      filePath === 'Gemfile' ||
      filePath === 'go.mod') {
    return 'dependencies';
  }

  // Test files
  if (filePath.startsWith('test/') || filePath.startsWith('tests/') || filePath.includes('__tests__')) {
    return 'tests';
  }

  // Docs
  if (filePath.startsWith('docs/')) {
    return 'docs';
  }

  // Config files
  if (filePath.includes('.config.') || filePath.endsWith('.config.js') || filePath.endsWith('.config.ts')) {
    return 'config';
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
      const moduleName = detectModule(file);

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

  Object.keys(moduleChanges).forEach(module => {
    moduleChanges[module].files = Array.from(moduleChanges[module].files);
  });

  return moduleChanges;
}

/**
 * Update CHANGES.md with deduplication
 */
function updateChangesFile(commits) {
  const now = new Date().toISOString().split('T')[0];

  let content = '';
  if (fs.existsSync(config.changesFile)) {
    content = fs.readFileSync(config.changesFile, 'utf8');
  } else {
    content = '# Changes Log\n\nTrack all changes to the project codebase.\n\n';
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

  if (newCommits.length === 0) {
    console.log('✓ No new commits to add to CHANGES.md');
    return;
  }

  let newEntries = '';
  const todayHeader = `## ${now}`;
  const hasTodaySection = content.includes(todayHeader);

  if (!hasTodaySection) {
    newEntries += `${todayHeader}\n\n`;
  }

  newCommits.forEach(commit => {
    newEntries += `- **${commit.hash}** by ${commit.author} (${commit.time})\n`;

    if (commit.branch) {
      newEntries += `  📌 Branch: \`${commit.branch}\`\n`;
    }

    newEntries += `  ${commit.message}\n`;

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

    if (commit.files.length > 0) {
      newEntries += `  Files: ${commit.files.map(f => f.file).join(', ')}\n`;
    }
    newEntries += '\n';
  });

  let updatedContent;
  if (hasTodaySection) {
    const todayHeaderIndex = content.indexOf(todayHeader);
    const insertPosition = content.indexOf('\n\n', todayHeaderIndex) + 2;
    updatedContent = content.slice(0, insertPosition) +
                     newEntries +
                     content.slice(insertPosition);
  } else {
    const headerEnd = content.indexOf('\n\n') + 2;
    updatedContent = content.slice(0, headerEnd) +
                     newEntries +
                     content.slice(headerEnd);
  }

  fs.writeFileSync(config.changesFile, updatedContent, 'utf8');
  console.log(`✓ Updated ${config.changesFile} with ${newCommits.length} new commit(s)`);
}

/**
 * Update module documentation with deduplication
 */
function updateModuleDocs(moduleChanges) {
  if (!fs.existsSync(config.moduleDocsDir)) {
    fs.mkdirSync(config.moduleDocsDir, { recursive: true });
  }

  Object.keys(moduleChanges).forEach(moduleName => {
    const moduleDocPath = path.join(config.moduleDocsDir, `${moduleName}.md`);
    const changes = moduleChanges[moduleName];

    let content = '';
    if (fs.existsSync(moduleDocPath)) {
      content = fs.readFileSync(moduleDocPath, 'utf8');
    } else {
      content = `# ${moduleName} Module\n\n## Overview\n\nModule for ${moduleName}.\n\n## Recent Changes\n\n`;
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

    if (newCommits.length === 0) {
      console.log(`✓ No new commits to add to ${moduleDocPath}`);
      return;
    }

    const changesHeader = '## Recent Changes';
    let changesIndex = content.indexOf(changesHeader);

    if (changesIndex === -1) {
      content += `\n${changesHeader}\n\n`;
      changesIndex = content.indexOf(changesHeader);
    }

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

    const insertPosition = changesIndex + changesHeader.length + 2;
    const updatedContent = content.slice(0, insertPosition) +
                          newChanges +
                          content.slice(insertPosition);

    fs.writeFileSync(moduleDocPath, updatedContent, 'utf8');
    console.log(`✓ Updated ${moduleDocPath} with ${newCommits.length} new commit(s)`);
  });
}

/**
 * Update CONTEXT.md with comprehensive AI context
 */
function updateContext(commits, moduleChanges) {
  const contextPath = config.contextFile;
  const contextDir = path.dirname(contextPath);

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  const now = new Date().toISOString();

  let contextContent = `# Project Context

**Auto-generated AI Context** - Last updated: ${now}

> This file provides comprehensive context for AI assistants working on this codebase.
> It tracks what changed, why, and what impacts those changes have.

---

## 🎯 Recent Changes Summary (Last 24h)

`;

  // Categorize commits by type
  const changeTypes = {
    features: [], fixes: [], refactors: [],
    breaking: [], dependencies: [], docs: [], tests: [], other: []
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

  // Add categorized changes to context
  if (changeTypes.breaking.length > 0) {
    contextContent += `### ⚠️ BREAKING CHANGES (${changeTypes.breaking.length})\n\n`;
    contextContent += `**IMPORTANT**: These changes may break existing code!\n\n`;
    changeTypes.breaking.forEach(change => {
      contextContent += `- **${change.hash}**: ${change.message}\n`;
      contextContent += `  - Modules: ${change.modules.join(', ')}\n\n`;
    });
  }

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

  // Module Activity Analysis
  contextContent += `---

## 📊 Module Activity Analysis

`;

  Object.keys(moduleChanges).forEach(moduleName => {
    const module = moduleChanges[moduleName];
    contextContent += `### ${moduleName}\n\n`;
    contextContent += `- **${module.commits.length} commit(s)** in last 24h\n`;
    contextContent += `- **${module.files.length} file(s)** changed\n`;
    contextContent += `- ⚠️  **Updated**: Check [${moduleName}.md](../modules/${moduleName}.md) for latest changes\n\n`;

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

  // AI Recommendations
  contextContent += `---

## 🤖 AI Context & Recommendations

### What AI Should Know:

1. **Activity Level**: ${commits.length} commit(s) in last 24h
2. **Most Active Modules**:
`;

  const hotspots = Object.entries(moduleChanges)
    .sort((a, b) => b[1].commits.length - a[1].commits.length)
    .slice(0, 3);

  hotspots.forEach(([module, data]) => {
    contextContent += `   - \`${module}\`: ${data.commits.length} commits - **High activity, coordinate before changes**\n`;
  });

  contextContent += `
### Before You Code:

1. Check recent changes in modules you'll modify
2. Review breaking changes if any
3. Update dependencies if needed
4. Read module-specific docs in \`docs/modules/\`
5. Coordinate with team on highly active modules

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
  console.log('🔄 Auto-Doc-Sync: Analyzing recent changes...');

  const commits = getRecentChanges();

  if (!commits || commits.length === 0) {
    console.log('No recent changes to document.');
    process.exit(0);
  }

  console.log(`Found ${commits.length} commit(s) in last 24 hours`);

  const moduleChanges = analyzeChanges(commits);
  console.log(`Affected modules: ${Object.keys(moduleChanges).join(', ')}`);

  try {
    updateChangesFile(commits);
    updateModuleDocs(moduleChanges);
    updateContext(commits, moduleChanges);

    console.log('✅ Documentation updated successfully!');
  } catch (error) {
    console.error('❌ Error updating docs:', error.message);
  }

  process.exit(0);
}

main();
