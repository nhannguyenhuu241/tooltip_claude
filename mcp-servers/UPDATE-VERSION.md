# 🔄 Hướng Dẫn Cập Nhật Version

## 📌 Khi nào cần update version?

### Patch (1.0.0 → 1.0.1) - Bug fixes
- Fix lỗi nhỏ
- Sửa typo trong docs
- Performance improvements nhỏ
- Không thay đổi API

### Minor (1.0.0 → 1.1.0) - New features
- Thêm tính năng mới (backward compatible)
- Thêm MCP tools mới
- Thêm prompts mới
- Cải thiện features hiện có

### Major (1.0.0 → 2.0.0) - Breaking changes
- Thay đổi API (breaking)
- Xóa features cũ
- Thay đổi cấu trúc lớn
- Cần user update code

## 🚀 Quy Trình Update Version (5 bước)

### Bước 1: Thực hiện thay đổi

```bash
# Edit code, fix bugs, add features
vim index.js
vim README.md
# ... make your changes
```

### Bước 2: Update CHANGELOG.md

```bash
vim CHANGELOG.md
```

**Thêm section mới:**

```markdown
## [1.0.1] - 2026-02-07

### Fixed
- Fixed database connection timeout issue
- Corrected Mermaid diagram syntax errors

### Changed
- Improved error messages
- Updated documentation

### Added
- New example for PostgreSQL connection
```

### Bước 3: Update version number

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major
```

**Lệnh này sẽ:**
- ✅ Update version trong `package.json`
- ✅ Tạo git commit tự động
- ✅ Tạo git tag (vd: `v1.0.1`)

### Bước 4: Publish lên npm

```bash
# Login (nếu chưa)
npm login

# Publish version mới
npm publish

# Verify
npm view auto-doc-sync-mcp versions
```

### Bước 5: Push lên GitHub

```bash
# Push code + tags
git push
git push --tags

# Tạo GitHub Release (optional)
# Go to: https://github.com/yourusername/package-name/releases/new
# Tag: v1.0.1
# Title: v1.0.1 - Bug Fixes
# Description: Copy from CHANGELOG.md
```

---

## 📦 Example: Update auto-doc-sync-mcp

### Scenario: Fix một bug (Patch release)

```bash
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/auto-doc-sync

# 1. Fix bug
vim index.js  # Fix the bug

# 2. Update CHANGELOG
vim CHANGELOG.md
# Add:
# ## [1.0.1] - 2026-02-07
# ### Fixed
# - Fixed session cleanup not working properly

# 3. Commit changes (không update version yet)
git add .
git commit -m "fix: session cleanup issue"

# 4. Update version và tạo tag
npm version patch
# → package.json: 1.0.0 → 1.0.1
# → git commit: "1.0.1"
# → git tag: v1.0.1

# 5. Publish
npm publish

# 6. Push to GitHub
git push
git push --tags

# 7. Verify
npm view auto-doc-sync-mcp
# → version: 1.0.1
```

### Scenario: Thêm feature mới (Minor release)

```bash
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/db-context-sync

# 1. Add new feature
vim index.js  # Add new MCP tool

# 2. Update docs
vim README.md  # Document new tool

# 3. Update CHANGELOG
vim CHANGELOG.md
# Add:
# ## [1.1.0] - 2026-02-07
# ### Added
# - New tool: `export_schema` - Export schema to JSON
# - Support for MongoDB schema scanning

# 4. Commit
git add .
git commit -m "feat: add MongoDB support and export_schema tool"

# 5. Update version
npm version minor
# → 1.0.0 → 1.1.0

# 6. Publish
npm publish

# 7. Push
git push && git push --tags
```

---

## ⚡ Quick Commands

### Patch Release (Bug fix)
```bash
# One-liner
npm version patch && npm publish && git push && git push --tags
```

### Minor Release (New feature)
```bash
# One-liner
npm version minor && npm publish && git push && git push --tags
```

### Major Release (Breaking change)
```bash
# One-liner
npm version major && npm publish && git push && git push --tags
```

---

## 🔍 Kiểm Tra Version

### Check version hiện tại
```bash
# Local
cat package.json | grep version

# On npm
npm view auto-doc-sync-mcp version
npm view db-context-sync-mcp version
```

### Check tất cả versions đã publish
```bash
npm view auto-doc-sync-mcp versions
npm view db-context-sync-mcp versions
```

### Check version nào đang được dùng
```bash
npm list -g auto-doc-sync-mcp
npm list -g db-context-sync-mcp
```

---

## 🎯 Best Practices

### ✅ DO:
- Update CHANGELOG.md trước khi publish
- Commit changes trước khi `npm version`
- Test locally trước khi publish
- Sử dụng semantic versioning đúng
- Push tags lên GitHub sau khi publish

### ❌ DON'T:
- Publish version mà chưa test
- Skip updating CHANGELOG
- Quên push tags lên GitHub
- Dùng major version cho bug fixes nhỏ
- Edit version trực tiếp trong package.json (dùng `npm version`)

---

## 📝 CHANGELOG Format

```markdown
# Changelog

## [Unreleased]
### Added
- Features đang develop

## [1.1.0] - 2026-02-07
### Added
- New feature A
- New feature B

### Changed
- Improved feature C

### Fixed
- Fixed bug D

## [1.0.1] - 2026-02-06
### Fixed
- Bug fix A
- Bug fix B

## [1.0.0] - 2026-02-06
### Added
- Initial release
```

---

## 🆘 Troubleshooting

### "Version already exists"
```bash
# Xóa tag local
git tag -d v1.0.1

# Xóa tag remote
git push origin :refs/tags/v1.0.1

# Tạo lại với version mới
npm version patch
```

### "Cannot publish over existing version"
```bash
# Check version hiện tại trên npm
npm view auto-doc-sync-mcp version

# Update lên version cao hơn
npm version patch  # hoặc minor/major
npm publish
```

### Publish nhầm version
```bash
# Deprecate version (không xóa được)
npm deprecate auto-doc-sync-mcp@1.0.1 "Buggy version, use 1.0.2 instead"

# Hoặc unpublish trong 72h đầu
npm unpublish auto-doc-sync-mcp@1.0.1
```

---

## 🎉 Summary

**Workflow nhanh:**

1. Make changes → `git commit`
2. Update CHANGELOG.md
3. `npm version patch/minor/major`
4. `npm publish`
5. `git push && git push --tags`

**Done!** ✅

Users sẽ update bằng:
```bash
npm update -g auto-doc-sync-mcp
npm update -g db-context-sync-mcp
```

---

**Made with ❤️ by NhanNH26**
