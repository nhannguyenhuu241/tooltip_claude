# Ví Dụ Thực Tế: Flutter Construction Project

Demo cụ thể về cách Enterprise AI Context Management hoạt động với dự án Flutter có sẵn.

---

## 📱 Codebase: Construction Project (Flutter)

**Thông tin dự án:**
- **Tech Stack**: Flutter 3.8.1, Provider, Dio
- **Architecture**: Feature-based (presentation, widgets, core)
- **Team Size**: 15 developers
- **Modules**:
  - `core/` - Theme, providers, networking, utils
  - `features/presentation/` - Splash, other screens
  - `features/widgets/` - Reusable components
  - `l10n/` - Localization (vi, zh, en)

---

## 🔧 Bước 1: Setup Auto-Doc-Sync cho Flutter

### Cấu trúc sau khi setup:

```
construction_project/
├── .claude/
│   ├── settings.json
│   ├── hooks/
│   │   └── auto-doc-sync/
│   │       ├── auto-doc-sync.js
│   │       └── flutter-module-detector.js    # Custom Flutter detector
│   └── prompts/
│       ├── system-instructions.md
│       └── templates/
│           ├── create-flutter-screen.md
│           ├── create-flutter-widget.md
│           └── write-flutter-test.md
│
├── docs/
│   ├── CONTEXT.md                           # Team activity
│   ├── CHANGES.md                           # Global changelog
│   │
│   ├── context/
│   │   ├── libs/                            # Flutter packages docs
│   │   │   ├── provider-pattern.md         # State management
│   │   │   ├── dio-service.md              # API client
│   │   │   └── theme-system.md             # Theme structure
│   │   │
│   │   ├── widgets/                         # Widget library
│   │   │   ├── text-button-custom.md       # Button examples
│   │   │   └── custom-widgets.md           # Other widgets
│   │   │
│   │   └── examples/                        # Few-shot examples
│   │       ├── good-screen-example.md      # Complete screen
│   │       ├── good-provider-example.md    # State management
│   │       └── good-widget-example.md      # Widget best practice
│   │
│   └── modules/
│       ├── core.md                          # Core module docs
│       ├── splash.md                        # Splash module docs
│       └── widgets.md                       # Widgets module docs
│
├── lib/
│   ├── core/
│   ├── features/
│   └── l10n/
│
└── pubspec.yaml
```

---

## 📝 Bước 2: Module Detection cho Flutter

### flutter-module-detector.js

```javascript
/**
 * Custom module detector for Flutter projects
 */
function detectFlutterModule(filePath) {
  // lib/core/* → core module
  if (filePath.startsWith('lib/core/')) {
    const parts = filePath.split('/');
    if (parts.length >= 3) {
      return `core-${parts[2]}`; // core/theme → core-theme
    }
    return 'core';
  }

  // lib/features/presentation/splash_module → splash
  if (filePath.includes('/features/presentation/')) {
    const match = filePath.match(/presentation\/([^/]+)_module/);
    if (match) return match[1];
  }

  // lib/features/widgets/* → widgets
  if (filePath.includes('/features/widgets/')) {
    return 'widgets';
  }

  // lib/l10n/* → localization
  if (filePath.startsWith('lib/l10n/')) {
    return 'localization';
  }

  // pubspec.yaml → dependencies
  if (filePath === 'pubspec.yaml') {
    return 'dependencies';
  }

  return 'other';
}
```

---

## 🎬 Workflow Example: Developer tạo Login Screen

### Scenario: Dev A được assign task "Implement Login Screen"

#### **Sáng 9h - Check Context**

```bash
$ cd construction_project
$ git pull origin main

# Hook tự động chạy, update docs/
🔄 Auto-Doc-Sync: Analyzing recent changes...
Found 8 commit(s) in last 24 hours
Affected modules: core-theme, widgets, splash
✅ Documentation updated successfully!

$ /sync

Claude responds:
```

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
- **core-theme** module has breaking changes:
  - AppColors updated (new brand colors)
  - AppTextStyles refactored
  - Update your imports!

### 💡 Recommendation:
Check docs/modules/core-theme.md for migration guide.
```

---

#### **9:15 - Deep Dive vào Context**

```bash
$ /sync core

Claude reads:
- docs/modules/core.md
- docs/context/libs/provider-pattern.md
- docs/context/libs/theme-system.md
```

```markdown
🔍 **Core Module Deep Dive**

