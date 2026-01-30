#!/usr/bin/env node

/**
 * Deduplicate Module Documentation
 *
 * Removes duplicate commit entries from docs/modules/*.md files
 * Same issue as CHANGES.md - commits were added multiple times
 */

const fs = require('fs');
const path = require('path');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const moduleDocsDir = path.join(projectDir, 'docs/modules');

console.log('🔄 Deduplicating module documentation files...');

// Get all module .md files
if (!fs.existsSync(moduleDocsDir)) {
  console.log('❌ docs/modules/ directory not found');
  process.exit(1);
}

const moduleFiles = fs.readdirSync(moduleDocsDir)
  .filter(file => file.endsWith('.md'));

if (moduleFiles.length === 0) {
  console.log('No module docs found to deduplicate');
  process.exit(0);
}

let totalRemoved = 0;

moduleFiles.forEach(moduleFile => {
  const filePath = path.join(moduleDocsDir, moduleFile);
  console.log(`\n📄 Processing ${moduleFile}...`);

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const seenHashes = new Set();
  const seenDates = new Set();
  const dedupedLines = [];

  let inDateSection = false;
  let currentDate = null;
  let skipUntilNextEntry = false;
  let removedInFile = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Date section: ### 2026-01-30
    const dateMatch = line.match(/^### (\d{4}-\d{2}-\d{2})$/);
    if (dateMatch) {
      currentDate = dateMatch[1];
      inDateSection = true;
      skipUntilNextEntry = false;

      // Check if we've already seen this date section
      if (seenDates.has(currentDate)) {
        skipUntilNextEntry = true;
        removedInFile++;
        continue;
      }
      seenDates.add(currentDate);
      dedupedLines.push(line);
      continue;
    }

    // Stop skipping when we hit a new section marker
    if (skipUntilNextEntry) {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        skipUntilNextEntry = false;
        // Reprocess this line
        i--;
        continue;
      }
      // Skip this line (part of duplicate)
      removedInFile++;
      continue;
    }

    // Commit line: - message (hash) by author
    const commitMatch = line.match(/^- .+ \(([a-f0-9]{7})\) by .+$/);
    if (commitMatch) {
      const hash = commitMatch[1];

      // Check if we've seen this commit hash
      if (seenHashes.has(hash)) {
        // Mark to skip this commit and all following content until next commit/section
        skipUntilNextEntry = true;
        removedInFile++;
        continue;
      }

      seenHashes.add(hash);
      dedupedLines.push(line);
      continue;
    }

    // Keep all other lines (unless we're in skip mode)
    dedupedLines.push(line);
  }

  // Write back deduplicated content
  const dedupedContent = dedupedLines.join('\n');
  fs.writeFileSync(filePath, dedupedContent, 'utf8');

  totalRemoved += removedInFile;
  console.log(`  ✓ Removed ${removedInFile} duplicate line(s)`);
  console.log(`  ✓ Unique commits: ${seenHashes.size}`);
});

console.log(`\n✅ Deduplication complete!`);
console.log(`📊 Total duplicate lines removed: ${totalRemoved}`);
console.log(`📁 Processed ${moduleFiles.length} module file(s)`);
