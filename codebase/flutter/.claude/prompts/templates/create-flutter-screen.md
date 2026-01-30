# Task: Create Flutter Screen

Template for creating new screens in Construction Project.

## Context Required

- [ ] Screen name and purpose
- [ ] UI design/mockup or description
- [ ] State management approach (Provider recommended)
- [ ] API endpoints (if any)
- [ ] Navigation flow
- [ ] Required widgets/components

## Prompt Template

```
Based on system-instructions.md:

Task: Create {screen_name} screen for Construction Project

Context:
- Project: Construction Project (Flutter 3.8.1)
- State Management: Provider (docs/context/libs/provider-pattern.md)
- Theme System: docs/context/libs/theme-system.md
- Navigation: CustomNavigator (lib/core/routing/custom_navigator.dart)
- Existing Widgets: docs/context/widgets/

Screen Requirements:
{describe_ui_requirements}

API Integration (if any):
{api_endpoints_and_models}

Design Reference:
{figma_link_or_detailed_description}

Localization:
- Support: Vietnamese, English, Chinese
- Keys needed: {list_keys}

Generate:
1. Screen widget (Stateful/Stateless)
2. Provider class (if state management needed)
3. Models/DTOs (if API integration)
4. Navigation integration
5. Localization keys (.arb files)
6. Unit tests
7. Widget tests

Follow:
- Material 3 design
- Brand colors from AppColors
- Text styles from AppTextStyles
- Responsive layout (mobile/tablet)
- Reuse existing widgets from docs/context/widgets/
```

## Expected Output

```
lib/features/presentation/{screen_name}_module/
├── src/
│   ├── ui/
│   │   └── {screen_name}_screen.dart
│   ├── provider/
│   │   └── {screen_name}_provider.dart
│   └── models/
│       ├── {screen_name}_state.dart
│       └── {screen_name}_model.dart (if needed)
│
└── test/
    ├── {screen_name}_screen_test.dart
    └── {screen_name}_provider_test.dart

lib/l10n/
├── app_en.arb (updated)
├── app_vi.arb (updated)
└── app_zh.arb (updated)
```

## Example Usage

```
Based on system-instructions.md:

Task: Create Login screen for Construction Project

Context:
- Project: Construction Project (Flutter 3.8.1)
- State Management: Provider (docs/context/libs/provider-pattern.md)
- Theme System: docs/context/libs/theme-system.md
- Navigation: CustomNavigator
- Existing Widgets: TextButtonCustom

Screen Requirements:
- Email/password login form
- "Remember me" checkbox
- "Forgot password" link
- Google/Facebook SSO buttons
- Form validation
- Loading states
- Error handling with SnackBar

API Integration:
- POST /api/auth/login
- Body: { email, password }
- Response: { token, user }
- Error codes: 401 (invalid credentials), 400 (validation), 500 (server)

Design:
- Material 3 design
- Elevated card for form
- Primary color buttons
- Responsive (320px - 1920px)

Localization Keys:
- login, email, password, rememberMe, forgotPassword
- loginButton, invalidEmail, invalidPassword
- loginSuccess, loginFailed

Generate:
1. LoginScreen (Stateful widget)
2. LoginProvider (ChangeNotifier)
3. LoginState model
4. Navigation to /home on success
5. .arb files updated
6. Unit tests (>80% coverage)
7. Widget tests
```

## Quality Checklist

After generation, verify:
- [ ] Follows Material 3 design
- [ ] Uses AppColors and AppTextStyles
- [ ] Reuses existing widgets
- [ ] Has proper error handling
- [ ] Includes loading states
- [ ] Localization implemented
- [ ] Navigation integrated
- [ ] Tests written (>80% coverage)
- [ ] No linter warnings
- [ ] Responsive design
- [ ] Accessibility considered
