#!/usr/bin/env node

/**
 * Conflict Checker - PreToolUse Hook
 *
 * Checks for potential conflicts BEFORE editing files:
 * 1. Other Claude sessions working on same file (WIP tracking)
 * 2. Remote changes not yet pulled (git)
 * 3. Local uncommitted changes that might conflict
 *
 * Usage: PreToolUse hook for Edit|Write tools
 *
 * Exit Codes:
 *   0 - Allow operation (no conflicts or user acknowledged)
 *   2 - Block operation (critical conflict detected)
 *
 * Environment Variables:
 *   CONFLICT_CHECK_MODE: 'warn' (default) | 'block' | 'skip'
 *   CLAUDE_SESSION_ID: Current session identifier
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const wipDir = path.join(projectDir, '.claude/wip');
const conflictMode = process.env.CONFLICT_CHECK_MODE || 'warn';

// Session identification
const sessionId = process.env.CLAUDE_SESSION_ID || `${os.userInfo().username || 'unknown'}-${Date.now().toString(36)}`;

/**
 * Execute git command safely
 */
function git(command) {
  try {
    return execSync(`git ${command}`, {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Check if file has remote changes not yet pulled
 */
function checkRemoteChanges(filePath) {
  const relativePath = path.relative(projectDir, filePath);

  // Fetch latest (non-blocking, silent)
  git('fetch --quiet 2>/dev/null');

  const currentBranch = git('rev-parse --abbrev-ref HEAD');
  if (!currentBranch) return null;

  const remoteBranch = `origin/${currentBranch}`;
  const remoteExists = git(`rev-parse --verify ${remoteBranch} 2>/dev/null`);
  if (!remoteExists) return null;

  const diff = git(`diff HEAD..${remoteBranch} -- "${relativePath}" 2>/dev/null`);

  if (diff && diff.length > 0) {
    const remoteLog = git(`log HEAD..${remoteBranch} --oneline -- "${relativePath}" 2>/dev/null`);
    return {
      hasChanges: true,
      diff: diff.substring(0, 500),
      commits: remoteLog ? remoteLog.split('\n').slice(0, 5) : []
    };
  }

  return null;
}

/**
 * Check if file has local uncommitted changes
 */
function checkLocalChanges(filePath) {
  const relativePath = path.relative(projectDir, filePath);
  const staged = git(`diff --cached --name-only -- "${relativePath}"`);
  const unstaged = git(`diff --name-only -- "${relativePath}"`);

  if (staged || unstaged) {
    return {
      staged: !!staged,
      unstaged: !!unstaged,
      status: git(`status --porcelain -- "${relativePath}"`)
    };
  }

  return null;
}

/**
 * Check WIP registry for other sessions editing same file
 */
function checkWipConflicts(filePath) {
  if (!fs.existsSync(wipDir)) return [];

  const relativePath = path.relative(projectDir, filePath);
  const conflicts = [];
  const staleThreshold = 30 * 60 * 1000;
  const now = Date.now();

  const files = fs.readdirSync(wipDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    if (file.startsWith(sessionId)) continue;

    try {
      const sessionPath = path.join(wipDir, file);
      const data = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
      const lastActivity = new Date(data.lastActivity).getTime();

      if (now - lastActivity > staleThreshold) continue;

      if (data.files && data.files[relativePath]) {
        const fileInfo = data.files[relativePath];
        conflicts.push({
          developer: data.developer,
          hostname: data.hostname,
          sessionId: data.sessionId,
          lastAccess: fileInfo.lastAccess,
          accessCount: fileInfo.accessCount,
          sessionStart: data.started
        });
      }
    } catch {
      // Ignore corrupted files
    }
  }

  return conflicts;
}

/**
 * Format time ago
 */
function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

/**
 * Build conflict report
 */
function buildConflictReport(filePath, wipConflicts, remoteChanges, localChanges) {
  const issues = [];
  let severity = 'info';

  if (wipConflicts.length > 0) {
    severity = 'warning';
    let msg = `\n🔴 **ACTIVE CONFLICT**: Other Claude sessions editing this file!\n`;
    for (const c of wipConflicts) {
      msg += `   • ${c.developer}@${c.hostname} — ${c.accessCount} edits, last ${timeAgo(c.lastAccess)}\n`;
    }
    msg += `   → Coordinate before proceeding or risk merge conflicts\n`;
    issues.push(msg);
  }

  if (remoteChanges) {
    severity = severity === 'warning' ? 'critical' : 'warning';
    let msg = `\n🟡 **REMOTE CHANGES**: File modified on remote, not yet pulled!\n`;
    if (remoteChanges.commits.length > 0) {
      msg += `   Recent commits:\n`;
      for (const commit of remoteChanges.commits.slice(0, 3)) {
        msg += `   • ${commit}\n`;
      }
    }
    msg += `   → Run 'git pull' before editing to avoid conflicts\n`;
    issues.push(msg);
  }

  if (localChanges) {
    let msg = `\n🟠 **LOCAL CHANGES**: Uncommitted changes in this file\n`;
    msg += `   Status: ${localChanges.status || 'modified'}\n`;
    if (localChanges.staged) msg += `   • Staged changes present\n`;
    if (localChanges.unstaged) msg += `   • Unstaged changes present\n`;
    msg += `   → Consider committing or stashing before new edits\n`;
    issues.push(msg);
  }

  if (issues.length === 0) return null;

  const header = severity === 'critical'
    ? `\n⛔ [CONFLICT-CHECKER] CRITICAL: Multiple conflict sources detected!`
    : `\n⚠️ [CONFLICT-CHECKER] Potential conflicts detected`;

  return {
    severity,
    message: header + '\n' + `File: ${path.relative(projectDir, filePath)}\n` + issues.join('')
  };
}

/**
 * Main hook execution
 */
function main() {
  try {
    if (conflictMode === 'skip') {
      process.exit(0);
    }

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

    if (!['Edit', 'Write'].includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolInput.file_path || toolInput.path;
    if (!filePath) {
      process.exit(0);
    }

    const fileExists = fs.existsSync(filePath);
    if (toolName === 'Write' && !fileExists) {
      process.exit(0);
    }

    const wipConflicts = checkWipConflicts(filePath);
    const remoteChanges = checkRemoteChanges(filePath);
    const localChanges = checkLocalChanges(filePath);

    const report = buildConflictReport(filePath, wipConflicts, remoteChanges, localChanges);

    if (report) {
      console.log(report.message);

      if (conflictMode === 'block' && report.severity === 'critical') {
        console.log('\n❌ Operation blocked due to critical conflicts.');
        console.log('   Set CONFLICT_CHECK_MODE=warn to allow with warnings.\n');
        process.exit(2);
      }

      console.log('\n📋 Recommendations:');
      console.log('   1. Run `/sync` to see full team activity');
      console.log('   2. Coordinate with active developers');
      console.log('   3. Pull latest changes: git pull');
      console.log('   4. Proceed with caution\n');
    }

    process.exit(0);
  } catch (error) {
    console.error(`[CONFLICT-CHECKER] Error: ${error.message}`);
    process.exit(0);
  }
}

module.exports = {
  checkRemoteChanges,
  checkLocalChanges,
  checkWipConflicts,
  buildConflictReport
};

if (require.main === module) {
  main();
}
