# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code extension system** — a collection of skills, agents, hooks, and slash commands designed to be integrated into other projects via `integrate.sh` or manual copy. It is not a runnable application; it is a toolkit.

Documentation (README, INTEGRATION_GUIDE, etc.) is written in Vietnamese.

## Architecture

The four main component types follow a modular folder-per-component pattern:

- **Skills** (`skills/`): Domain knowledge packages. Each has a `SKILL.md` entry point with YAML frontmatter (`name`, `description` required). Subdirectories use `references/` for reference docs and `scripts/` for executable code. Claude activates relevant skills dynamically based on task context.
- **Agents** (`agents/`): Preconfigured specialist personas (8 total). Each is a `.md` file with YAML frontmatter (`name`, `description`, `model` fields). Commands like `/cook` orchestrate multiple agents (researcher → planner → ui-ux-designer → tester → code-reviewer → project-manager → docs-manager).
- **Commands** (`commands/`): Slash commands (23 total). Each folder contains markdown files with YAML frontmatter (`description`, `argument-hint`). Commands use `$ARGUMENTS` for user input. Variants are nested subdirectories (e.g., `fix/fast.md`, `fix/hard.md`).
- **Hooks** (`hooks/`): Pre/PostToolUse scripts. Each in its own folder with cross-platform implementations (.js, .cjs, .sh, .ps1).

## Active Hooks Configuration

Defined in `.claude/settings.json`:

1. **PreToolUse → Bash**: `scout-block.js` blocks commands accessing `node_modules`, `__pycache__`, `.git/`, `dist/`, `build/` (exit code 2 = block, 0 = allow)
2. **PostToolUse → Write|Edit**: `modularization-hook.js` runs after file writes/edits

## Key Conventions

- **Plan directory structure**: Commands like `/cook` and `/plan` create `plans/YYYYMMDD-HHmm-plan-name/` with `plan.md` (overview, ≤80 lines) and `phase-XX-phase-name.md` files for each phase.
- **Inter-agent communication**: Agents exchange reports via markdown files in `./plans/<plan-name>/reports/` using the naming format `YYMMDD-from-agent-name-to-agent-name-task-name-report.md`.
- **Command routing**: `/fix` acts as an intelligent router, analyzing issue keywords to delegate to specialized variants (`fix:types`, `fix:ui`, `fix:ci`, `fix:test`, `fix:logs`, `fix:hard`, `fix:fast`, `fix:parallel`).
- **Token efficiency**: Commands and agents emphasize concise output — "sacrifice grammar for the sake of concision."
- **Exit codes**: Hook scripts use 0 (allow/success) and 2 (block/error).

## Validating Components

Skills must have:
1. A `SKILL.md` file as entry point
2. `name` field in frontmatter matching the directory name
3. `description` field explaining when Claude should activate it

Commands must have:
1. YAML frontmatter with `description` field
2. `$ARGUMENTS` placeholder for user input

Agents must have:
1. YAML frontmatter with `name`, `description`, and `model` fields

## Integration

`integrate.sh <target-project>` copies skills (excluding document-skills), agents, hooks, and statusline into a target project's `.claude/` directory. It creates `settings.json.new` if the target already has settings to avoid overwriting.