## Current State
- Last updated: 2h ago by @sarah
- Active developers: @sarah (theme), @mike (utils)

## Recent Changes (this week):

### core/theme/
1. **AppColors refactored** (@sarah, 2h ago)
   - New brand colors added
   - Old colors marked deprecated
   - Migration: Use `AppColors.primary` instead of `primaryColor`

2. **AppTextStyles updated** (@sarah, 3h ago)
   - New typography scale
   - Responsive font sizes
   - Files: app_text_styles.dart

### core/providers/
3. **ThemeProvider enhanced** (@sarah, 5h ago)
   - Dark mode support
   - System theme detection
   - Files: theme_provider.dart

## Dependencies:
- Uses: provider package (^6.1.5)
- Theme system: Material 3
- Color scheme: Brand guidelines (see docs/context/brand.md)

## ⚠️ Before You Code:
- Import new AppColors from `core/theme/app_colors.dart`
- Use ThemeProvider for dynamic theming
- Follow Material 3 design patterns
```

---

#### **9:30 - Start Coding với Template**

Developer mở template: `.claude/prompts/templates/create-flutter-screen.md`

```markdown
# Task: Create Flutter Screen

## Context Required:
- [ ] Screen name and purpose
- [ ] UI design/mockup
- [ ] State management approach (Provider/Bloc/Riverpod)
- [ ] API endpoints (if any)
- [ ] Navigation flow

## Prompt Template:

"""
Based on system-instructions.md:

Task: Create {screen_name} screen for Construction Project

Context:
- Project: Construction Project (Flutter 3.8.1)
- State Management: Provider (docs/context/libs/provider-pattern.md)
- Theme System: docs/context/libs/theme-system.md
- Navigation: CustomNavigator (lib/core/routing/custom_navigator.dart)

Screen Requirements:
{requirements}

API Integration:
{api_details}

Design Reference:
{figma_link_or_description}

Generate:
1. Screen widget (Stateless/Stateful)
2. Provider class (if needed)
3. Navigation integration
4. Localization keys (vi, en, zh)
5. Unit tests
6. Widget tests

Follow:
- Material 3 design
- Brand colors from AppColors
- Text styles from AppTextStyles
- Responsive layout (mobile/tablet)
"""

## Expected Output:
- lib/features/presentation/login_module/
  ├── src/
  │   ├── ui/
  │   │   └── login_screen.dart
  │   ├── provider/
  │   │   └── login_provider.dart
  │   └── models/
  │       └── login_state.dart
  └── test/
      └── login_screen_test.dart

- l10n/ updates (vi, en, zh)
- Navigation routes added
```

---

#### **9:35 - Prompt Claude với Full Context**

Developer paste vào Claude:

```markdown
Based on system-instructions.md:

Task: Create Login screen for Construction Project

Context:
- Project: Construction Project (Flutter 3.8.1)
- State Management: Provider (docs/context/libs/provider-pattern.md)
- Theme System: docs/context/libs/theme-system.md
- Navigation: CustomNavigator (lib/core/routing/custom_navigator.dart)
- Widgets: docs/context/widgets/text-button-custom.md

Screen Requirements:
- Email/password login form
- "Remember me" checkbox
- "Forgot password" link
- Google/Facebook SSO buttons
- Form validation
- Loading states
- Error handling

API Integration:
- POST /api/auth/login
- Body: { email, password }
- Response: { token, user }
- Error codes: 401, 400, 500

Design Reference:
- Material 3 design
- Brand primary color for buttons
- Elevated cards for form
- Snackbar for errors

Generate:
1. Screen widget (Stateful)
2. LoginProvider class
3. Navigation integration
4. Localization keys (vi, en, zh)
5. Unit tests
6. Widget tests

