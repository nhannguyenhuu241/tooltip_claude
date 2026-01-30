# MCP Prompts - Auto-Doc-Sync

MCP Server cung cấp **4 prompts** tự động tạo nội dung dựa trên tech stack và context của project.

## 📝 Available Prompts

### 1. `sync-and-review`
**Xem changes gần đây và recommendations để tránh conflicts**

#### Khi nào dùng:
- Sau khi `git pull`
- Trước khi bắt đầu code feature mới
- Muốn review team activity

#### Cách dùng:
```
User: Use prompt sync-and-review for this project
```

#### Output:
```markdown
# Team Sync & Code Review

## High-Risk Modules
- **widgets**: 19 commits in 24h - coordinate before changes
- **core-theme**: Breaking changes introduced

## Breaking Changes
⚠️ AppColors refactored - old `primaryColor` deprecated

## Dependency Updates
📦 Run: flutter pub get

## Recommendations
1. Check widgets module before modifying
2. Update color imports to new AppColors.*
3. Pull latest changes from main
```

---

### 2. `onboarding-guide`
**Tạo hướng dẫn onboarding cho dev mới**

#### Khi nào dùng:
- New developer join team
- Cần documentation cho onboarding
- Team mở rộng

#### Cách dùng:
```
User: Use prompt onboarding-guide
```

#### Output:
```markdown
# Onboarding Guide - Construction Project

## 🏗️ Project Overview

**Architecture**: Flutter with Provider pattern
**Tech Stack**: Dart, Flutter, Provider
**Modules**:
- core-theme: Theme system
- widgets: Reusable UI components
- splash: App initialization

## 📦 Setup Instructions

1. Install Flutter SDK
2. Clone repository
3. Run: flutter pub get
4. Run: flutter run

## 🔥 Recent Activity

- widgets module: High activity (19 commits)
- Breaking changes in core-theme
- New authentication flow added

## ✅ Best Practices

1. Use AppColors.* for all colors
2. Follow Provider pattern for state
3. Write tests for new features

## 🚀 Where to Start

1. Read docs/CONTEXT.md
2. Review widgets module docs
3. Fix issues labeled "good first issue"
```

---

### 3. `tech-stack-analysis`
**Phân tích tech stack và generate best practices cụ thể**

#### Khi nào dùng:
- Muốn biết best practices cho tech stack hiện tại
- Review architecture decisions
- Planning refactoring

#### Cách dùng:
```
User: Use prompt tech-stack-analysis
```

#### Output (Flutter example):
```markdown
# Tech Stack Analysis - Flutter Project

## Detected Stack

- **Primary**: Flutter
- **Languages**: Dart
- **Frameworks**: Flutter, Provider
- **State Management**: Provider

## Flutter Best Practices

### 1. State Management với Provider

✅ **DO**: Use ChangeNotifier cho complex state
```dart
class ThemeProvider extends ChangeNotifier {
  ThemeMode _mode = ThemeMode.light;

  void toggleTheme() {
    _mode = _mode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }
}
```

❌ **DON'T**: Use setState cho app-wide state

### 2. Theme System

✅ **DO**: Centralize colors in AppColors
```dart
static const Color primary = Color(0xFF2196F3);
```

❌ **DON'T**: Hardcode colors in widgets

### 3. Architecture

Recommended structure:
```
lib/
├── core/          # Theme, utils, config
├── features/      # Feature modules
│   ├── widgets/   # Reusable components
│   └── screens/   # App screens
└── l10n/          # Localization
```

## Security Considerations

1. **API Keys**: Never commit to Git, use .env
2. **Secure Storage**: Use flutter_secure_storage
3. **HTTPS**: Always use HTTPS for API calls

## Performance Tips

1. Use `const` constructors where possible
2. Lazy load heavy widgets with `ListView.builder`
3. Profile with DevTools before optimizing

## Testing Strategy

1. Unit tests: For business logic
2. Widget tests: For UI components
3. Integration tests: For user flows
```

---

### 4. `module-coordination`
**Check xem module nào cần coordinate trước khi code**

#### Khi nào dùng:
- Trước khi modify module
- Muốn biết ai đang làm module đó
- Check conflict risk

#### Cách dùng:
```
User: Use prompt module-coordination for widgets module
```

#### Output:
```markdown
# Module Coordination Check - widgets

## ⚠️ Conflict Risk: HIGH

The widgets module has **19 commits in the last 24 hours**.

## 👥 Active Developers

Based on recent commits:
- @mike: 12 commits (primary contributor)
- @sarah: 7 commits (theme integration)

## 📝 Recent Changes

### Last 24h:
1. Refactored PrimaryButton component
2. Added new TextFieldCustom variants
3. Updated theme integration

### Files Modified:
- lib/features/widgets/buttons/primary_button.dart
- lib/features/widgets/inputs/text_field_custom.dart
- ... and 14 more files

## 🤝 Coordination Needed: YES

**Recommendation**:
1. Check with @mike before modifying widgets
2. Review recent changes in widgets.md
3. Consider working on a different module if urgent
4. If must modify widgets, create feature branch and communicate

## ✅ Safe to Proceed: NO

High activity + multiple developers = High conflict risk.
Coordinate with team first.
```

---

## 🎯 Tech Stack Detection

Prompts tự động detect tech stack và customize nội dung:

### Flutter Projects
- Best practices cho Provider pattern
- Theme system với AppColors
- Widget architecture
- Localization patterns

### Node.js / TypeScript Projects
- Express.js patterns
- NestJS architecture
- React best practices
- Next.js SSR/SSG

### Python Projects
- Django patterns
- FastAPI async patterns
- Flask blueprints
- Type hints usage

### Generic Projects
- Git workflow
- Documentation standards
- Testing strategies
- Code review practices

## 🔧 Customization

Prompts tự động:
1. **Detect tech stack** từ project files
2. **Read CONTEXT.md** để hiểu current state
3. **Analyze module activity** cho coordination
4. **Generate language-specific** best practices

## 💡 Usage Examples

### Example 1: Daily Sync
```
Morning routine:
1. git pull
2. Use prompt sync-and-review
3. Check high-risk modules
4. Coordinate if needed
```

### Example 2: New Feature Planning
```
Before starting feature:
1. Use prompt module-coordination for [target-module]
2. Check conflict risk
3. Coordinate with active developers
4. Start coding
```

### Example 3: Onboarding New Dev
```
New developer joins:
1. Use prompt onboarding-guide
2. Share generated guide
3. Point to active modules
4. Suggest good first issues
```

## 🌐 Multi-Language Support

Tất cả prompts output bằng **Tiếng Việt** để team dễ đọc và communicate.

Nếu cần English output, có thể customize trong code hoặc request:
```
User: Use prompt sync-and-review in English
```

## 🚀 Future Prompts

Planned additions:
- `code-review-checklist`: Generate checklist cho PR review
- `architecture-decision`: Analyze architecture trade-offs
- `performance-audit`: Generate performance optimization guide
- `security-scan`: Security best practices cho tech stack

---

**Tất cả prompts tự động update dựa trên CONTEXT.md và real-time changes!**
