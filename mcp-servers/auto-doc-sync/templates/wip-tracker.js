#!/usr/bin/env node

/**
 * WIP (Work-In-Progress) Tracker - PostToolUse Hook
 *
 * Tracks files being edited by Claude sessions in real-time.
 * Creates a shared registry so other sessions can see what's being worked on.
 *
 * Usage: PostToolUse hook for Edit|Write tools
 *
 * Registry location: .claude/wip/
 * Each session creates: .claude/wip/{session-id}.json
 *
 * Exit Codes:
 *   0 - Success (allows operation to continue)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const wipDir = path.join(projectDir, '.claude/wip');

// Session identification
const sessionId = process.env.CLAUDE_SESSION_ID || generateSessionId();
const developer = process.env.USER || process.env.USERNAME || os.userInfo().username || 'unknown';
const hostname = os.hostname();

/**
 * Generate unique session ID if not provided
 */
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `${developer}-${timestamp}-${random}`;
}

/**
 * Ensure WIP directory exists
 */
function ensureWipDir() {
  if (!fs.existsSync(wipDir)) {
    fs.mkdirSync(wipDir, { recursive: true });
  }

  // Add to .gitignore if not already there
  const gitignorePath = path.join(projectDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('.claude/wip/')) {
      fs.appendFileSync(gitignorePath, '\n# Claude WIP tracking\n.claude/wip/\n');
    }
  }
}

/**
 * Get session file path
 */
function getSessionFilePath() {
  return path.join(wipDir, `${sessionId}.json`);
}

/**
 * Load current session data
 */
function loadSessionData() {
  const sessionFile = getSessionFilePath();
  if (fs.existsSync(sessionFile)) {
    try {
      return JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
    } catch {
      return createNewSession();
    }
  }
  return createNewSession();
}

/**
 * Create new session data structure
 */
function createNewSession() {
  return {
    sessionId,
    developer,
    hostname,
    started: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    files: {},
    stats: {
      edits: 0,
      writes: 0
    }
  };
}

/**
 * Save session data
 */
function saveSessionData(data) {
  ensureWipDir();
  data.lastActivity = new Date().toISOString();
  fs.writeFileSync(getSessionFilePath(), JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Register file being edited
 */
function registerFileEdit(filePath, toolName) {
  const data = loadSessionData();
  const relativePath = path.relative(projectDir, filePath);

  if (!data.files[relativePath]) {
    data.files[relativePath] = {
      firstAccess: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      accessCount: 0,
      operations: []
    };
  }

  const fileData = data.files[relativePath];
  fileData.lastAccess = new Date().toISOString();
  fileData.accessCount++;
  fileData.operations.push({
    tool: toolName,
    time: new Date().toISOString()
  });

  // Keep only last 10 operations per file
  if (fileData.operations.length > 10) {
    fileData.operations = fileData.operations.slice(-10);
  }

  // Update stats
  if (toolName === 'Edit') {
    data.stats.edits++;
  } else if (toolName === 'Write') {
    data.stats.writes++;
  }

  saveSessionData(data);
  return data;
}

/**
 * Get all active sessions (excluding current)
 */
function getOtherActiveSessions() {
  if (!fs.existsSync(wipDir)) return [];

  const sessions = [];
  const files = fs.readdirSync(wipDir).filter(f => f.endsWith('.json'));
  const staleThreshold = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();

  for (const file of files) {
    if (file === `${sessionId}.json`) continue;

    try {
      const filePath = path.join(wipDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastActivity = new Date(data.lastActivity).getTime();

      // Skip stale sessions
      if (now - lastActivity > staleThreshold) {
        // Optionally clean up stale sessions
        // fs.unlinkSync(filePath);
        continue;
      }

      sessions.push(data);
    } catch {
      // Ignore corrupted files
    }
  }

  return sessions;
}

/**
 * Check if file is being edited by another session
 */
function checkFileConflicts(filePath) {
  const relativePath = path.relative(projectDir, filePath);
  const otherSessions = getOtherActiveSessions();
  const conflicts = [];

  for (const session of otherSessions) {
    if (session.files[relativePath]) {
      conflicts.push({
        sessionId: session.sessionId,
        developer: session.developer,
        hostname: session.hostname,
        lastAccess: session.files[relativePath].lastAccess,
        accessCount: session.files[relativePath].accessCount
      });
    }
  }

  return conflicts;
}

/**
 * Generate conflict warning message
 */
function generateConflictWarning(conflicts, filePath) {
  if (conflicts.length === 0) return null;

  let warning = `\n⚠️ [WIP-TRACKER] Potential conflict detected!\n`;
  warning += `File: ${filePath}\n`;
  warning += `\nOther sessions working on this file:\n`;

  for (const c of conflicts) {
    const timeAgo = getTimeAgo(new Date(c.lastAccess));
    warning += `  • ${c.developer}@${c.hostname} (${c.accessCount} edits, last: ${timeAgo})\n`;
  }

  warning += `\nConsider coordinating before making changes.\n`;
  return warning;
}

/**
 * Human-readable time ago
 */
function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/**
 * Main hook execution
 */
function main() {
  try {
    // Read hook input from stdin
    let input = '';
    try {
      input = fs.readFileSync(0, 'utf-8').trim();
    } catch {
      // No stdin, possibly manual run
      process.exit(0);
    }

    if (!input) {
      process.exit(0);
    }

    const payload = JSON.parse(input);
    const toolName = payload.tool_name;
    const toolInput = payload.tool_input || {};

    // Only track Edit and Write operations
    if (!['Edit', 'Write'].includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolInput.file_path || toolInput.path;
    if (!filePath) {
      process.exit(0);
    }

    // Register this file edit
    registerFileEdit(filePath, toolName);

    // Check for conflicts and warn (non-blocking)
    const conflicts = checkFileConflicts(filePath);
    const warning = generateConflictWarning(conflicts, filePath);

    if (warning) {
      console.log(warning);
    }

    process.exit(0);
  } catch (error) {
    // Fail-open: don't block operations
    console.error(`[WIP-TRACKER] Error: ${error.message}`);
    process.exit(0);
  }
}

// Export for testing
module.exports = {
  registerFileEdit,
  checkFileConflicts,
  getOtherActiveSessions,
  loadSessionData,
  saveSessionData
};

// Run if called directly
if (require.main === module) {
  main();
}