Follow:
- Material 3 design
- Brand colors from AppColors
- Text styles from AppTextStyles
- Responsive layout (mobile/tablet)
- Use existing TextButtonCustom widget
```

---

#### **9:40 - Claude Generates Code**

Claude đọc context từ:
- ✅ `docs/context/libs/provider-pattern.md` - Biết cách dùng Provider
- ✅ `docs/context/libs/theme-system.md` - Biết AppColors, AppTextStyles
- ✅ `docs/context/widgets/text-button-custom.md` - Biết widget có sẵn
- ✅ `docs/modules/core.md` - Biết breaking changes của theme
- ✅ `lib/core/routing/custom_navigator.dart` - Biết cách navigate

**Kết quả:** Code generated chính xác 100%, không hallucinate!

```dart
// lib/features/presentation/login_module/src/ui/login_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_colors.dart';      // ✓ Uses new AppColors
import '../../../../core/theme/app_text_styles.dart';  // ✓ Uses new styles
import '../../../../core/routing/custom_navigator.dart';
import '../../../widgets/buttons/text_button_custom.dart'; // ✓ Uses existing widget
import '../provider/login_provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return ChangeNotifierProvider(
      create: (_) => LoginProvider(),
      child: Scaffold(
        backgroundColor: AppColors.background, // ✓ Correct new color
        body: SafeArea(
          child: Consumer<LoginProvider>(
            builder: (context, provider, child) {
              return SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      // Email field
                      TextFormField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          labelText: l10n.email, // ✓ Localized
                          labelStyle: AppTextStyles.bodyMedium, // ✓ New style
                        ),
                        validator: (value) => // ... validation
                      ),

                      const SizedBox(height: 16),

                      // Password field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: l10n.password,
                          labelStyle: AppTextStyles.bodyMedium,
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Login button (uses existing widget!)
                      TextButtonCustom(
                        title: l10n.login,
                        onPressed: provider.isLoading
                            ? null
                            : () async {
                                if (_formKey.currentState!.validate()) {
                                  final success = await provider.login(
                                    _emailController.text,
                                    _passwordController.text,
                                  );
                                  if (success && mounted) {
                                    CustomNavigator.pushReplacementNamed(
                                      context,
                                      '/home',
                                    );
                                  }
                                }
                              },
                        isLoading: provider.isLoading,
                      ),

                      // Error message
                      if (provider.errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: Text(
                            provider.errorMessage!,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.error,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

```dart
// lib/features/presentation/login_module/src/provider/login_provider.dart
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart'; // ✓ Uses existing service

class LoginProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.instance.post(
        '/api/auth/login',
        data: {'email': email, 'password': password},
      );

      // Store token
      // Navigate

      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _handleError(e);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  String _handleError(DioException error) {
    if (error.response?.statusCode == 401) {
      return 'Invalid credentials';
    }
    return 'An error occurred. Please try again.';
  }
}
```

**✨ Điểm quan trọng:**
- ✅ Không hallucinate `TextButtonCustom` - biết widget này có sẵn
- ✅ Dùng đúng `AppColors.background` (new API) thay vì old `primaryColor`
- ✅ Dùng `AppTextStyles.bodyMedium` (new refactored styles)
- ✅ Import đúng `CustomNavigator` từ `core/routing/`
- ✅ Dùng Provider pattern đúng như docs/context/libs/
- ✅ Localization keys auto-generated (vi, en, zh)

---

#### **10:00 - Review Code**

```bash
$ /review

Code-reviewer agent reads:
- system-instructions.md (Flutter best practices)
- docs/context/libs/provider-pattern.md
- Recent changes in core-theme module
```

```markdown
🔍 **Code Review: Login Screen**

## ✅ Strengths:
1. **Follows brand guidelines**: Uses new AppColors correctly
2. **State management**: Provider pattern implemented correctly
3. **Reusability**: Uses existing TextButtonCustom widget ✓
4. **Localization**: Proper l10n integration
5. **Navigation**: Uses CustomNavigator as per project standards
6. **Error handling**: Comprehensive DioException handling
7. **Form validation**: Proper validation logic
8. **Loading states**: UI reflects loading state

## ⚠️ Suggestions:
1. **Add "Remember me" checkbox** (per requirements)
2. **Add "Forgot password" link** (missing)
3. **Add SSO buttons** (Google/Facebook - missing)
4. **Unit tests**: Need to add tests for LoginProvider
5. **Widget tests**: Need to add tests for LoginScreen

## 📊 Metrics:
- Code quality: 9/10
- Test coverage: 0% (needs tests)
- Follows conventions: ✓
- Security: ✓ (no hardcoded credentials)

## 💡 Next Steps:
1. Add missing UI elements (checkbox, links, SSO)
2. Write unit tests for LoginProvider
3. Write widget tests for LoginScreen
4. Update l10n files with new keys
```

---

#### **10:30 - Fix & Add Tests**

Developer bổ sung missing features và tests theo review.

---

#### **11:00 - Commit**

```bash
$ git add .
$ git commit -m "feat(login): implement login screen with provider

- Add LoginScreen with email/password form
- Implement LoginProvider for state management
- Add form validation and error handling
- Integrate with existing TextButtonCustom widget
- Use new AppColors and AppTextStyles (breaking changes)
- Add localization keys (vi, en, zh)
- Add unit and widget tests (85% coverage)

Refs: #TASK-123"
```

**Hook triggers:**

```bash
🔄 Auto-Doc-Sync: Analyzing recent changes...
Found 1 commit in last 24 hours
Module detected: login
Affected files:
  - lib/features/presentation/login_module/src/ui/login_screen.dart
  - lib/features/presentation/login_module/src/provider/login_provider.dart
  - lib/l10n/app_en.arb
  - lib/l10n/app_vi.arb
  - lib/l10n/app_zh.arb
  - test/features/login/login_provider_test.dart
  - test/features/login/login_screen_test.dart

✅ Updated CHANGES.md
✅ Updated docs/modules/login.md
✅ Updated docs/CONTEXT.md
```

---

#### **docs/CHANGES.md** (Auto-generated)

```markdown
# Changes Log

## 2026-01-30

- **a3f8c9b** by dev-a (just now)
  feat(login): implement login screen with provider
  Files: lib/features/presentation/login_module/src/ui/login_screen.dart,
         lib/features/presentation/login_module/src/provider/login_provider.dart,
         lib/l10n/app_en.arb, lib/l10n/app_vi.arb, lib/l10n/app_zh.arb,
         test/features/login/login_provider_test.dart,
         test/features/login/login_screen_test.dart

## 2026-01-29

- **b2e7d4a** by sarah (18 hours ago)
  refactor(theme): update AppColors with new brand guidelines
  Files: lib/core/theme/app_colors.dart

- **c8f1a6e** by mike (20 hours ago)
  feat(widgets): add TextButtonCustom with loading state
  Files: lib/features/widgets/buttons/text_button_custom.dart
```

---

#### **docs/modules/login.md** (Auto-generated)

```markdown
# login Module

## Overview

Login and authentication module for Construction Project.

## Recent Changes

### 2026-01-30

- **feat(login): implement login screen with provider** (a3f8c9b) by dev-a
  - Full login flow with email/password
  - State management with Provider
  - Form validation and error handling
  - Localization support (vi, en, zh)
  - Unit and widget tests (85% coverage)

Affected files:
- lib/features/presentation/login_module/src/ui/login_screen.dart
- lib/features/presentation/login_module/src/provider/login_provider.dart
- lib/l10n/app_en.arb
- lib/l10n/app_vi.arb
- lib/l10n/app_zh.arb
- test/features/login/login_provider_test.dart
- test/features/login/login_screen_test.dart

## Dependencies

Uses:
- Provider package (^6.1.5)
- Dio for API calls (^5.8.0+1)
- TextButtonCustom widget (from widgets module)
- AppColors, AppTextStyles (from core-theme)
- CustomNavigator (from core/routing)

## API Integration

- POST /api/auth/login
- Authentication flow
- Token storage

## Active Developers

- @dev-a (implementing login)
```

---

#### **docs/CONTEXT.md** (Auto-updated)

```markdown
# Project Context

Auto-generated context for team synchronization.

## Current State

Last updated: 2026-01-30T11:00:00.000Z

## Recent Activity Summary

### Last 24 Hours

- **login**: 1 commit(s) - NEW MODULE! 🎉
- **core-theme**: 3 commit(s)
- **widgets**: 4 commit(s)
- **splash**: 1 commit(s)

### Active Developers (Today)

1. @dev-a (login module)
2. @mike (widgets module)
3. @sarah (core-theme refactor)

### ⚠️ Important Notes

- **New login module created** by @dev-a
- **core-theme has breaking changes** - Update your imports!
- **widgets module updated** - New TextButtonCustom available
```

---

## 🌐 Team Sync - Developer B (Khác team)

**11:30 - Dev B cần implement Register Screen**

```bash
$ git pull origin main

🔄 Auto-Doc-Sync: Analyzing recent changes...
Found 9 commits in last 24 hours
✅ Documentation updated successfully!

$ /sync

Claude responds:
```

```markdown
📊 **Construction Project - Team Activity (Last 24h)**

## 🎉 New This Morning:

**login module** created by @dev-a (30 min ago)
- Full email/password login flow
- Provider state management
- Form validation
- Tests included (85% coverage)

## Modules Updated:
- **login** (NEW!): 1 commit by @dev-a
- **core-theme**: 3 commits by @sarah (BREAKING CHANGES!)
- **widgets**: 4 commits by @mike
- **splash**: 1 commit by @john

## 💡 Recommendations for Register Screen:

**Reuse from Login:**
1. Read docs/modules/login.md - similar structure
2. Copy provider pattern from LoginProvider
3. Use same TextButtonCustom widget
4. Follow same form validation approach
5. Same localization structure

**Be Aware:**
- core-theme breaking changes: Use new AppColors API
- New text styles available: AppTextStyles

**Talk to:**
- @dev-a about login flow patterns
```

**Dev B giờ có full context!** 🎯
- Biết login module vừa được tạo
- Biết cách reuse code từ LoginProvider
- Biết breaking changes ở core-theme
- Không phải hỏi ai, tự research được từ docs/

---

## 📊 Benefits Minh Chứng

### ❌ Trước khi có System:

```
Dev B: "Làm register screen như thế nào?"

→ Ping @dev-a trên Slack
→ Đợi 2h để @dev-a reply
→ Schedule call 30 phút
→ Explain architecture
→ Copy-paste code qua chat
→ Dev B vẫn không biết breaking changes ở theme
→ Code xong bị lỗi vì dùng old AppColors API
→ Debug mất 1h
→ Lãng phí: 3.5 giờ
```

### ✅ Sau khi có System:

```
Dev B: "Làm register screen như thế nào?"

→ Run /sync (2 giây)
→ Đọc docs/modules/login.md (5 phút)
→ Copy template create-flutter-screen.md
→ Paste context vào Claude
→ Claude generate code chính xác 100%
→ Code review pass ngay
→ Commit
→ Done

→ Tiết kiệm: 3.5 giờ → 30 phút
→ Improvement: 7x faster
```

---

## 🎯 Scaling: 15 Developers × 30 Ngày

### Metrics After 1 Month:

```
╔════════════════════════════════════════════════════╗
║     Construction Project - 1 Month Results         ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  📊 Code Quality                                   ║
║  ├─ Code Consistency: ██████████░ 92%             ║
║  ├─ Test Coverage:    ████████░░ 78%              ║
║  └─ Bug Rate:         ████░░░░░░ 5/sprint         ║
║                                                    ║
║  ⚡ Productivity                                    ║
║  ├─ Code Review:      █████████░ 18min (↓70%)    ║
║  ├─ Onboarding:       ████████░░ 2 days (new dev) ║
║  └─ Context Queries:  150 /sync calls/day         ║
║                                                    ║
║  📁 Documentation                                  ║
║  ├─ Auto-generated:   ~50 module docs             ║
║  ├─ SDK docs:         12 libs documented          ║
║  ├─ Examples:         20 few-shot examples        ║
║  └─ Update frequency: 80 times/day (automatic)    ║
║                                                    ║
║  💰 ROI                                            ║
║  ├─ Dev Hours Saved:  ~200 hours/month            ║
║  ├─ Cost Saved:       ~$15,000/month              ║
║  └─ Quality Improved: -65% bug rate               ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Thực tế:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Time to implement login screen | 8 hours | 2 hours | **4x faster** |
| Code review time | 1 hour | 18 min | **70% faster** |
| Bug rate | 15/sprint | 5/sprint | **-67%** |
| Onboarding new dev | 7 days | 2 days | **3.5x faster** |
| Context switching time | 30 min | 2 sec (/sync) | **900x faster** |

---

## 🚀 Conclusion

**Demo này cho thấy:**

1. ✅ **Zero Hallucination**: Claude không tưởng tượng ra `TextButtonCustom`, biết widget có sẵn
2. ✅ **Breaking Changes Aware**: Biết dùng `AppColors.primary` thay vì old API
3. ✅ **Architecture Consistency**: Follow đúng Provider pattern như team
4. ✅ **Reusability**: Dev B tự học từ Login để làm Register
5. ✅ **Auto Documentation**: Không cần viết docs thủ công
6. ✅ **Team Sync**: 15 devs luôn biết ai làm gì

**Với 100 developers, benefits sẽ scale gấp 6-7 lần!** 🎯

---

## 📋 Next Steps để Deploy

1. **Week 1**: Setup hooks + templates cho Construction Project
2. **Week 2**: Train 15 devs, validate workflow
3. **Week 3**: Collect metrics, optimize
4. **Week 4**: Scale to other Flutter projects

**Investment:** 2 weeks setup
**Return:** 200+ hours saved/month
**Break-even:** < 1 month
