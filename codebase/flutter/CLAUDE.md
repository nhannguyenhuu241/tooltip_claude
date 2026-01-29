# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2026-01-29

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

When creating a new feature module:

1. Create directory under `lib/features/presentation/feature_name/`
2. Structure: `src/{bloc,ui}/`
3. Create BLoC extending ChangeNotifier
4. Register provider in [main.dart](lib/main.dart#L32-L37) if needed globally
5. Use CustomNavigator for navigation between screens

## Important Notes

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

**Remember:** Documentation is not a one-time task. Keep it updated as the codebase evolves!
