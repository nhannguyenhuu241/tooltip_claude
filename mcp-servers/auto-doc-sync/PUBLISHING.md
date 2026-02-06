# Publishing Guide for auto-doc-sync-mcp

## Pre-Publishing Checklist

### ✅ Package Preparation (COMPLETED)

- [x] Fixed naming inconsistency (`@isc` → `lexnguyen`)
- [x] Added repository, bugs, homepage URLs
- [x] Created comprehensive `.npmignore`
- [x] Added MIT LICENSE file
- [x] Created CHANGELOG.md
- [x] Added `.npmrc` for public access
- [x] Enhanced keywords for better discoverability
- [x] Added `files` field to package.json
- [x] All templates are present

### 📋 Pre-Publish Verification

Before publishing, verify:

```bash
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/auto-doc-sync

# 1. Check package structure
npm pack --dry-run

# 2. Verify all required files are included
tar -tzf *.tgz

# 3. Test the package locally
npm link

# 4. Test in a sample project
cd /path/to/test-project
npm link auto-doc-sync-mcp
```

## Publishing to npm

### Step 1: Login to npm

```bash
npm login
```

**Enter your credentials:**
- Username
- Password
- Email
- 2FA code (if enabled)

### Step 2: Publish the Package

```bash
cd /Volumes/SSDCUANHAN/claude-reporter-complete/Orther/tooltip_claude/mcp-servers/auto-doc-sync

# Publish with public access (required for scoped packages)
npm publish --access public
```

### Step 3: Verify Publication

```bash
# Check on npm registry
npm view auto-doc-sync-mcp

# Test installation
npm install -g auto-doc-sync-mcp
```

## Post-Publishing

### 1. Update GitHub Repository

If you haven't created the GitHub repository yet:

```bash
# Initialize git (if not already a git repo)
git init
git add .
git commit -m "chore: initial release v1.0.0"

# Create GitHub repo: https://github.com/new
# Name: auto-doc-sync-mcp
# Then push:
git remote add origin https://github.com/NhanNH26/auto-doc-sync-mcp.git
git branch -M main
git push -u origin main
```

### 2. Create GitHub Release

1. Go to: https://github.com/NhanNH26/auto-doc-sync-mcp/releases/new
2. Tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description: Copy content from CHANGELOG.md
5. Publish release

### 3. Update README Badges (Optional)

Add npm badges to README.md:

```markdown
[![npm version](https://badge.fury.io/js/%40lexnguyen%2Fauto-doc-sync-mcp.svg)](https://www.npmjs.com/package/auto-doc-sync-mcp)
[![npm downloads](https://img.shields.io/npm/dm/auto-doc-sync-mcp.svg)](https://www.npmjs.com/package/auto-doc-sync-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Version Management

### Semantic Versioning

- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features (backward compatible)
- **PATCH** (x.x.1): Bug fixes

### Publishing Updates

```bash
# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Publish update
npm publish --access public

# Push git tags
git push && git push --tags
```

## Troubleshooting

### Issue: "You must be logged in to publish packages"

**Solution:**
```bash
npm login
```

### Issue: "You do not have permission to publish"

**Solution:**
- Verify package name is available: `npm view auto-doc-sync-mcp`
- Ensure you're logged in: `npm whoami`
- Check scope ownership: You need to be a member of `lexnguyen` org

### Issue: "Package name too similar to existing package"

**Solution:**
- Choose a different name
- Or contact npm support if you own the similar package

### Issue: Missing files in published package

**Solution:**
- Check `.npmignore` isn't excluding needed files
- Verify `files` field in package.json includes all necessary files
- Test with: `npm pack --dry-run`

## Package URLs After Publishing

- **npm**: https://www.npmjs.com/package/auto-doc-sync-mcp
- **GitHub**: https://github.com/NhanNH26/auto-doc-sync-mcp
- **Issues**: https://github.com/NhanNH26/auto-doc-sync-mcp/issues

## Marketing & Promotion

### 1. Claude Community

Post in Claude community channels about the new MCP server.

### 2. Twitter/X

```
🚀 Just published auto-doc-sync-mcp - an MCP server for automatic documentation synchronization!

✨ Features:
- Auto-update CHANGES.md on commits
- AI-readable CONTEXT.md
- Multi-dev coordination
- Support for Flutter, Node.js, Python, Ruby, Go

npm install -g auto-doc-sync-mcp

#Claude #MCP #Documentation
```

### 3. GitHub Topics

Add these topics to your GitHub repo:
- `mcp`
- `model-context-protocol`
- `claude`
- `documentation`
- `git-hooks`
- `team-collaboration`
- `multi-dev`

## Support & Maintenance

### Responding to Issues

- Monitor: https://github.com/NhanNH26/auto-doc-sync-mcp/issues
- Label issues appropriately (bug, enhancement, question)
- Provide timely responses
- Link to relevant documentation

### Updates

- Fix critical bugs quickly (patch release)
- Collect feature requests for minor releases
- Plan breaking changes for major releases
- Keep CHANGELOG.md updated

## License

This package is published under the MIT License - see LICENSE file for details.
