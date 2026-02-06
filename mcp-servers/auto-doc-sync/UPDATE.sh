#!/bin/bash

# Quick Update Script for auto-doc-sync-mcp
# Usage: ./UPDATE.sh patch|minor|major "Commit message"

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Usage: ./UPDATE.sh <patch|minor|major> \"Commit message\""
    echo ""
    echo "Examples:"
    echo "  ./UPDATE.sh patch \"fix: session cleanup issue\""
    echo "  ./UPDATE.sh minor \"feat: add new conflict detection tool\""
    echo "  ./UPDATE.sh major \"breaking: change API structure\""
    exit 1
fi

VERSION_TYPE=$1
COMMIT_MSG=$2

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "❌ Invalid version type. Use: patch, minor, or major"
    exit 1
fi

echo "🔄 Updating auto-doc-sync-mcp ($VERSION_TYPE)"
echo "=============================================="
echo ""

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "$COMMIT_MSG"
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Update version
echo ""
echo "📦 Updating version..."
npm version $VERSION_TYPE

NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Publish
echo ""
echo "📤 Publishing to npm..."
npm publish

# Push to git
echo ""
echo "⬆️  Pushing to GitHub..."
git push
git push --tags

echo ""
echo "✅ Successfully updated auto-doc-sync-mcp!"
echo ""
echo "📊 Summary:"
echo "  Version: $CURRENT_VERSION → $NEW_VERSION"
echo "  Commit: $COMMIT_MSG"
echo ""
echo "📚 Next steps:"
echo "1. Update CHANGELOG.md manually if needed"
echo "2. Create GitHub release: https://github.com/NhanNH26/auto-doc-sync-mcp/releases/new"
echo "3. Verify on npm: npm view auto-doc-sync-mcp"
echo ""
echo "🎉 Done!"
