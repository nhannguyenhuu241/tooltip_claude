---
command: sync
description: Đồng bộ và xem thay đổi trong team. Giúp dev hiểu context hiện tại và changes gần đây.
---

# Team Sync Command - Construction Project

Xem team activity và module changes để tránh conflicts.

## Usage

```
/sync                    # Xem all recent changes
/sync {module}           # Xem changes của module cụ thể
```

## Workflow

Claude sẽ tự động:
1. Read `CHANGES.md` - Global changelog
2. Read `docs/CONTEXT.md` - Team activity summary
3. Read `docs/modules/{module}.md` - Module docs (nếu chỉ định)
4. Analyze và summarize

## Example Output

### `/sync` - View All Changes

```markdown
📊 **Construction Project - Team Activity (Last 24h)**

## Recent Changes

### Modules Updated:
- **core-theme**: 3 commits by @sarah
- **widgets**: 4 commits by @mike
- **splash**: 1 commit by @john

### Top Contributors:
1. @mike - 4 commits (widgets)
2. @sarah - 3 commits (core-theme)
3. @john - 1 commit (splash)

### ⚠️ Attention:
- **core-theme** has breaking changes
- **widgets** module highly active - coordinate before coding

### 💡 Next Steps:
- Check docs/modules/core-theme.md for migration guide
- Review new widgets in docs/context/widgets/
```

### `/sync core-theme` - Module Deep Dive

```markdown
🔍 **core-theme Module Deep Dive**

## Current State
- Last updated: 2h ago by @sarah
- Status: Breaking changes introduced

## Recent Changes (this week):

### AppColors Refactored (2h ago)
- **Commit**: a1b2c3d by @sarah
- New brand colors added
- Old `primaryColor` → new `AppColors.primary`
- **Migration Required!**

### AppTextStyles Updated (3h ago)
- **Commit**: b2c3d4e by @sarah
- New typography scale
- Responsive font sizes

## Dependencies:
- Used by: All UI components
- Affects: Theme system, all screens

## Files Changed:
- lib/core/theme/app_colors.dart
- lib/core/theme/app_text_styles.dart

## ⚠️ Before You Code:
1. Update imports to use new `AppColors.*`
2. Replace old `primaryColor` usage
3. Review docs/context/libs/theme-system.md
4. Test on both light/dark themes
```

## When to Use

✅ **Use /sync when:**
- After `git pull` - See what changed
- Before starting new feature - Understand current state
- When debugging - Check recent changes
- During code review - Verify team activity

⛔ **Don't use /sync when:**
- Doing quick fixes (just check CHANGES.md manually)
- No git activity in 24h (nothing to sync)

## Integration with Hooks

This command works best with `auto-doc-sync` hook:
- Hook updates docs after each commit
- /sync reads those docs
- Always fresh context

## Files Read

| File | Purpose |
|------|---------|
| `CHANGES.md` | Global changelog (last 50 entries) |
| `docs/CONTEXT.md` | Team activity summary (24h) |
| `docs/modules/{module}.md` | Per-module documentation |
| `docs/context/libs/` | SDK/library docs |

## Advanced Usage

### Compare Multiple Modules

```
User: /sync
Claude: [Shows all changes]

User: Now deep dive into core-theme and widgets
Claude: [Reads both module docs and compares]
```

### Check Breaking Changes

```
User: /sync - any breaking changes?
Claude: [Searches for "breaking" in recent commits]
```

### Find Who Changed File

```
User: /sync - who modified app_colors.dart?
Claude: [Searches CHANGES.md for that file]
```

## Best Practices

1. **Run /sync after git pull** - Know what changed
2. **Run /sync before coding** - Avoid conflicts
3. **Check module docs** - Understand recent patterns
4. **Coordinate with team** - Based on activity shown

## Technical Notes

**Performance:**
- Fast: Only reads markdown files (no git commands)
- Lightweight: Docs are kept concise by hook
- Real-time: Hook updates docs on every commit

**Limitations:**
- Shows last 24h only (configurable in hook)
- Requires auto-doc-sync hook to be installed
- Only shows committed changes (not WIP)

## See Also

- `hooks/auto-doc-sync/` - Auto-documentation system
- `CHANGES.md` - Global changelog
- `docs/CONTEXT.md` - Team context
- `docs/modules/` - Module documentation
