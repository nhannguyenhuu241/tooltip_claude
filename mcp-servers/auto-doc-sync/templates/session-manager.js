#!/usr/bin/env node

/**
 * Session Manager - Multi-Claude Coordination System
 *
 * Manages Claude session lifecycle:
 * 1. Register new sessions on start
 * 2. Track active sessions across the team
 * 3. Clean up stale/abandoned sessions
 * 4. Provide session coordination utilities
 *
 * Can be run as:
 * - Standalone CLI: node session-manager.js [command]
 * - Imported module for other hooks
 *
 * Commands:
 *   register   - Register current session
 *   list       - List all active sessions
 *   cleanup    - Remove stale sessions
 *   status     - Show current session status
 *   end        - End current session
 *
 * Environment Variables:
 *   CLAUDE_SESSION_ID - Session identifier
 *   CLAUDE_PROJECT_DIR - Project root directory
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const wipDir = path.join(projectDir, '.claude/wip');
const sessionsDir = path.join(projectDir, '.claude/sessions');

// Configuration
const CONFIG = {
  staleThreshold: 30 * 60 * 1000,      // 30 minutes - session considered stale
  zombieThreshold: 2 * 60 * 60 * 1000, // 2 hours - session auto-removed
  heartbeatInterval: 5 * 60 * 1000,    // 5 minutes - heartbeat frequency
  maxSessionAge: 24 * 60 * 60 * 1000   // 24 hours - max session lifetime
};

/**
 * Generate unique session ID
 */
function generateSessionId() {
  const user = process.env.USER || process.env.USERNAME || os.userInfo().username || 'anon';
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString('hex');
  return `${user}-${timestamp}-${random}`;
}

// Session ID (persistent for this process)
const sessionId = process.env.CLAUDE_SESSION_ID || generateSessionId();

/**
 * Ensure directories exist
 */
function ensureDirs() {
  if (!fs.existsSync(wipDir)) {
    fs.mkdirSync(wipDir, { recursive: true });
  }
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
  }

  // Add to .gitignore
  const gitignorePath = path.join(projectDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    const additions = [];
    if (!content.includes('.claude/wip/')) additions.push('.claude/wip/');
    if (!content.includes('.claude/sessions/')) additions.push('.claude/sessions/');
    if (!content.includes('.claude/cache/')) additions.push('.claude/cache/');

    if (additions.length > 0) {
      fs.appendFileSync(gitignorePath,
        '\n# Claude multi-dev coordination\n' + additions.join('\n') + '\n'
      );
    }
  }
}

/**
 * Get session file path
 */
function getSessionFilePath(sid = sessionId) {
  return path.join(sessionsDir, `${sid}.json`);
}

/**
 * Create session data structure
 */
function createSessionData(options = {}) {
  return {
    sessionId,
    developer: process.env.USER || process.env.USERNAME || os.userInfo().username || 'unknown',
    hostname: os.hostname(),
    platform: os.platform(),
    started: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    status: 'active',
    workingOn: options.workingOn || null,
    branch: options.branch || getCurrentBranch(),
    files: {},
    stats: {
      toolCalls: 0,
      edits: 0,
      writes: 0,
      reads: 0
    },
    metadata: options.metadata || {}
  };
}

/**
 * Get current git branch
 */
