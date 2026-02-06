#!/usr/bin/env node

/**
 * Remote Sync Checker - PreToolUse Hook
 *
 * Proactively checks for remote changes at session start.
 * Warns about:
 * 1. Commits on remote not pulled locally
 * 2. Dependency file changes (pubspec.yaml, package.json, etc.)
 * 3. Breaking changes in commit messages
 * 4. Branch divergence
 *
 * Usage: PreToolUse hook - runs once per session on first tool use
 *
 * Exit Codes:
 *   0 - Success (always allows operation)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const cacheDir = path.join(projectDir, '.claude/cache');
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Execute git command safely
 */
function git(command, silent = false) {
  try {
    return execSync(`git ${command}`, {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: silent ? ['pipe', 'pipe', 'ignore'] : ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Check if we should run (throttle to once per TTL)
 */
function shouldRun() {
  const cacheFile = path.join(cacheDir, 'remote-sync-last-check.json');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const lastCheck = new Date(data.timestamp).getTime();
      if (Date.now() - lastCheck < CACHE_TTL) {
        return false; // Skip, checked recently
      }
    } catch {
      // Corrupted cache, proceed
    }
  }

  return true;
}

/**
 * Mark as checked
 */
function markChecked(result) {
  const cacheFile = path.join(cacheDir, 'remote-sync-last-check.json');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  fs.writeFileSync(cacheFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    result
  }, null, 2), 'utf-8');
}

/**
 * Fetch latest from remote
 */
function fetchRemote() {
  return git('fetch --quiet', true) !== null;
}

/**
 * Get current branch
 */
function getCurrentBranch() {
  return git('rev-parse --abbrev-ref HEAD');
}

/**
 * Get remote tracking branch
 */
function getRemoteBranch(localBranch) {
  const remote = git(`config --get branch.${localBranch}.remote`);
  if (!remote) return `origin/${localBranch}`;
  return `${remote}/${localBranch}`;
}

/**
 * Check commits behind remote
 */
