# ⚡ Quick Update Guide

## 🚀 Cách nhanh nhất để update package

### Option 1: Dùng UPDATE.sh Script (Khuyến nghị)

```bash
# auto-doc-sync-mcp
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/auto-doc-sync
./UPDATE.sh patch "fix: session cleanup issue"

# db-context-sync-mcp
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/db-context-sync
./UPDATE.sh minor "feat: add MongoDB support"
```

### Option 2: Manual (5 bước)

```bash
# 1. Commit changes
git add .
git commit -m "fix: your bug fix"

# 2. Update version
npm version patch  # hoặc minor/major

# 3. Publish
npm publish

# 4. Push
git push && git push --tags

# 5. Done! ✅
```

## 📊 Semantic Versioning

| Type | Example | Khi nào dùng |
|------|---------|--------------|
| **patch** | 1.0.0 → 1.0.1 | Bug fixes, typo fixes, docs update |
| **minor** | 1.0.0 → 1.1.0 | New features (backward compatible) |
| **major** | 1.0.0 → 2.0.0 | Breaking changes |

## 💡 Examples

### Bug Fix (Patch)
```bash
./UPDATE.sh patch "fix: connection timeout issue"
```

### New Feature (Minor)
```bash
./UPDATE.sh minor "feat: add support for MongoDB"
```

### Breaking Change (Major)
```bash
./UPDATE.sh major "breaking: change API structure"
```

## 🎯 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

Types:
- fix:      Bug fix
- feat:     New feature
- docs:     Documentation only
- style:    Formatting, missing semi colons, etc.
- refactor: Code refactoring
- perf:     Performance improvements
- test:     Adding tests
- chore:    Maintenance tasks
- breaking: Breaking changes
```

**Examples:**
```bash
fix: correct typo in README
feat: add new MCP tool for database export
docs: update installation instructions
breaking: change schema format to v2
```

## 📝 Don't Forget!

Sau khi update version:

1. ✅ Update `CHANGELOG.md` manually
2. ✅ Create GitHub Release
3. ✅ Verify on npm: `npm view package-name`
4. ✅ Test installation: `npm install -g package-name`

## 🔗 Useful Commands

```bash
# Check current version
cat package.json | grep version

# Check version on npm
npm view auto-doc-sync-mcp version
npm view db-context-sync-mcp version

# View all published versions
npm view auto-doc-sync-mcp versions

# Deprecate a version
npm deprecate package@version "Message"

# Unpublish (within 72h only)
npm unpublish package@version
```

## 🎉 That's it!

**Quick workflow:**
1. Make changes
2. Run `./UPDATE.sh patch/minor/major "message"`
3. Done! ✅

Users will update with:
```bash
npm update -g auto-doc-sync-mcp
npm update -g db-context-sync-mcp
```