function getCurrentBranch() {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Register new session
 */
function registerSession(options = {}) {
  ensureDirs();

  const data = createSessionData(options);
  const filePath = getSessionFilePath();

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  // Also update WIP registry
  const wipPath = path.join(wipDir, `${sessionId}.json`);
  fs.writeFileSync(wipPath, JSON.stringify({
    sessionId: data.sessionId,
    developer: data.developer,
    hostname: data.hostname,
    started: data.started,
    lastActivity: data.lastHeartbeat,
    files: {},
    stats: data.stats
  }, null, 2), 'utf-8');

  return data;
}

/**
 * Update session heartbeat
 */
function heartbeat(updates = {}) {
  const filePath = getSessionFilePath();

  if (!fs.existsSync(filePath)) {
    return registerSession();
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.lastHeartbeat = new Date().toISOString();

    // Merge updates
    if (updates.workingOn) data.workingOn = updates.workingOn;
    if (updates.stats) {
      Object.assign(data.stats, updates.stats);
    }
    if (updates.files) {
      Object.assign(data.files, updates.files);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Sync to WIP
    const wipPath = path.join(wipDir, `${sessionId}.json`);
    if (fs.existsSync(wipPath)) {
      const wipData = JSON.parse(fs.readFileSync(wipPath, 'utf-8'));
      wipData.lastActivity = data.lastHeartbeat;
      wipData.stats = data.stats;
      if (updates.files) {
        Object.assign(wipData.files, updates.files);
      }
      fs.writeFileSync(wipPath, JSON.stringify(wipData, null, 2), 'utf-8');
    }

    return data;
  } catch (error) {
    return registerSession();
  }
}

/**
 * End session
 */
function endSession() {
  const sessionPath = getSessionFilePath();
  const wipPath = path.join(wipDir, `${sessionId}.json`);

  // Mark as ended rather than delete (for history)
  if (fs.existsSync(sessionPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
      data.status = 'ended';
      data.endedAt = new Date().toISOString();
      fs.writeFileSync(sessionPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      fs.unlinkSync(sessionPath);
    }
  }

  // Remove from WIP
  if (fs.existsSync(wipPath)) {
    fs.unlinkSync(wipPath);
  }

  return { success: true, sessionId };
}

/**
 * Get all sessions
 */
function getAllSessions(includeStale = false) {
  ensureDirs();

  const sessions = [];
  const now = Date.now();

  const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const filePath = path.join(sessionsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastHeartbeat = new Date(data.lastHeartbeat).getTime();
      const age = now - lastHeartbeat;

      // Calculate status
      if (data.status === 'ended') {
        data.displayStatus = 'ended';
      } else if (age > CONFIG.zombieThreshold) {
        data.displayStatus = 'zombie';
      } else if (age > CONFIG.staleThreshold) {
        data.displayStatus = 'stale';
      } else {
        data.displayStatus = 'active';
      }

      data.age = age;
      data.ageHuman = formatAge(age);

      // Filter based on includeStale
      if (!includeStale && ['zombie', 'ended'].includes(data.displayStatus)) {
        continue;
      }

      sessions.push(data);
    } catch {
      // Corrupted file
    }
  }

  // Sort by last activity (most recent first)
  return sessions.sort((a, b) =>
    new Date(b.lastHeartbeat).getTime() - new Date(a.lastHeartbeat).getTime()
  );
}

/**
 * Get active sessions (excluding current)
 */
function getOtherActiveSessions() {
  return getAllSessions(false).filter(s =>
    s.sessionId !== sessionId && s.displayStatus === 'active'
  );
}

/**
 * Cleanup stale and zombie sessions
 */
function cleanup() {
  ensureDirs();

  const now = Date.now();
  let cleaned = { sessions: 0, wip: 0 };

  // Clean sessions
  const sessionFiles = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));
  for (const file of sessionFiles) {
    try {
      const filePath = path.join(sessionsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastHeartbeat = new Date(data.lastHeartbeat).getTime();
      const age = now - lastHeartbeat;

      // Remove zombies and old ended sessions
      if (age > CONFIG.zombieThreshold || data.status === 'ended') {
        fs.unlinkSync(filePath);
        cleaned.sessions++;
      }
    } catch {
      // Remove corrupted files
      try {
        fs.unlinkSync(path.join(sessionsDir, file));
        cleaned.sessions++;
      } catch {}
    }
  }

  // Clean WIP
  const wipFiles = fs.readdirSync(wipDir).filter(f => f.endsWith('.json'));
  for (const file of wipFiles) {
    try {
      const filePath = path.join(wipDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastActivity = new Date(data.lastActivity).getTime();
      const age = now - lastActivity;

      if (age > CONFIG.staleThreshold) {
        fs.unlinkSync(filePath);
        cleaned.wip++;
      }
    } catch {
      try {
        fs.unlinkSync(path.join(wipDir, file));
        cleaned.wip++;
      } catch {}
    }
  }

  return cleaned;
}

/**
 * Get session status summary
 */
function getStatus() {
  const sessions = getAllSessions(true);
  const current = sessions.find(s => s.sessionId === sessionId);
  const active = sessions.filter(s => s.displayStatus === 'active');
  const stale = sessions.filter(s => s.displayStatus === 'stale');

  return {
    currentSession: current || null,
    activeSessions: active.length,
    staleSessions: stale.length,
    totalSessions: sessions.length,
    sessions: sessions.map(s => ({
      sessionId: s.sessionId,
      developer: s.developer,
      hostname: s.hostname,
      status: s.displayStatus,
      branch: s.branch,
      lastActivity: s.ageHuman,
      files: Object.keys(s.files || {}).length,
      isCurrent: s.sessionId === sessionId
    }))
  };
}

/**
 * Format age as human readable
 */
function formatAge(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/**
 * Format session list for display
 */
function formatSessionList(sessions) {
  if (sessions.length === 0) {
    return 'No active sessions found.';
  }

  let output = '\n📋 Active Claude Sessions:\n\n';

  for (const s of sessions) {
    const current = s.isCurrent ? ' (YOU)' : '';
    const statusIcon = {
      active: '🟢',
      stale: '🟡',
      zombie: '🔴',
      ended: '⚫'
    }[s.status] || '⚪';

    output += `${statusIcon} ${s.developer}@${s.hostname}${current}\n`;
    output += `   Session: ${s.sessionId}\n`;
    output += `   Branch: ${s.branch}\n`;
    output += `   Last activity: ${s.lastActivity}\n`;
    output += `   Files touched: ${s.files}\n\n`;
  }

  return output;
}

/**
 * CLI handler
 */
function cli() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  switch (command) {
    case 'register':
      const session = registerSession();
      console.log(`✅ Session registered: ${session.sessionId}`);
      console.log(`   Developer: ${session.developer}`);
      console.log(`   Branch: ${session.branch}`);
      break;

    case 'list':
      const status = getStatus();
      console.log(formatSessionList(status.sessions));
      console.log(`Total: ${status.activeSessions} active, ${status.staleSessions} stale`);
      break;

    case 'cleanup':
      const cleaned = cleanup();
      console.log(`🧹 Cleanup complete:`);
      console.log(`   Sessions removed: ${cleaned.sessions}`);
      console.log(`   WIP entries removed: ${cleaned.wip}`);
      break;

    case 'status':
      const stat = getStatus();
      if (stat.currentSession) {
        console.log(`\n📊 Current Session Status:`);
        console.log(`   ID: ${stat.currentSession.sessionId}`);
        console.log(`   Status: ${stat.currentSession.displayStatus}`);
        console.log(`   Started: ${stat.currentSession.started}`);
        console.log(`   Branch: ${stat.currentSession.branch}`);
        console.log(`   Files: ${Object.keys(stat.currentSession.files || {}).length}`);
      } else {
        console.log('No active session. Run "register" to start.');
      }
      console.log(`\n   Other active sessions: ${stat.activeSessions - (stat.currentSession ? 1 : 0)}`);
      break;

    case 'end':
      const result = endSession();
      console.log(`✅ Session ended: ${result.sessionId}`);
      break;

    case 'heartbeat':
      heartbeat();
      console.log('💓 Heartbeat sent');
      break;

    default:
      console.log('Usage: session-manager.js [register|list|cleanup|status|end|heartbeat]');
  }
}

// Export for use as module
module.exports = {
  sessionId,
  registerSession,
  heartbeat,
  endSession,
  getAllSessions,
  getOtherActiveSessions,
  getStatus,
  cleanup,
  formatSessionList,
  CONFIG
};

// Run CLI if called directly
if (require.main === module) {
  cli();
}
