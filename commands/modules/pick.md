---
description: Manually pick folders to define module detection rules for auto-doc-sync
---

## Mission

Guide user through manually selecting folders to define custom module detection rules.

## Workflow

### 1. Show Directory Tree

Run Bash to list directories (max depth 3, excluding heavy dirs):

```bash
find . -type d -maxdepth 3 \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/__pycache__/*" \
  -not -path "*/.dart_tool/*" \
  | sort
```

On Windows, use:
```powershell
Get-ChildItem -Directory -Recurse -Depth 3 | Where-Object { $_.FullName -notmatch 'node_modules|\.git|dist|build|__pycache__|\.dart_tool' } | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\', '') } | Sort-Object
```

Display the result as a numbered list.

### 2. Interactive Module Definition

Use `AskUserQuestion` to ask the user to select folders for each module. Repeat until user is done:

**Question 1**: "Which folder should be a module? (pick from list above or type a path)"
- Show top directories as options
- Allow custom input

**Question 2**: "What name for this module?"
- Suggest: directory name (e.g., `src/auth` → suggest `auth`)

After each selection, confirm:
```
Added: auth → src/auth/**
```

Then ask: "Add another module?"
- "Yes, add more"
- "Done, save these rules"

### 3. Review and Save

Show complete list:
```
Your module rules:
1. auth → src/auth/**
2. api → src/api/**
3. ui → components/**

+ Built-in rules:
- tests → test/**, tests/**
- dependencies → package.json, pubspec.yaml
- docs → docs/**
```

Use `AskUserQuestion`: "Save these rules?"
- "Save"
- "Start over"
- "Cancel"

### 4. Write Config

Save to `.claude/hooks/auto-doc-sync/config.json`:

```json
{
  "modules": [
    { "name": "auth", "pattern": "src/auth/**" },
    { "name": "api", "pattern": "src/api/**" },
    { "name": "ui", "pattern": "components/**" },
    { "name": "tests", "pattern": "test/**" },
    { "name": "dependencies", "pattern": "package.json" },
    { "name": "docs", "pattern": "docs/**" }
  ],
  "updated": "<ISO timestamp>"
}
```

Confirm success and remind user rules take effect on next commit.