function getCommitsBehind(localBranch, remoteBranch) {
  const count = git(`rev-list --count ${localBranch}..${remoteBranch} 2>/dev/null`);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Check commits ahead of remote
 */
function getCommitsAhead(localBranch, remoteBranch) {
  const count = git(`rev-list --count ${remoteBranch}..${localBranch} 2>/dev/null`);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Get recent remote commits not in local
 */
function getRemoteCommits(localBranch, remoteBranch, limit = 10) {
  const log = git(`log ${localBranch}..${remoteBranch} --oneline --no-decorate -n ${limit} 2>/dev/null`);
  if (!log) return [];
  return log.split('\n').filter(Boolean).map(line => {
    const [hash, ...messageParts] = line.split(' ');
    return { hash, message: messageParts.join(' ') };
  });
}

/**
 * Check if dependency files changed on remote
 */
function checkDependencyChanges(localBranch, remoteBranch) {
  const depFiles = [
    'pubspec.yaml',
    'pubspec.lock',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'requirements.txt',
    'Pipfile.lock',
    'Gemfile.lock',
    'go.mod',
    'go.sum',
    'Cargo.lock'
  ];

  const changedFiles = git(`diff --name-only ${localBranch}..${remoteBranch} 2>/dev/null`);
  if (!changedFiles) return [];

  const changed = changedFiles.split('\n');
  return depFiles.filter(f => changed.includes(f));
}

/**
 * Check for breaking changes in remote commits
 */
function checkBreakingChanges(commits) {
  const breakingPatterns = [
    /breaking/i,
    /BREAKING/,
    /!:/,
    /major\s*change/i,
    /incompatible/i,
    /removed\s+api/i,
    /deprecated/i
  ];

  return commits.filter(c =>
    breakingPatterns.some(p => p.test(c.message))
  );
}

/**
 * Get files changed on remote affecting common paths
 */
function getHighImpactChanges(localBranch, remoteBranch) {
  const highImpactPaths = [
    'lib/core/',
    'lib/shared/',
    'src/core/',
    'src/shared/',
    'src/common/',
    'packages/core/',
    'config/',
    '.env',
    'database/',
    'migrations/'
  ];

  const changedFiles = git(`diff --name-only ${localBranch}..${remoteBranch} 2>/dev/null`);
  if (!changedFiles) return [];

  const changed = changedFiles.split('\n');
  const impacted = [];

  for (const file of changed) {
    for (const pattern of highImpactPaths) {
      if (file.startsWith(pattern) || file.includes(pattern)) {
        impacted.push(file);
        break;
      }
    }
  }

  return impacted;
}

/**
 * Build sync report
 */
function buildSyncReport(data) {
  const {
    behind,
    ahead,
    commits,
    depChanges,
    breakingChanges,
    highImpactChanges,
    localBranch,
    remoteBranch
  } = data;

  if (behind === 0 && depChanges.length === 0 && breakingChanges.length === 0) {
    return null; // No issues
  }

  let report = `\n📡 [REMOTE-SYNC] Remote changes detected!\n`;
  report += `   Branch: ${localBranch} ← ${remoteBranch}\n\n`;

  // Sync status
  if (behind > 0 || ahead > 0) {
    report += `📊 **Sync Status**:\n`;
    if (behind > 0) report += `   ↓ ${behind} commit(s) behind remote\n`;
    if (ahead > 0) report += `   ↑ ${ahead} commit(s) ahead of remote\n`;
    report += '\n';
  }

  // Breaking changes (highest priority)
  if (breakingChanges.length > 0) {
    report += `⛔ **BREAKING CHANGES on remote**:\n`;
    for (const c of breakingChanges) {
      report += `   • ${c.hash}: ${c.message}\n`;
    }
    report += '\n';
  }

  // Dependency changes
  if (depChanges.length > 0) {
    report += `📦 **Dependency files changed**:\n`;
    for (const f of depChanges) {
      report += `   • ${f}\n`;
    }
    report += `   → Run appropriate install command after pulling\n\n`;
  }

  // High impact changes
  if (highImpactChanges.length > 0) {
    report += `⚠️ **Core/shared code changed**:\n`;
    for (const f of highImpactChanges.slice(0, 5)) {
      report += `   • ${f}\n`;
    }
    if (highImpactChanges.length > 5) {
      report += `   • ... and ${highImpactChanges.length - 5} more\n`;
    }
    report += '\n';
  }

  // Recent commits
  if (commits.length > 0 && behind > 0) {
    report += `📝 **Recent remote commits**:\n`;
    for (const c of commits.slice(0, 5)) {
      report += `   • ${c.hash}: ${c.message}\n`;
    }
    if (commits.length > 5) {
      report += `   • ... and ${commits.length - 5} more\n`;
    }
    report += '\n';
  }

  // Recommendations
  report += `📋 **Recommended actions**:\n`;
  if (behind > 0) {
    report += `   1. git pull origin ${localBranch}\n`;
  }
  if (depChanges.length > 0) {
    const installCmd = getInstallCommand(depChanges);
    if (installCmd) {
      report += `   2. ${installCmd}\n`;
    }
  }
  report += `   3. Review changes before coding\n`;
  report += `   4. Run /sync for full team context\n`;

  return report;
}

/**
 * Get appropriate install command based on dependency files
 */
function getInstallCommand(depFiles) {
  if (depFiles.some(f => f.includes('pubspec'))) return 'flutter pub get';
  if (depFiles.some(f => f.includes('package'))) {
    if (depFiles.includes('yarn.lock')) return 'yarn install';
    if (depFiles.includes('pnpm-lock.yaml')) return 'pnpm install';
    return 'npm install';
  }
  if (depFiles.some(f => f.includes('requirements'))) return 'pip install -r requirements.txt';
  if (depFiles.some(f => f.includes('Gemfile'))) return 'bundle install';
  if (depFiles.some(f => f.includes('go.'))) return 'go mod download';
  if (depFiles.some(f => f.includes('Cargo'))) return 'cargo build';
  return null;
}

/**
 * Main execution
 */
function main() {
  try {
    // Check if we should run (throttled)
    if (!shouldRun()) {
      process.exit(0);
    }

    // Read stdin (hook payload)
    let input = '';
    try {
      input = fs.readFileSync(0, 'utf-8').trim();
    } catch {
      // No stdin
    }

    // Verify this is a git repo
    const isGitRepo = git('rev-parse --is-inside-work-tree', true);
    if (isGitRepo !== 'true') {
      markChecked({ skipped: 'not-git-repo' });
      process.exit(0);
    }

    // Fetch remote
    fetchRemote();

    // Get branch info
    const localBranch = getCurrentBranch();
    if (!localBranch) {
      markChecked({ skipped: 'no-branch' });
      process.exit(0);
    }

    const remoteBranch = getRemoteBranch(localBranch);

    // Check if remote branch exists
    const remoteExists = git(`rev-parse --verify ${remoteBranch} 2>/dev/null`, true);
    if (!remoteExists) {
      markChecked({ skipped: 'no-remote-branch' });
      process.exit(0);
    }

    // Gather sync data
    const behind = getCommitsBehind(localBranch, remoteBranch);
    const ahead = getCommitsAhead(localBranch, remoteBranch);
    const commits = getRemoteCommits(localBranch, remoteBranch);
    const depChanges = checkDependencyChanges(localBranch, remoteBranch);
    const breakingChanges = checkBreakingChanges(commits);
    const highImpactChanges = getHighImpactChanges(localBranch, remoteBranch);

    // Build and output report
    const report = buildSyncReport({
      behind,
      ahead,
      commits,
      depChanges,
      breakingChanges,
      highImpactChanges,
      localBranch,
      remoteBranch
    });

    if (report) {
      console.log(report);
    }

    // Cache result
    markChecked({
      behind,
      ahead,
      depChanges: depChanges.length,
      breakingChanges: breakingChanges.length
    });

    process.exit(0);
  } catch (error) {
    // Fail-open
    console.error(`[REMOTE-SYNC] Error: ${error.message}`);
    process.exit(0);
  }
}

// Export for testing
module.exports = {
  fetchRemote,
  getCurrentBranch,
  getCommitsBehind,
  getCommitsAhead,
  checkDependencyChanges,
  checkBreakingChanges,
  getHighImpactChanges
};

if (require.main === module) {
  main();
}
