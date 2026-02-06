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
        return false;
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

function fetchRemote() {
  return git('fetch --quiet', true) !== null;
}

function getCurrentBranch() {
  return git('rev-parse --abbrev-ref HEAD');
}

function getRemoteBranch(localBranch) {
  const remote = git(`config --get branch.${localBranch}.remote`);
  if (!remote) return `origin/${localBranch}`;
  return `${remote}/${localBranch}`;
}

function getCommitsBehind(localBranch, remoteBranch) {
  const count = git(`rev-list --count ${localBranch}..${remoteBranch} 2>/dev/null`);
  return count ? parseInt(count, 10) : 0;
}

function getCommitsAhead(localBranch, remoteBranch) {
  const count = git(`rev-list --count ${remoteBranch}..${localBranch} 2>/dev/null`);
  return count ? parseInt(count, 10) : 0;
}

function getRemoteCommits(localBranch, remoteBranch, limit = 10) {
  const log = git(`log ${localBranch}..${remoteBranch} --oneline --no-decorate -n ${limit} 2>/dev/null`);
  if (!log) return [];
  return log.split('\n').filter(Boolean).map(line => {
    const [hash, ...messageParts] = line.split(' ');
    return { hash, message: messageParts.join(' ') };
  });
}

function checkDependencyChanges(localBranch, remoteBranch) {
  const depFiles = [
    'pubspec.yaml', 'pubspec.lock', 'package.json', 'package-lock.json',
    'yarn.lock', 'pnpm-lock.yaml', 'requirements.txt', 'Pipfile.lock',
    'Gemfile.lock', 'go.mod', 'go.sum', 'Cargo.lock'
  ];

  const changedFiles = git(`diff --name-only ${localBranch}..${remoteBranch} 2>/dev/null`);
  if (!changedFiles) return [];

  const changed = changedFiles.split('\n');
  return depFiles.filter(f => changed.includes(f));
}

function checkBreakingChanges(commits) {
  const breakingPatterns = [/breaking/i, /BREAKING/, /!:/, /major\s*change/i, /incompatible/i];
  return commits.filter(c => breakingPatterns.some(p => p.test(c.message)));
}

function getHighImpactChanges(localBranch, remoteBranch) {
  const highImpactPaths = ['lib/core/', 'lib/shared/', 'src/core/', 'config/', '.env'];
  const changedFiles = git(`diff --name-only ${localBranch}..${remoteBranch} 2>/dev/null`);
  if (!changedFiles) return [];

  const changed = changedFiles.split('\n');
  return changed.filter(file => highImpactPaths.some(p => file.startsWith(p) || file.includes(p)));
}

function getInstallCommand(depFiles) {
  if (depFiles.some(f => f.includes('pubspec'))) return 'flutter pub get';
  if (depFiles.some(f => f.includes('package'))) return 'npm install';
  if (depFiles.some(f => f.includes('requirements'))) return 'pip install -r requirements.txt';
  return null;
}

function buildSyncReport(data) {
  const { behind, ahead, commits, depChanges, breakingChanges, highImpactChanges, localBranch, remoteBranch } = data;

  if (behind === 0 && depChanges.length === 0 && breakingChanges.length === 0) {
    return null;
  }

  let report = `\n📡 [REMOTE-SYNC] Remote changes detected!\n`;
  report += `   Branch: ${localBranch} ← ${remoteBranch}\n\n`;

  if (behind > 0 || ahead > 0) {
    report += `📊 **Sync Status**:\n`;
    if (behind > 0) report += `   ↓ ${behind} commit(s) behind remote\n`;
    if (ahead > 0) report += `   ↑ ${ahead} commit(s) ahead of remote\n`;
    report += '\n';
  }

  if (breakingChanges.length > 0) {
    report += `⛔ **BREAKING CHANGES on remote**:\n`;
    for (const c of breakingChanges) {
      report += `   • ${c.hash}: ${c.message}\n`;
    }
    report += '\n';
  }

  if (depChanges.length > 0) {
    report += `📦 **Dependency files changed**:\n`;
    for (const f of depChanges) {
      report += `   • ${f}\n`;
    }
    report += `   → Run appropriate install command after pulling\n\n`;
  }

  if (highImpactChanges.length > 0) {
    report += `⚠️ **Core/shared code changed**:\n`;
    for (const f of highImpactChanges.slice(0, 5)) {
      report += `   • ${f}\n`;
    }
    report += '\n';
  }

  if (commits.length > 0 && behind > 0) {
    report += `📝 **Recent remote commits**:\n`;
    for (const c of commits.slice(0, 5)) {
      report += `   • ${c.hash}: ${c.message}\n`;
    }
    report += '\n';
  }

  report += `📋 **Recommended actions**:\n`;
  if (behind > 0) report += `   1. git pull origin ${localBranch}\n`;
  if (depChanges.length > 0) {
    const cmd = getInstallCommand(depChanges);
    if (cmd) report += `   2. ${cmd}\n`;
  }
  report += `   3. Review changes before coding\n`;
  report += `   4. Run /sync for full team context\n`;

  return report;
}

function main() {
  try {
    if (!shouldRun()) {
      process.exit(0);
    }

    const isGitRepo = git('rev-parse --is-inside-work-tree', true);
    if (isGitRepo !== 'true') {
      markChecked({ skipped: 'not-git-repo' });
      process.exit(0);
    }

    fetchRemote();

    const localBranch = getCurrentBranch();
    if (!localBranch) {
      markChecked({ skipped: 'no-branch' });
      process.exit(0);
    }

    const remoteBranch = getRemoteBranch(localBranch);
    const remoteExists = git(`rev-parse --verify ${remoteBranch} 2>/dev/null`, true);
    if (!remoteExists) {
      markChecked({ skipped: 'no-remote-branch' });
      process.exit(0);
    }

    const behind = getCommitsBehind(localBranch, remoteBranch);
    const ahead = getCommitsAhead(localBranch, remoteBranch);
    const commits = getRemoteCommits(localBranch, remoteBranch);
    const depChanges = checkDependencyChanges(localBranch, remoteBranch);
    const breakingChanges = checkBreakingChanges(commits);
    const highImpactChanges = getHighImpactChanges(localBranch, remoteBranch);

    const report = buildSyncReport({
      behind, ahead, commits, depChanges, breakingChanges, highImpactChanges, localBranch, remoteBranch
    });

    if (report) {
      console.log(report);
    }

    markChecked({ behind, ahead, depChanges: depChanges.length, breakingChanges: breakingChanges.length });
    process.exit(0);
  } catch (error) {
    console.error(`[REMOTE-SYNC] Error: ${error.message}`);
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
