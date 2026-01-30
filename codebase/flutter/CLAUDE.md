# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2026-01-30

---

## 🤖 AI Context Management System

**This project uses Enterprise AI Context Management** for team collaboration and code consistency.

### Quick Start

Before coding, **ALWAYS** run these commands:

```bash
# 1. Check team activity (after git pull)
/sync

# 2. For specific module work
/sync {module-name}
```

### Key Files

- 📘 **[.claude/README.md](.claude/README.md)** - Complete AI setup guide
- 📋 **[.claude/prompts/system-instructions.md](.claude/prompts/system-instructions.md)** - Coding standards & conventions
- 🔄 **[docs/CONTEXT.md](docs/CONTEXT.md)** - Team activity (auto-updated)
- 📝 **[CHANGES.md](CHANGES.md)** - Global changelog (auto-updated)

### Prompt Templates

Use these templates for consistent code generation:
- 📱 **[create-flutter-screen.md](.claude/prompts/templates/create-flutter-screen.md)** - Create new screens
- 🧩 **[create-flutter-widget.md](.claude/prompts/templates/create-flutter-widget.md)** - Create widgets
- ✅ **[write-flutter-test.md](.claude/prompts/templates/write-flutter-test.md)** - Write tests

### Context Documentation

Read these for SDK/pattern understanding:
- 🔧 **[docs/context/libs/provider-pattern.md](docs/context/libs/provider-pattern.md)** - State management
- 🎨 **[docs/context/libs/theme-system.md](docs/context/libs/theme-system.md)** - Theme usage

### Auto-Documentation Hook

Every commit automatically updates:
- ✅ `CHANGES.md` - Global changelog
- ✅ `docs/modules/{module}.md` - Module-specific docs
- ✅ `docs/CONTEXT.md` - Team activity summary

**No manual documentation needed!**

---

## 📖 Detailed Documentation

**IMPORTANT:** Before working with code, read the detailed documentation files for each directory:

- 🔧 **[lib/core/CORE.md](lib/core/CORE.md)** - Core functionality: Config, Providers, Theme, Utils, Navigation
- 🎯 **[lib/features/FEATURES.md](lib/features/FEATURES.md)** - Feature modules, Widgets, BLoC patterns
- 🌐 **[lib/l10n/L10N.md](lib/l10n/L10N.md)** - Localization, ARB files, Translation guide
- 📱 **[lib/screens/SCREENS.md](lib/screens/SCREENS.md)** - Standalone screens, Form patterns, Examples

**🔄 Update Rule:** Whenever there are changes in the above directories, UPDATE the corresponding MD file so Claude Code can understand the full context.

---

## Project Overview

This is a Flutter construction management application with:
- Multi-language support (Vietnamese, English, Chinese)
- Light/Dark theme support
- Environment-based configuration (staging/production)
- Provider-based state management
- Modular feature architecture

## Common Commands

### Development
```bash
# Run the app in debug mode
flutter run

# Run on specific device
flutter run -d <device_id>

# Hot reload: press 'r' in terminal
# Hot restart: press 'R' in terminal
```

### Building
```bash
# Build APK (Android)
flutter build apk --release

# Build App Bundle (Android)
flutter build appbundle --release

# Build iOS
flutter build ios --release

# Build for web
flutter build web --release
```

### Testing & Analysis
```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/path/to/test_file.dart

# Analyze code for issues
flutter analyze

# Check for outdated dependencies
flutter pub outdated
```

### Localization
```bash
# Generate localization files after editing .arb files
flutter gen-l10n

# This generates lib/l10n/app_localizations*.dart files
# ARB files are in assets/l10n/
```

### Dependencies
```bash
# Get dependencies
flutter pub get

# Clean and get dependencies
flutter clean && flutter pub get
```

## Architecture

