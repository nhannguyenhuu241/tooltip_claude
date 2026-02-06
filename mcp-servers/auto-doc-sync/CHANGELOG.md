# Changelog

All notable changes to the Auto-Doc-Sync MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added
- Initial public release
- Core documentation sync functionality
- MCP Tools: `install`, `sync`, `configure_modules`, `deduplicate`, `run_hook`
- Multi-Dev Coordination features:
  - `check_conflicts` - Detect conflicts before editing files
  - `list_sessions` - View all active Claude sessions
  - `register_session` - Register current session for tracking
  - `cleanup_sessions` - Clean up stale sessions
  - `end_session` - End current session
- MCP Resources: CHANGES.md, CONTEXT.md, module docs
- MCP Prompts: `sync-and-review`, `onboarding-guide`, `tech-stack-analysis`, `module-coordination`
- Support for Flutter, Node.js, Python, Ruby, Go projects
- Auto-detection of tech stack and frameworks
- Git post-commit hook for automatic documentation updates
- Deduplication scripts for CHANGES.md and module docs
- Team context sync hooks
- WIP tracking and conflict detection hooks
- Remote sync checking
- Session management system

### Features
- ✅ Auto-update CHANGES.md after each commit
- ✅ Generate AI-readable CONTEXT.md with change categorization
- ✅ Module-based documentation system
- ✅ Deduplication prevention
- ✅ Dependency update warnings
- ✅ Multi-language support (Flutter, Node.js, Python, Ruby, Go)
- ✅ AI prompts auto-generated based on tech stack
- ✅ Real-time WIP tracking (who's editing what)
- ✅ Conflict detection before file edits
- ✅ Remote change detection
- ✅ Multi-Claude session coordination
- ✅ Automatic stale session cleanup

### Documentation
- Comprehensive README with installation and usage guide
- QUICKSTART guide for fast setup
- FEATURES_SUMMARY with complete feature list
- MULTI_DEV_COORDINATION guide for team collaboration
- PROMPTS guide explaining all available prompts
