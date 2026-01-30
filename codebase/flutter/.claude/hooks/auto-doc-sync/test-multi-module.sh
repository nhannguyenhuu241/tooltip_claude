#!/bin/bash

# Multi-Module Detection Test Script
# Tests hook's ability to detect and document changes across multiple modules

set -e

echo "🧪 Multi-Module Detection Test Suite"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f ".claude/hooks/auto-doc-sync/auto-doc-sync.js" ]; then
    print_error "Must be run from Flutter project root"
    exit 1
fi

# Backup existing docs
print_info "Backing up existing documentation..."
cp CHANGES.md CHANGES.md.backup 2>/dev/null || true
cp -r docs/modules docs/modules.backup 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST CASE 1: Breaking Change (4 Modules)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create test branch
git checkout -b test-multi-module-$(date +%s) 2>/dev/null || true

# Create test files in 4 modules
print_info "Creating test files in 4 modules..."

mkdir -p lib/core/theme
cat > lib/core/theme/test_colors.dart << 'EOF'
// Test file: Breaking change in AppColors
class AppColors {
  static const Color primary = Color(0xFF2196F3);
  static const Color accent = Color(0xFFFF9800);
}
EOF

mkdir -p lib/features/widgets/buttons
cat > lib/features/widgets/buttons/test_button.dart << 'EOF'
// Test file: Updated to use new AppColors
import 'package:flutter/material.dart';

class TestButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(color: Colors.blue);
  }
}
EOF

mkdir -p lib/features/presentation/login_module/src/ui
cat > lib/features/presentation/login_module/src/ui/test_login.dart << 'EOF'
// Test file: Login screen updated
import 'package:flutter/material.dart';

class TestLogin extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(color: Colors.blue);
  }
}
EOF

mkdir -p lib/features/presentation/register_module/src/ui
cat > lib/features/presentation/register_module/src/ui/test_register.dart << 'EOF'
// Test file: Register screen updated
import 'package:flutter/material.dart';

class TestRegister extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(color: Colors.blue);
  }
}
EOF

# Stage and commit
git add lib/core/theme/test_colors.dart
git add lib/features/widgets/buttons/test_button.dart
git add lib/features/presentation/login_module/src/ui/test_login.dart
git add lib/features/presentation/register_module/src/ui/test_register.dart

git commit -m "refactor(theme)!: update AppColors API

BREAKING CHANGE: primaryColor → AppColors.primary

Affected modules:
- core-theme: New color system
- widgets: Updated buttons
- login: Migrated colors
- register: Migrated colors"

print_success "Committed changes to 4 modules"

# Run hook
print_info "Running auto-doc-sync hook..."
echo '{"tool_name":"Bash","tool_input":{"command":"git commit"}}' | \
  node .claude/hooks/auto-doc-sync/auto-doc-sync.js > /tmp/hook-output.txt 2>&1

# Verify CHANGES.md updated
if grep -q "core-theme" CHANGES.md && \
   grep -q "widgets" CHANGES.md && \
   grep -q "login" CHANGES.md && \
   grep -q "register" CHANGES.md; then
    print_success "CHANGES.md contains all 4 modules"
else
    print_error "CHANGES.md missing some modules"
fi

# Verify module docs created
if [ -f "docs/modules/core-theme.md" ]; then
    print_success "docs/modules/core-theme.md created"
else
    print_error "docs/modules/core-theme.md not found"
fi

if [ -f "docs/modules/widgets.md" ]; then
    print_success "docs/modules/widgets.md created"
else
    print_error "docs/modules/widgets.md not found"
fi

if [ -f "docs/modules/login.md" ]; then
    print_success "docs/modules/login.md created"
else
    print_error "docs/modules/login.md not found"
fi

if [ -f "docs/modules/register.md" ]; then
    print_success "docs/modules/register.md created"
else
    print_error "docs/modules/register.md not found"
fi

# Verify breaking change detected
if grep -q "BREAKING" CHANGES.md; then
    print_success "Breaking change detected"
else
    print_error "Breaking change not detected"
fi

# Verify docs/CONTEXT.md updated
if [ -f "docs/CONTEXT.md" ] && grep -q "core-theme" docs/CONTEXT.md; then
    print_success "docs/CONTEXT.md updated"
else
    print_error "docs/CONTEXT.md not updated"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST CASE 2: Feature Across 5 Modules"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create files in 5 modules
