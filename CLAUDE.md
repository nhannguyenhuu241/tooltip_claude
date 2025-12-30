# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Anthropic Skills Repository** - a collection of example skills and agents for Claude Code. Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

## Architecture

### Directory Structure

```
.claude/
├── settings.json      # Claude Code configuration (statusline, hooks)
├── statusline.js      # Custom statusline with git/model/usage info
├── agents/            # Agent definition files (.md)
├── hooks/             # Pre/Post tool use hooks
└── skills/            # Skill definitions
    ├── document-skills/   # PDF, DOCX, PPTX, XLSX (built-in)
    ├── backend-development/
    ├── frontend-development/
    ├── mobile-development/
    ├── databases/
    ├── web-frameworks/
    ├── debugging/
    └── research/
```

### Skill Structure

Every skill requires a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: skill-name          # Required: lowercase, hyphen-separated
description: When to use  # Required: description for Claude
license: Apache-2.0       # Optional
allowed-tools: [...]      # Optional: pre-approved tools
---

# Instructions go here
```

### Hooks Configuration

The repository uses a PreToolUse hook (`scout-block.js`) that blocks Bash commands accessing heavy directories: `node_modules`, `__pycache__`, `.git/`, `dist/`, `build/`.

## Key Patterns

- **Skills** are self-contained in directories named after the skill
- **Reference files** go in `references/` or `resources/` subdirectories
- **Scripts** go in `scripts/` subdirectories (Python, JavaScript, shell)
- **Document skills** include OOXML schemas for Office format manipulation

## Validating Skills

Skills must have:
1. A `SKILL.md` file as entry point
2. `name` field matching the directory name
3. `description` field explaining when Claude should use it
