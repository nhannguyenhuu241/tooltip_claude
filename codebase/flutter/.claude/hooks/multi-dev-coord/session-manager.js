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
 * Commands:
 *   register   - Register current session
 *   list       - List all active sessions
 *   cleanup    - Remove stale sessions
 *   status     - Show current session status
 *   end        - End current session
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const wipDir = path.join(projectDir, '.claude/wip');
const sessionsDir = path.join(projectDir, '.claude/sessions');

const CONFIG = {
  staleThreshold: 30 * 60 * 1000,
  zombieThreshold: 2 * 60 * 60 * 1000,
  heartbeatInterval: 5 * 60 * 1000,
  maxSessionAge: 24 * 60 * 60 * 1000
};

function generateSessionId() {
  const user = process.env.USER || process.env.USERNAME || os.userInfo().username || 'anon';
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString('hex');
  return `${user}-${timestamp}-${random}`;
}

const sessionId = process.env.CLAUDE_SESSION_ID || generateSessionId();

function ensureDirs() {
  if (!fs.existsSync(wipDir)) fs.mkdirSync(wipDir, { recursive: true });
  if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

  const gitignorePath = path.join(projectDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    const additions = [];
    if (!content.includes('.claude/wip/')) additions.push('.claude/wip/');
    if (!content.includes('.claude/sessions/')) additions.push('.claude/sessions/');
    if (!content.includes('.claude/cache/')) additions.push('.claude/cache/');

    if (additions.length > 0) {
      fs.appendFileSync(gitignorePath, '\n# Claude multi-dev coordination\n' + additions.join('\n') + '\n');
    }
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectDir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'unknown';
  }
}

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
    stats: { toolCalls: 0, edits: 0, writes: 0, reads: 0 }
  };
}

function registerSession(options = {}) {
  ensureDirs();
  const data = createSessionData(options);
  fs.writeFileSync(path.join(sessionsDir, `${sessionId}.json`), JSON.stringify(data, null, 2), 'utf-8');
  fs.writeFileSync(path.join(wipDir, `${sessionId}.json`), JSON.stringify({
    sessionId: data.sessionId, developer: data.developer, hostname: data.hostname,
    started: data.started, lastActivity: data.lastHeartbeat, files: {}, stats: data.stats
  }, null, 2), 'utf-8');
  return data;
}

function endSession() {
  const sessionPath = path.join(sessionsDir, `${sessionId}.json`);
  const wipPath = path.join(wipDir, `${sessionId}.json`);

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
  if (fs.existsSync(wipPath)) fs.unlinkSync(wipPath);
  return { success: true, sessionId };
}

function getAllSessions(includeStale = false) {
  ensureDirs();
  const sessions = [];
  const now = Date.now();
  const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf-8'));
      const age = now - new Date(data.lastHeartbeat).getTime();

      if (data.status === 'ended') data.displayStatus = 'ended';
      else if (age > CONFIG.zombieThreshold) data.displayStatus = 'zombie';
      else if (age > CONFIG.staleThreshold) data.displayStatus = 'stale';
      else data.displayStatus = 'active';

      data.ageHuman = formatAge(age);

      if (!includeStale && ['zombie', 'ended'].includes(data.displayStatus)) continue;
      sessions.push(data);
    } catch {}
  }

  return sessions.sort((a, b) => new Date(b.lastHeartbeat) - new Date(a.lastHeartbeat));
}

function cleanup() {
  ensureDirs();
  const now = Date.now();
  let cleaned = { sessions: 0, wip: 0 };

  for (const file of fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf-8'));
      const age = now - new Date(data.lastHeartbeat).getTime();
      if (age > CONFIG.zombieThreshold || data.status === 'ended') {
        fs.unlinkSync(path.join(sessionsDir, file));
        cleaned.sessions++;
      }
    } catch {
      try { fs.unlinkSync(path.join(sessionsDir, file)); cleaned.sessions++; } catch {}
    }
  }

  for (const file of fs.readdirSync(wipDir).filter(f => f.endsWith('.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(wipDir, file), 'utf-8'));
      const age = now - new Date(data.lastActivity).getTime();
      if (age > CONFIG.staleThreshold) {
        fs.unlinkSync(path.join(wipDir, file));
        cleaned.wip++;
      }
    } catch {
      try { fs.unlinkSync(path.join(wipDir, file)); cleaned.wip++; } catch {}
    }
  }

  return cleaned;
}

function formatAge(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

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
      sessionId: s.sessionId, developer: s.developer, hostname: s.hostname,
      status: s.displayStatus, branch: s.branch, lastActivity: s.ageHuman,
      files: Object.keys(s.files || {}).length, isCurrent: s.sessionId === sessionId
    }))
  };
}

function cli() {
  const command = process.argv[2] || 'status';

  switch (command) {
    case 'register':
      const session = registerSession();
      console.log(`✅ Session registered: ${session.sessionId}`);
      console.log(`   Developer: ${session.developer}`);
      console.log(`   Branch: ${session.branch}`);
      break;

    case 'list':
      const status = getStatus();
      console.log('\n📋 Active Claude Sessions:\n');
      for (const s of status.sessions) {
        const icon = { active: '🟢', stale: '🟡', zombie: '🔴', ended: '⚫' }[s.status] || '⚪';
        const current = s.isCurrent ? ' (YOU)' : '';
        console.log(`${icon} ${s.developer}@${s.hostname}${current}`);
        console.log(`   Branch: ${s.branch}, Last: ${s.lastActivity}, Files: ${s.files}\n`);
      }
      console.log(`Total: ${status.activeSessions} active, ${status.staleSessions} stale`);
      break;

    case 'cleanup':
      const cleaned = cleanup();
      console.log(`🧹 Cleanup: ${cleaned.sessions} sessions, ${cleaned.wip} wip entries removed`);
      break;

    case 'status':
      const stat = getStatus();
      if (stat.currentSession) {
        console.log(`\n📊 Session: ${stat.currentSession.sessionId}`);
        console.log(`   Status: ${stat.currentSession.displayStatus}`);
        console.log(`   Branch: ${stat.currentSession.branch}`);
      } else {
        console.log('No active session. Run "register" to start.');
      }
      console.log(`   Other active: ${stat.activeSessions - (stat.currentSession ? 1 : 0)}`);
      break;

    case 'end':
      const result = endSession();
      console.log(`✅ Session ended: ${result.sessionId}`);
      break;

    default:
      console.log('Usage: session-manager.js [register|list|cleanup|status|end]');
  }
}

module.exports = { sessionId, registerSession, endSession, getAllSessions, getStatus, cleanup, CONFIG };

if (require.main === module) {
  cli();
}
