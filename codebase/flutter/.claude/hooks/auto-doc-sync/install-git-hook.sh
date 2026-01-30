#!/bin/bash

# Install Auto-Doc-Sync as Git Hook
# This makes hook work with ALL git tools (GitHub Desktop, SourceTree, terminal, etc.)

set -e

echo "📦 Installing Auto-Doc-Sync Git Hook"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Get git root directory
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$GIT_ROOT" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

print_info "Git root: $GIT_ROOT"

# Check if auto-doc-sync.js exists
if [ ! -f "$GIT_ROOT/.claude/hooks/auto-doc-sync/auto-doc-sync.js" ]; then
    echo "❌ Error: auto-doc-sync.js not found"
    echo "Expected location: $GIT_ROOT/.claude/hooks/auto-doc-sync/auto-doc-sync.js"
    exit 1
fi

print_success "Found auto-doc-sync.js"

# Create hooks directory if not exists
mkdir -p "$GIT_ROOT/.git/hooks"
print_info "Hooks directory ready"

# Backup existing post-commit hook if it exists
if [ -f "$GIT_ROOT/.git/hooks/post-commit" ]; then
    print_warning "Existing post-commit hook found, backing up..."
    cp "$GIT_ROOT/.git/hooks/post-commit" "$GIT_ROOT/.git/hooks/post-commit.backup.$(date +%s)"
    print_success "Backup created"
fi

# Create post-commit hook
cat > "$GIT_ROOT/.git/hooks/post-commit" << 'EOF'
#!/bin/sh

# Auto-Doc-Sync Git Hook
# Runs after every commit (works with ALL git tools)

echo "🔄 Auto-Doc-Sync: Analyzing recent changes..."

# Get git root
GIT_ROOT=$(git rev-parse --show-toplevel)

# Run the auto-doc-sync script
if [ -f "$GIT_ROOT/.claude/hooks/auto-doc-sync/auto-doc-sync.js" ]; then
    cd "$GIT_ROOT"
    node .claude/hooks/auto-doc-sync/auto-doc-sync.js
else
    echo "⚠️  Warning: auto-doc-sync.js not found"
fi

exit 0
EOF

# Make hook executable
chmod +x "$GIT_ROOT/.git/hooks/post-commit"
print_success "post-commit hook installed and executable"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_info "Hook installed at: $GIT_ROOT/.git/hooks/post-commit"

echo ""
echo "🎉 Auto-Doc-Sync now works with:"
echo "   ✅ GitHub Desktop"
echo "   ✅ SourceTree"
echo "   ✅ GitKraken"
echo "   ✅ VSCode Git"
echo "   ✅ IntelliJ IDEA Git"
echo "   ✅ Terminal (git commit)"
echo "   ✅ Claude Code"
echo ""

print_info "Test the hook:"
echo "   1. Make a small change to any file"
echo "   2. Commit using your preferred tool"
echo "   3. Check CHANGES.md for updates"
echo ""

print_warning "Note: Git hooks are local and not tracked by git"
print_info "Each team member needs to run this script once:"
echo "   ./.claude/hooks/auto-doc-sync/install-git-hook.sh"
echo ""

print_info "Want to automate this for the whole team?"
echo "   Add to onboarding docs or README.md"
echo ""
