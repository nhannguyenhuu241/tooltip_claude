# Multi-Module Detection Tests

Quick guide để test hook's multi-module detection capability.

## 🚀 Quick Start

### Option 1: Run Automated Test Suite (Recommended)

```bash
# Chạy full test suite
cd /path/to/flutter-project
.claude/hooks/auto-doc-sync/test-multi-module.sh
```

**Output:**
```
🧪 Multi-Module Detection Test Suite
======================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST CASE 1: Breaking Change (4 Modules)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Committed changes to 4 modules
✅ CHANGES.md contains all 4 modules
✅ docs/modules/core-theme.md created
✅ docs/modules/widgets.md created
✅ docs/modules/login.md created
✅ docs/modules/register.md created
✅ Breaking change detected
✅ docs/CONTEXT.md updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST CASE 2: Feature Across 5 Modules
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Committed changes to 5 modules
✅ All 5 modules detected in CHANGES.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST CASE 3: Single Module Update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Committed change to 1 module
✅ Localization module detected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: 10
Passed: 10
Failed: 0

🎉 All tests passed!
```

---

### Option 2: Manual Testing

Follow the detailed guide in [TEST_MULTI_MODULE.md](./TEST_MULTI_MODULE.md)

---

## 📋 Test Cases Covered

### Test Case 1: Breaking Change (4 Modules)
- **Scenario**: Theme refactor affecting 4 modules
- **Modules**: `core-theme`, `widgets`, `login`, `register`
- **Validates**:
  - All 4 modules detected
  - Breaking change flagged
  - Docs created for each module
  - CONTEXT.md shows cross-module impact

### Test Case 2: Feature Across 5 Modules
- **Scenario**: Auth feature spanning 5 modules
- **Modules**: `core-utils`, `core-routing`, `widgets`, `login`, `register`
- **Validates**:
  - All 5 modules detected
  - Module relationships documented

### Test Case 3: Single Module Update
- **Scenario**: Localization update
- **Modules**: `localization`
- **Validates**:
  - Only affected module detected
  - No false positives

---

## ✅ Success Criteria

Hook should:
- ✅ Detect ALL affected modules (no misses)
- ✅ Update CHANGES.md with all modules
- ✅ Create/update docs/modules/{module}.md for each
- ✅ Update docs/CONTEXT.md with summary
- ✅ Flag breaking changes with ⚠️
- ✅ Show cross-module relationships
- ✅ Complete in < 500ms

---

## 🔧 Troubleshooting

### Tests fail?

```bash
# Check hook is working
echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | \
  node .claude/hooks/auto-doc-sync/auto-doc-sync.js
```

### Want to see detailed output?

```bash
# Run with verbose logging
export DEBUG=true
.claude/hooks/auto-doc-sync/test-multi-module.sh
```

### Need to clean up manually?

```bash
# Return to main branch
git checkout main

# Delete test branches
git branch -D $(git branch | grep test-multi-module)

# Restore docs from backup
mv CHANGES.md.backup CHANGES.md
mv docs/modules.backup docs/modules
```

---

## 📊 Performance Benchmarks

Expected timings:
```
1 module:  < 100ms
4 modules: < 200ms
5 modules: < 300ms
10 modules: < 500ms
```

Measure actual performance:
```bash
time .claude/hooks/auto-doc-sync/test-multi-module.sh
```

---

## 🎯 What Gets Tested

| Component | Test Coverage |
|-----------|---------------|
| Module Detection | ✅ 4, 5, 1 module scenarios |
| CHANGES.md Update | ✅ All modules listed |
| Module Docs | ✅ Created/updated per module |
| CONTEXT.md | ✅ Cross-module summary |
| Breaking Changes | ✅ Detection and flagging |
| Relationships | ✅ Module dependencies |
| Performance | ✅ Sub-500ms execution |
| Cleanup | ✅ No test artifacts left |

---

## 💡 Using Results

After tests pass, you can confidently:
- Commit changes across multiple modules
- Trust hook to detect all affected areas
- Rely on auto-generated docs for team sync
- Use /sync to see cross-module impact

---

## 📝 Manual Verification

If you want to verify manually without running script:

```bash
# 1. Make test commit
touch lib/core/theme/test.dart
touch lib/features/widgets/buttons/test.dart
git add .
git commit -m "test: multi-module"

# 2. Run hook manually
echo '{"tool_name":"Bash","tool_input":{"command":"git commit"}}' | \
  node .claude/hooks/auto-doc-sync/auto-doc-sync.js

# 3. Check outputs
cat CHANGES.md | head -30
ls docs/modules/
cat docs/CONTEXT.md

# 4. Cleanup
git reset HEAD~1
git clean -fd
```

---

## 🔗 Related Docs

- [TEST_MULTI_MODULE.md](./TEST_MULTI_MODULE.md) - Detailed test scenarios
- [auto-doc-sync.js](./auto-doc-sync.js) - Hook implementation
- [/sync command](../../commands/sync/sync.md) - How to view results

---

**Happy Testing! 🧪**
