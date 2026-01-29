# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Anthropic Skills Repository** - a collection of example skills and agents for Claude Code. Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

## Architecture

### Directory Structure

```
tooltip_claude/
├── .claude/               # Core configuration
│   ├── settings.json
│   └── statusline.js
│
├── agents/                # 8 pre-configured agents (.md files)
│   ├── code-reviewer.md
│   ├── debugger.md
│   └── ... (database-admin, planner, researcher, etc.)
│
├── hooks/                 # 4 modular hooks (each in separate folder)
│   ├── scout-block/       # ⭐ Block heavy directories
│   │   ├── README.md
│   │   ├── scout-block.js
│   │   ├── scout-block.cjs
│   │   ├── scout-block.sh
│   │   └── scout-block.ps1
│   ├── dev-rules-reminder/
│   ├── discord-notify/
│   └── telegram-notify/
│
├── commands/              # 23 slash commands (modular folders)
│   ├── cook/              # /cook command
│   ├── fix/               # /fix + variants (fix:fast, fix:hard, etc.)
│   ├── plan/              # /plan + variants
│   └── ... (design, git, test, bootstrap, etc.)
│
├── skills/                # 7 skills + document-skills
│   ├── backend-development/
│   ├── frontend-development/
│   ├── mobile-development/
│   ├── databases/
│   ├── web-frameworks/
│   ├── debugging/
│   ├── research/
│   └── document-skills/   # PDF, DOCX, PPTX, XLSX (built-in)
│
├── assets/                # Screenshots for documentation
├── integrate.sh           # Auto-integration script
├── README.md              # Main documentation
├── INTEGRATION_GUIDE.md   # Integration guide
└── NETWORK_GUIDE.md       # Network/proxy setup
```

**Key Points:**
- **Modular design**: Each hook and command in its own folder with README
- **Easy distribution**: Download individual components
- **Self-documented**: Each folder contains usage instructions

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
