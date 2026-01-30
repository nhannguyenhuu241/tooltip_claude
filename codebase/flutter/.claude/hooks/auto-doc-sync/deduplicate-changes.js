#!/usr/bin/env node

/**
 * Deduplicate CHANGES.md
 * Removes duplicate commit entries while preserving order
 */

const fs = require('fs');
const path = require('path');

const CHANGES_FILE = path.join(__dirname, '../../../CHANGES.md');

function deduplicateChanges() {
  console.log('🧹 Deduplicating CHANGES.md...\n');

  // Read file
  const content = fs.readFileSync(CHANGES_FILE, 'utf8');

  // Split into lines
  const lines = content.split('\n');

  // Track seen commit hashes
  const seenHashes = new Set();
  const seenDates = new Set();

  // Rebuild content
  const newLines = [];
  let skipUntilNextCommit = false;
  let currentDate = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Header lines (keep all)
    if (i < 5 && (line.startsWith('#') || line.includes('Track all changes') || line.includes('Auto-Generated') || line === '')) {
      newLines.push(line);
      continue;
    }

    // Date headers
    if (line.startsWith('## ')) {
      const date = line.replace('## ', '').trim();

      // Skip duplicate date sections
      if (seenDates.has(date)) {
        skipUntilNextCommit = false; // Don't skip, just merge into existing date
        continue;
      }

      seenDates.add(date);
      currentDate = date;
      newLines.push(line);
      continue;
    }

    // Commit entries
    const hashMatch = line.match(/^- \*\*([a-f0-9]{7})\*\*/);
    if (hashMatch) {
      const hash = hashMatch[1];

      // Skip duplicate commits
      if (seenHashes.has(hash)) {
        skipUntilNextCommit = true;
        continue;
      }

      seenHashes.add(hash);
      skipUntilNextCommit = false;
      newLines.push(line);
      continue;
    }

    // Skip lines belonging to duplicate commits
    if (skipUntilNextCommit && (line.startsWith('  ') || line === '')) {
      continue;
    }

    // Keep all other lines
    if (!skipUntilNextCommit) {
      newLines.push(line);
    }
  }

  // Remove trailing empty lines
  while (newLines[newLines.length - 1] === '') {
    newLines.pop();
  }

  // Add single trailing newline
  const dedupedContent = newLines.join('\n') + '\n';

  // Write back
  fs.writeFileSync(CHANGES_FILE, dedupedContent, 'utf8');

  console.log(`✅ Deduplication complete!`);
  console.log(`   - Original: ${seenHashes.size + (lines.length - newLines.length)} entries`);
  console.log(`   - Unique: ${seenHashes.size} entries`);
  console.log(`   - Removed: ${lines.length - newLines.length} duplicate lines\n`);
}

// Run
try {
  deduplicateChanges();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
