#!/bin/bash

# Quick Publish Script for db-context-sync-mcp
# Run this script to publish to npm registry

set -e  # Exit on error

echo "🚀 Publishing db-context-sync-mcp to npm"
echo "=========================================="
echo ""

# Check if logged in to npm
echo "📋 Checking npm login status..."
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm. Please login first:"
    npm login
fi

CURRENT_USER=$(npm whoami)
echo "✅ Logged in as: $CURRENT_USER"
echo ""

# Verify package contents
echo "📦 Verifying package contents..."
npm pack --dry-run
echo ""

# Confirm publication
echo "⚠️  Ready to publish to npm registry"
echo "Package: db-context-sync-mcp@1.0.0"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publication cancelled"
    exit 1
fi

# Publish to npm
echo ""
echo "📤 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published db-context-sync-mcp@1.0.0!"
    echo ""
    echo "📚 Next steps:"
    echo "1. View on npm: https://www.npmjs.com/package/db-context-sync-mcp"
    echo "2. Test installation: npm install -g db-context-sync-mcp"
    echo "3. Create GitHub release: https://github.com/NhanNH26/db-context-sync-mcp/releases/new"
    echo "4. Tag: v1.0.0"
    echo ""
    echo "🎉 Happy sharing!"
else
    echo ""
    echo "❌ Publication failed. Check errors above."
    exit 1
fi
