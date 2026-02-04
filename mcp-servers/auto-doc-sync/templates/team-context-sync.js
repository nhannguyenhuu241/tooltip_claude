#!/usr/bin/env node

/**
 * Team Context Sync - PreToolUse Hook
 *
 * Automatically injects team activity context from auto-doc-sync
 * into Claude's context at the start of each session.
 *
 * Reads: docs/CONTEXT.md, CHANGES.md, docs/modules/*.md
 * Injects once per ~50 messages (transcript scanning for token efficiency)
 *
 * Configuration in settings.json:
 *   "PreToolUse": [{
 *     "matcher": "Bash|Write|Edit",
 *     "hooks": [{
 *       "type": "command",
 *       "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/team-context-sync/team-context-sync.js"
 *     }]
 *   }]
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 */

const fs = require('fs');
const path = require('path');

const MARKER = '[TEAM-CONTEXT-SYNC]';
const MAX_OUTPUT_CHARS = 2000;
const TRANSCRIPT_CHECK_LINES = 50;
const MAX_RECENT_COMMITS = 10;

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/**
 * Check if context was recently injected by scanning transcript
 */
function wasRecentlyInjected(transcriptPath) {
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) return false;
    const transcript = fs.readFileSync(transcriptPath, 'utf-8');
    const lines = transcript.split('\n');
    const recentLines = lines.slice(-TRANSCRIPT_CHECK_LINES);
    return recentLines.some(line => line.includes(MARKER));
  } catch (error) {
    return false;
  }
}

/**
 * Extract recent commits from CHANGES.md
 */
function extractRecentCommits(changesPath) {
  if (!fs.existsSync(changesPath)) return [];
  const content = fs.readFileSync(changesPath, 'utf-8');
  const commits = [];
  const commitRegex = /^- \*\*([a-f0-9]{7})\*\* by (.+?) \((.+?)\)\n\s+(?:📌 Branch: `.+?`\n\s+)?(.+)/gm;
  let match;
  while ((match = commitRegex.exec(content)) !== null && commits.length < MAX_RECENT_COMMITS) {
    commits.push({
      hash: match[1],
      author: match[2],
      time: match[3],
      message: match[4].trim()
    });
  }
  return commits;
}

/**
 * Extract module activity summary from CONTEXT.md
 */
function extractModuleActivity(contextPath) {
  if (!fs.existsSync(contextPath)) return [];
  const content = fs.readFileSync(contextPath, 'utf-8');
  const modules = [];
  const moduleRegex = /### (.+)\n\n- \*\*(\d+) commit\(s\)\*\* in last 24h/g;
  let match;
  while ((match = moduleRegex.exec(content)) !== null) {
    modules.push({ name: match[1], commits: parseInt(match[2]) });
  }
  return modules.sort((a, b) => b.commits - a.commits);
}

/**
 * Extract warnings from CONTEXT.md
 */
function extractWarnings(contextPath) {
  if (!fs.existsSync(contextPath)) return [];
  const content = fs.readFileSync(contextPath, 'utf-8');
  const warnings = [];

  if (content.includes('BREAKING CHANGES')) {
    warnings.push('Breaking changes detected — review before coding');
  }
  if (content.includes('Dependencies updated') || content.includes('Dependencies Changed')) {
    warnings.push('Dependencies updated — run install command after pull');
  }

  return warnings;
}

/**
 * Build concise team context summary
 */
function buildSummary() {
  const changesPath = path.join(projectDir, 'CHANGES.md');
  const contextPath = path.join(projectDir, 'docs/CONTEXT.md');

  // If no auto-doc-sync files exist, skip silently
  if (!fs.existsSync(contextPath) && !fs.existsSync(changesPath)) {
    return null;
  }

  const commits = extractRecentCommits(changesPath);
  const modules = extractModuleActivity(contextPath);
  const warnings = extractWarnings(contextPath);

  if (commits.length === 0 && modules.length === 0) {
    return null;
  }

  let output = `## ${MARKER} Team Activity Summary\n\n`;

  // Recent changes
  if (commits.length > 0) {
    output += `### Recent Changes\n`;
    for (const c of commits) {
      output += `- **${c.hash}** ${c.message} — by ${c.author} (${c.time})\n`;
    }
    output += '\n';
  }

  // Module activity
  if (modules.length > 0) {
    output += `### Active Modules\n`;
    for (const m of modules) {
      const tag = m.commits >= 5 ? ' — HIGH ACTIVITY, coordinate before changes' : '';
      output += `- ${m.name}: ${m.commits} commit(s)${tag}\n`;
    }
    output += '\n';
  }

  // Warnings
  if (warnings.length > 0) {
    output += `### Warnings\n`;
    for (const w of warnings) {
      output += `- ⚠️ ${w}\n`;
    }
    output += '\n';
  }

  // Guidance
  output += `### Before You Code\n`;
  output += `- Read docs/modules/{module}.md before modifying any module\n`;
  output += `- Coordinate on high-activity modules\n`;
  output += `- Run /sync for detailed team context\n`;

  // Truncate if too long
  if (output.length > MAX_OUTPUT_CHARS) {
    output = output.slice(0, MAX_OUTPUT_CHARS - 20) + '\n\n... (truncated)\n';
  }

  return output;
}

/**
 * Main hook execution
 */
function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    if (!stdin) {
      process.exit(0);
    }

    const payload = JSON.parse(stdin);

    // Skip if recently injected
    if (wasRecentlyInjected(payload.transcript_path)) {
      process.exit(0);
    }

    const summary = buildSummary();
    if (summary) {
      console.log(summary);
    }

    process.exit(0);
  } catch (error) {
    // Fail-open: allow operation to continue
    process.exit(0);
  }
}

main();
