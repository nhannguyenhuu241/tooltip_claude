---
description: AI auto-analyze project structure and configure module detection rules for auto-doc-sync
argument-hint: [project-path]
---

## Mission

Analyze the project structure to generate module detection rules for auto-doc-sync. These rules determine how commits are categorized into per-module documentation files (`docs/modules/*.md`).

**Target project**: `$ARGUMENTS` (default: current working directory)

## Workflow

### 1. Scan Project Structure

- Use Glob to discover directories under common source roots: `src/`, `lib/`, `packages/`, `app/`, `features/`, `modules/`, `components/`, `services/`, `routes/`, `pages/`, `views/`, `controllers/`
- Exclude: `node_modules`, `.git`, `dist`, `build`, `__pycache__`, `.next`, `.nuxt`, `coverage`, `.dart_tool`
- Also check root-level files: `package.json`, `pubspec.yaml`, `requirements.txt`, `Gemfile`, `go.mod`
- Count files per directory to gauge module size

### 2. Generate Module Rules

Based on discovered structure, generate rules as `{name, pattern}` pairs:

**Pattern format**: glob-style paths
- `src/auth/**` matches all files under `src/auth/`
- `routes/**` matches all files under `routes/`
- `*.config.*` matches config files

**Always include these built-in rules**:
- `dependencies`: `package.json`, `pubspec.yaml`, `requirements.txt`, `Gemfile`, `go.mod`
- `tests`: `test/**`, `tests/**`, `__tests__/**`, `spec/**`
- `docs`: `docs/**`
- `config`: `*.config.*`

**For each discovered source directory** with 2+ files:
- Use the directory name as module name
- Use `<path>/**` as pattern

### 3. Present to User

Use `AskUserQuestion` to show the proposed rules and ask for confirmation:

```
Proposed module rules for auto-doc-sync:

1. auth → src/auth/**
2. api → src/api/**
3. components → src/components/**
4. tests → test/**
5. dependencies → package.json, pubspec.yaml
6. docs → docs/**
7. config → *.config.*

Apply these rules?
```

Options:
- "Apply as-is"
- "Let me modify first" → ask follow-up questions about what to change
- "Cancel"

### 4. Save Configuration

Write the approved rules to `.claude/hooks/auto-doc-sync/config.json`:

```json
{
  "modules": [
    { "name": "auth", "pattern": "src/auth/**" },
    { "name": "api", "pattern": "src/api/**" }
  ],
  "updated": "<ISO timestamp>"
}
```

- Create `.claude/hooks/auto-doc-sync/` directory if it doesn't exist
- If config.json already exists, show current rules and confirm overwrite

### 5. Confirm

Report to user:
- Number of module rules saved
- Path to config.json
- Remind: rules take effect on next `git commit` (if hook is installed) or when running `run_hook` MCP tool