print_info "Creating test files in 5 modules..."

mkdir -p lib/core/utils
cat > lib/core/utils/test_validators.dart << 'EOF'
// Test validators
class Validators {}
EOF

mkdir -p lib/core/routing
cat > lib/core/routing/test_guard.dart << 'EOF'
// Test auth guard
class AuthGuard {}
EOF

cat > lib/features/widgets/buttons/test_auth_button.dart << 'EOF'
// Test auth button
import 'package:flutter/material.dart';
class AuthButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container();
}
EOF

cat > lib/features/presentation/login_module/src/ui/test_new_login.dart << 'EOF'
// New login
import 'package:flutter/material.dart';
class NewLogin extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container();
}
EOF

cat > lib/features/presentation/register_module/src/ui/test_new_register.dart << 'EOF'
// New register
import 'package:flutter/material.dart';
class NewRegister extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container();
}
EOF

git add lib/core/utils/test_validators.dart
git add lib/core/routing/test_guard.dart
git add lib/features/widgets/buttons/test_auth_button.dart
git add lib/features/presentation/login_module/src/ui/test_new_login.dart
git add lib/features/presentation/register_module/src/ui/test_new_register.dart

git commit -m "feat(auth): implement authentication system

Modules affected:
- core-utils: Validators
- core-routing: Auth guard
- widgets: Auth button
- login: Login flow
- register: Register flow"

print_success "Committed changes to 5 modules"

# Run hook again
print_info "Running hook for 5-module change..."
echo '{"tool_name":"Bash","tool_input":{"command":"git commit"}}' | \
  node .claude/hooks/auto-doc-sync/auto-doc-sync.js > /tmp/hook-output2.txt 2>&1

# Verify 5 modules detected
module_count=$(grep -o "core-utils\|core-routing\|widgets\|login\|register" CHANGES.md | wc -l)
if [ $module_count -ge 5 ]; then
    print_success "All 5 modules detected in CHANGES.md"
else
    print_error "Only $module_count modules detected (expected 5)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST CASE 3: Single Module Update"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create localization file
print_info "Creating single module change..."

mkdir -p lib/l10n
cat > lib/l10n/test_l10n.dart << 'EOF'
// Test localization
const testKey = 'test';
EOF

git add lib/l10n/test_l10n.dart
git commit -m "feat(l10n): add translation keys"

print_success "Committed change to 1 module"

# Run hook
print_info "Running hook for single module..."
echo '{"tool_name":"Bash","tool_input":{"command":"git commit"}}' | \
  node .claude/hooks/auto-doc-sync/auto-doc-sync.js > /tmp/hook-output3.txt 2>&1

# Verify only 1 module
if grep -q "localization" CHANGES.md; then
    print_success "Localization module detected"
else
    print_error "Localization module not detected"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_info "Cleaning up test files..."

# Remove test files
git rm -f lib/core/theme/test_colors.dart 2>/dev/null || true
git rm -f lib/core/utils/test_validators.dart 2>/dev/null || true
git rm -f lib/core/routing/test_guard.dart 2>/dev/null || true
git rm -f lib/features/widgets/buttons/test_button.dart 2>/dev/null || true
git rm -f lib/features/widgets/buttons/test_auth_button.dart 2>/dev/null || true
git rm -f lib/features/presentation/login_module/src/ui/test_login.dart 2>/dev/null || true
git rm -f lib/features/presentation/login_module/src/ui/test_new_login.dart 2>/dev/null || true
git rm -f lib/features/presentation/register_module/src/ui/test_register.dart 2>/dev/null || true
git rm -f lib/features/presentation/register_module/src/ui/test_new_register.dart 2>/dev/null || true
git rm -f lib/l10n/test_l10n.dart 2>/dev/null || true

git commit -m "test: cleanup multi-module test files" 2>/dev/null || true

# Return to main branch and delete test branch
git checkout - 2>/dev/null || git checkout main 2>/dev/null || true
git branch -D $(git branch | grep test-multi-module) 2>/dev/null || true

# Restore backups
if [ -f "CHANGES.md.backup" ]; then
    mv CHANGES.md.backup CHANGES.md
    print_info "Restored CHANGES.md from backup"
fi

if [ -d "docs/modules.backup" ]; then
    rm -rf docs/modules
    mv docs/modules.backup docs/modules
    print_info "Restored docs/modules from backup"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Check output above.${NC}"
    exit 1
fi
