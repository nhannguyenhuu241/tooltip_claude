#!/bin/bash

# Cleanup redundant MD files
# Keep only: COMPLETE-GUIDE.md, README.md, CHANGELOG.md, QUICKSTART.md

echo "🧹 Cleaning up redundant MD files..."
echo "================================================"
echo ""

cd "$(dirname "$0")"

# Remove redundant files from root
echo "📁 Cleaning mcp-servers/ root..."
rm -f QUICK-UPDATE.md
rm -f PUBLISH-BOTH.md
rm -f UPDATE-VERSION.md
echo "  ✅ Removed 3 files"

# Remove redundant files from auto-doc-sync
echo ""
echo "📁 Cleaning auto-doc-sync/..."
cd auto-doc-sync
rm -f DIAGRAMS.md
rm -f PUBLISHING.md
rm -f README-NPM.md
rm -f INSTALLATION.md
rm -f QUICK-PUBLISH.md
rm -f FEATURES_SUMMARY.md
rm -f MULTI_DEV_COORDINATION.md
rm -f PROMPTS.md
rm -rf docs/
rm -rf commands/
echo "  ✅ Removed 8 files + 2 directories"

# Remove redundant files from db-context-sync
cd ../db-context-sync
echo ""
echo "📁 Cleaning db-context-sync/..."
rm -f ARCHITECTURE.md
rm -f DIRECT_DATABASE_SCANNING.md
rm -f APPROACHES_COMPARISON.md
rm -f SQL_GENERATION.md
rm -f DB_HOOKS_GUIDE.md
rm -f COMPLETE_WORKFLOW.md
rm -f FEATURES_SUMMARY.md
rm -f INSTALLATION.md
rm -f QUICK-PUBLISH.md
echo "  ✅ Removed 9 files"

cd ..

echo ""
echo "================================================"
echo "✅ Cleanup complete!"
echo ""
echo "📚 Remaining structure:"
echo ""
echo "mcp-servers/"
echo "├── COMPLETE-GUIDE.md          ← Single comprehensive guide"
echo "├── auto-doc-sync/"
echo "│   ├── README.md              ← npm description"
echo "│   ├── CHANGELOG.md           ← version history"
echo "│   ├── QUICKSTART.md          ← quick reference"
echo "│   ├── LICENSE"
echo "│   ├── package.json"
echo "│   ├── index.js"
echo "│   ├── templates/"
echo "│   ├── PUBLISH-NOW.sh"
echo "│   ├── UPDATE.sh"
echo "│   ├── architecture.drawio"
echo "│   └── workflow.drawio"
echo "└── db-context-sync/"
echo "    ├── README.md              ← npm description"
echo "    ├── CHANGELOG.md           ← version history"
echo "    ├── QUICKSTART.md          ← quick reference"
echo "    ├── LICENSE"
echo "    ├── package.json"
echo "    ├── index.js"
echo "    ├── templates/"
echo "    ├── examples/"
echo "    ├── PUBLISH-NOW.sh"
echo "    └── UPDATE.sh"
echo ""
echo "🎯 All documentation now in: COMPLETE-GUIDE.md"
echo ""