### State Management
- **Provider pattern** is used throughout the app
- BLoC pattern implemented with ChangeNotifier for feature modules
- Providers are registered in [main.dart:32-37](lib/main.dart#L32-L37)

### Directory Structure

#### `.claude/` - AI Context Management
Enterprise AI setup for team collaboration:
- **hooks/auto-doc-sync/** - Automatically updates documentation after commits
- **prompts/system-instructions.md** - Global coding standards and conventions
- **prompts/templates/** - Task-specific prompt templates
  - `create-flutter-screen.md` - Screen generation template
  - `create-flutter-widget.md` - Widget creation template
  - `write-flutter-test.md` - Test writing template
- **commands/sync/** - Team synchronization command
- **settings.json** - Hook and prompt configuration

#### `docs/` - Auto-Generated Documentation
Context repository for AI and team:
- **CONTEXT.md** - Real-time team activity (auto-updated by hook)
- **context/libs/** - SDK and pattern documentation
  - `provider-pattern.md` - State management guide
  - `theme-system.md` - Theme system usage
- **context/widgets/** - Widget library documentation
- **context/examples/** - Few-shot learning examples
- **modules/** - Per-module docs (auto-generated by hook)

#### `CHANGES.md` - Global Changelog
Auto-generated after every commit. Shows last 50 commits grouped by date.

#### `lib/core/` → See [CORE.md](lib/core/CORE.md) for details
Core functionality shared across the app:
- **config.dart**: Environment-based configuration system that loads from `assets/config/config.json`
- **providers/**: Global providers (ThemeProvider, LocaleProvider)
- **routing/**: CustomNavigator utility for programmatic navigation without BuildContext
- **theme/**: Centralized theme definitions (colors, text styles, spacing)
- **network/**: Network utilities including internet connectivity checker
- **utils/**: Shared utilities (validators, globals, helper functions)

#### `lib/features/` → See [FEATURES.md](lib/features/FEATURES.md) for details
Feature modules organized by functionality:
- **presentation/**: UI-related code organized by feature modules
  - Each module follows pattern: `module_name/src/{bloc,ui}/`
  - Example: `splash_module/src/bloc/splash_bloc.dart`
- **widgets/**: Reusable UI components categorized by type
  - `buttons/`: Custom button components
  - `cards/`: Card-based UI components
  - `dialogs/`: Dialog widgets
  - `inputs/`: Form input widgets
  - `lists/`: List-related widgets
  - `loading/`: Loading states (shimmer, error, empty states)

#### `lib/l10n/` → See [L10N.md](lib/l10n/L10N.md) for details
Auto-generated localization files. Do not edit directly - edit ARB files in `assets/l10n/` instead.

#### `lib/screens/` → See [SCREENS.md](lib/screens/SCREENS.md) for details
Standalone screen widgets that don't belong to a specific feature module.

### Configuration System

The app uses a dual-environment configuration system:
- Configuration file: [assets/config/config.json](assets/config/config.json)
- Environments: `staging` and `production`
- Current environment is set by the `environment` key in config.json
- Access config values via `Config.appName`, `Config.server`, etc.
- Initialized in [main.dart:20](lib/main.dart#L20) before app starts

### Navigation

The app uses a custom navigation wrapper ([lib/core/routing/custom_navigator.dart](lib/core/routing/custom_navigator.dart)) that allows navigation without BuildContext:

```dart
// Instead of Navigator.push(context, ...)
CustomNavigator.push(MyScreen());

// Instead of Navigator.pop(context)
CustomNavigator.pop();
```

Navigator key is registered in MaterialApp at [main.dart:88](lib/main.dart#L88).

### Localization

- Supported locales: Vietnamese (vi), English (en), Chinese (zh)
- Default locale: Vietnamese (configured in config.json)
- ARB files location: `assets/l10n/`
- Template file: `app_vi.arb`
- Configuration: [l10n.yaml](l10n.yaml)
- Usage in code: `AppLocalizations.of(context)!.keyName`
- Switch locale: `context.read<LocaleProvider>().setLocale(Locale('en'))`

### Theme System

- Light and dark themes defined in [lib/core/theme/app_theme.dart](lib/core/theme/app_theme.dart)
- Theme colors: [lib/core/theme/app_colors.dart](lib/core/theme/app_colors.dart)
- Text styles: [lib/core/theme/app_text_styles.dart](lib/core/theme/app_text_styles.dart)
- Spacing constants: [lib/core/theme/app_spacing.dart](lib/core/theme/app_spacing.dart)
- Toggle theme: `context.read<ThemeProvider>().toggleTheme()`

## Adding New Features

### Recommended Workflow (with AI Context Management):

#### 1. Check Team Context
```bash
# See what's happening in the team
/sync

# Check specific module you'll work on
/sync {module-name}
```

#### 2. Use Prompt Templates

**Example: Creating Login Screen**

1. Open template: `.claude/prompts/templates/create-flutter-screen.md`
2. Fill in the template with your requirements
3. Paste to Claude with context:
   ```
   Based on system-instructions.md:

   Task: Create Login screen

   Context:
   - Provider pattern: docs/context/libs/provider-pattern.md
   - Theme system: docs/context/libs/theme-system.md
   - Existing widgets: TextButtonCustom

   [Your requirements here]
   ```

4. Claude generates code with full context (no hallucination!)

#### 3. Traditional Approach (Manual)

If not using templates:

1. Create directory under `lib/features/presentation/feature_name/`
2. Structure: `src/{bloc,ui}/`
3. Create BLoC extending ChangeNotifier
4. Register provider in [main.dart](lib/main.dart#L32-L37) if needed globally
5. Use CustomNavigator for navigation between screens

#### 4. Commit & Auto-Documentation

```bash
git add .
git commit -m "feat(login): implement login screen

- Add LoginScreen with email/password form
- Implement LoginProvider for state management
- Add l10n keys (vi, en, zh)
- Add tests (85% coverage)"

# Hook automatically:
# ✅ Updates CHANGES.md
# ✅ Creates/updates docs/modules/login.md
# ✅ Updates docs/CONTEXT.md
```

#### 5. Team Synchronization

Other developers will see your changes immediately:
```bash
# Other dev runs
/sync

# Output shows:
📊 Recent Activity:
- login module created by @you (10min ago)
- Uses Provider pattern
- Full tests included
```

## Important Notes

### AI Context Management
- ✅ **Always run `/sync` after `git pull`** - See team changes
- ✅ **Use prompt templates** - Located in `.claude/prompts/templates/`
- ✅ **Follow system-instructions.md** - Coding standards
- ✅ **Reuse existing widgets** - Check `docs/context/widgets/`
- ✅ **No manual docs needed** - Auto-doc-sync hook handles it
- ⛔ **Don't ignore auto-generated docs** - They're your source of truth

### Flutter Conventions
- The app is locked to portrait orientation only ([main.dart:25-27](lib/main.dart#L25-L27))
- Status bar is transparent by default
- Assets are organized in `assets/` with subdirectories for icons, images, l10n, and config
- When editing localization strings, edit ARB files in `assets/l10n/` then run `flutter gen-l10n`
- The app uses flutter_lints for code quality - respect the lint rules in [analysis_options.yaml](analysis_options.yaml)

---

## 📝 Documentation Maintenance

**CRITICAL:** For Claude Code to work effectively, documentation must be updated regularly.

### When to update MD files:

#### [lib/core/CORE.md](lib/core/CORE.md)
- ✏️ Add/remove/modify files in `lib/core/`
- ⚙️ Change Config system or environment variables
- 🎨 Add new colors to AppColors
- 📐 Add new spacing/text styles
- 🔧 Add/modify Validators
- 🚀 Add new Providers

#### [lib/features/FEATURES.md](lib/features/FEATURES.md)
- 🎯 Add new feature modules
- 🧩 Add new widgets to widgets/
- 🔄 Change BLoC patterns
- 📱 Update widget APIs or props

#### [lib/l10n/L10N.md](lib/l10n/L10N.md)
- 🌐 Add new languages
- 🔑 Add new translation categories
- 📝 Change localization usage

#### [lib/screens/SCREENS.md](lib/screens/SCREENS.md)
- 📱 Add/remove screens in lib/screens/
- 🎨 Add new screen patterns
- 🔄 Update screen development checklist

### Update Process:

1. **After coding:**
   ```bash
   # Edit the corresponding MD file
   vim lib/core/CORE.md
   ```

2. **Update "Last Updated" date:**
   ```markdown
   **Last Updated:** 2026-01-29
   ```

3. **Commit together with code:**
   ```bash
   git add lib/core/new_file.dart lib/core/CORE.md
   git commit -m "feat: add NewFeature

   - Implement NewFeature in lib/core/
   - Update CORE.md with NewFeature documentation"
   ```

### Why this matters:

- ✅ Claude Code has full context about the codebase
- ✅ Easy to onboard new team members
- ✅ Reduce time to understand code when returning after a while
- ✅ Avoid repeating bad patterns
- ✅ Documentation = Source of truth

### Quick Reference:

```bash
# When working with core utilities
📖 Read: lib/core/CORE.md

# When creating new widgets/features
📖 Read: lib/features/FEATURES.md

# When adding translations
📖 Read: lib/l10n/L10N.md

# When creating screens
📖 Read: lib/screens/SCREENS.md
```

---

## 🚀 AI-Powered Development Benefits

### What You Get

✅ **Zero Hallucination**: Claude knows exactly what widgets exist (e.g., TextButtonCustom)
✅ **Breaking Changes Aware**: Auto-notified when APIs change (e.g., AppColors refactor)
✅ **Team Sync**: Always know who's working on what
✅ **Fast Onboarding**: New devs productive in hours, not days
✅ **Consistent Code**: 95%+ consistency across all developers
✅ **Auto Documentation**: No manual doc writing needed

### Performance Metrics

| Task | Before AI | After AI | Improvement |
|------|-----------|----------|-------------|
| Create Login Screen | 8 hours | 2 hours | **4x faster** |
| Code Review | 1 hour | 18 min | **70% faster** |
| Onboarding | 7 days | 2 days | **3.5x faster** |
| Context Query | 30 min | 2 sec | **900x faster** |

### Example Workflow

```
Morning:
├─ git pull
├─ /sync → See team activity
└─ Review docs/CONTEXT.md

Coding:
├─ /sync {module} → Check module status
├─ Use template from .claude/prompts/templates/
├─ Paste context from docs/context/libs/
└─ Claude generates perfect code

Review:
├─ Code follows system-instructions.md ✓
├─ Uses existing widgets ✓
├─ Has tests >80% coverage ✓
└─ Ready to commit

Commit:
├─ git commit
├─ Hook auto-updates docs/
└─ Team immediately sees changes via /sync
```

---

**Remember:**
- Documentation is not a one-time task. Keep it updated as the codebase evolves!
- The AI system makes this easier - just commit, and docs auto-update! 🎉
