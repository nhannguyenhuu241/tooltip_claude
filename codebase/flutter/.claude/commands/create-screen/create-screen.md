---
command: create-screen
description: Tự động phân tích requirements và tạo Flutter screen với plan chi tiết
---

# Create Screen Command

Tự động tạo Flutter screen với workflow phân tích và implementation plan.

## Usage

```bash
/create-screen <requirements>
```

**Example:**
```bash
/create-screen Login screen với email/password, remember me, OAuth2 Google/Facebook
```

---

## Workflow Tự Động

Khi bạn chạy command này, Claude sẽ:

### Bước 1: Phân Tích Requirements (Automatic)

```markdown
📋 REQUIREMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: "Login screen với email/password, remember me, OAuth2 Google/Facebook"

🔍 Extracted Requirements:
├─ Screen Type: Authentication (Login)
├─ Form Fields:
│  ├─ Email (TextFormField với validation)
│  └─ Password (PasswordField với toggle visibility)
├─ Features:
│  ├─ Remember me checkbox
│  ├─ OAuth2 Google login
│  ├─ OAuth2 Facebook login
│  └─ Forgot password link (inferred)
├─ State Management: Provider (LoginProvider)
├─ Navigation:
│  ├─ Success → /home
│  └─ Forgot password → /forgot-password
└─ Localization: vi, en, zh

📊 Complexity: Medium (4-6 hours traditional, 1-2 hours with AI)
```

---

### Bước 2: Context Discovery (Automatic)

```markdown
🔍 CONTEXT DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking existing codebase...

✅ Found Existing Resources:
├─ Widgets:
│  ├─ TextButtonCustom (lib/features/widgets/buttons/)
│  ├─ PasswordField (lib/features/widgets/inputs/)
│  └─ CheckboxCustom (lib/features/widgets/inputs/)
│
├─ Patterns:
│  ├─ Provider pattern (docs/context/libs/provider-pattern.md)
│  ├─ Theme system (docs/context/libs/theme-system.md)
│  └─ Form validation (lib/core/utils/validators.dart)
│
├─ Similar Modules:
│  └─ None found (this is the first auth module)
│
└─ API Endpoints:
   └─ POST /api/auth/login (inferred, needs confirmation)

⚠️ Missing Components:
├─ OAuth2 integration (needs package: google_sign_in, flutter_facebook_auth)
└─ Biometric auth (optional enhancement)
```

---

### Bước 3: Implementation Plan (Automatic)

```markdown
📝 IMPLEMENTATION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: Project Setup (5 minutes)
├─ Add dependencies:
│  ├─ google_sign_in: ^6.2.1
│  └─ flutter_facebook_auth: ^7.1.1
├─ Run: flutter pub get
└─ Update AndroidManifest.xml và Info.plist

Phase 2: File Structure (Auto-generated)
lib/features/presentation/login_module/
├── src/
│   ├── ui/
│   │   └── login_screen.dart
│   ├── provider/
│   │   └── login_provider.dart
│   ├── models/
│   │   ├── login_state.dart
│   │   └── oauth_provider.dart
│   └── services/
│       └── oauth_service.dart
└── test/
    ├── login_screen_test.dart
    ├── login_provider_test.dart
    └── oauth_service_test.dart

Phase 3: Code Generation (10 minutes)
├─ LoginScreen widget
│  ├─ Email TextFormField với Validators.email
│  ├─ PasswordField với visibility toggle
│  ├─ Remember me checkbox
│  ├─ Login button (TextButtonCustom)
│  ├─ OAuth buttons (Google, Facebook)
│  └─ Forgot password link
│
├─ LoginProvider
│  ├─ State: idle, loading, success, error
│  ├─ login(email, password) method
│  ├─ loginWithGoogle() method
│  ├─ loginWithFacebook() method
│  └─ Error handling
│
├─ OAuthService
│  ├─ Google Sign-In integration
│  └─ Facebook Login integration
│
└─ Models
   ├─ LoginState (idle, loading, success, error)
   └─ OAuthProvider enum

Phase 4: Localization (Auto-generated)
lib/l10n/
├─ app_vi.arb
│  ├─ "login": "Đăng nhập"
│  ├─ "email": "Email"
│  ├─ "password": "Mật khẩu"
│  ├─ "rememberMe": "Ghi nhớ đăng nhập"
│  ├─ "forgotPassword": "Quên mật khẩu?"
│  ├─ "loginWithGoogle": "Đăng nhập với Google"
│  └─ "loginWithFacebook": "Đăng nhập với Facebook"
│
├─ app_en.arb (English translations)
└─ app_zh.arb (Chinese translations)

Phase 5: Testing (Auto-generated)
├─ Unit Tests (login_provider_test.dart)
│  ├─ test('successful email login')
│  ├─ test('failed login with invalid credentials')
│  ├─ test('successful Google OAuth login')
│  ├─ test('successful Facebook OAuth login')
│  └─ test('error handling')
│
└─ Widget Tests (login_screen_test.dart)
   ├─ testWidgets('renders all fields')
   ├─ testWidgets('validates email format')
   ├─ testWidgets('toggles password visibility')
   ├─ testWidgets('submits form on button press')
   └─ testWidgets('navigates to home on success')

Expected Test Coverage: 87%
```

---

### Bước 4: Code Generation (Automatic)

```dart
// Claude generates all files based on plan

✅ Generated Files:
├─ login_screen.dart (342 lines)
├─ login_provider.dart (156 lines)
├─ login_state.dart (45 lines)
├─ oauth_service.dart (89 lines)
├─ login_screen_test.dart (234 lines)
├─ login_provider_test.dart (187 lines)
└─ l10n updates (3 files)

Total: 7 files, ~1,053 lines of code
Time saved: 6 hours → 15 minutes
```

---

### Bước 5: Validation Checklist (Automatic)

```markdown
✅ QUALITY VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code Quality:
✅ Follows system-instructions.md
✅ Uses existing widgets (TextButtonCustom, PasswordField)
✅ Provider pattern implemented correctly
✅ AppColors and AppTextStyles used
✅ Material 3 design compliance

Functionality:
✅ Email/password login
✅ Google OAuth integration
✅ Facebook OAuth integration
✅ Remember me functionality
✅ Forgot password navigation
✅ Form validation
✅ Loading states
✅ Error handling

Testing:
✅ Unit tests (>85% coverage)
✅ Widget tests (all interactions)
✅ Error scenario tests
✅ OAuth flow tests

Localization:
✅ Vietnamese translations
✅ English translations
✅ Chinese translations

Security:
✅ Password obscured by default
✅ No hardcoded credentials
✅ Secure token storage (needs SharedPreferences)
✅ Input validation

Performance:
✅ Stateless widgets where possible
✅ Const constructors used
✅ No unnecessary rebuilds
```

---

### Bước 6: Next Steps (Automatic)

```markdown
🚀 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Review Generated Code
   ├─ Check login_screen.dart for UI correctness
   ├─ Verify login_provider.dart logic
   └─ Review OAuth integration

2. Configure OAuth
   ├─ Google:
   │  ├─ Create project in Google Cloud Console
   │  ├─ Enable Google Sign-In API
   │  └─ Add SHA-1 fingerprint (Android)
   │
   └─ Facebook:
      ├─ Create app in Facebook Developers
      ├─ Add Android/iOS platforms
      └─ Configure OAuth redirect URLs

3. Test Implementation
   ├─ Run: flutter test
   ├─ Manual test: Email/password login
   ├─ Manual test: Google OAuth
   └─ Manual test: Facebook OAuth

4. Commit Changes
   ├─ git add .
   ├─ git commit -m "feat(login): implement login with OAuth"
   └─ Hook auto-updates docs/

5. Documentation (Auto-updated by hook)
   ✅ CHANGES.md
   ✅ docs/modules/login.md
   ✅ docs/CONTEXT.md
```

---

## Command Options

### Basic Usage
```bash
/create-screen Login với email/password
```

### With Detailed Requirements
```bash
/create-screen Login screen với:
- Email/password authentication
- Remember me checkbox
- OAuth2 (Google, Facebook, Apple)
- Biometric auth (fingerprint, face ID)
- Forgot password flow
- Auto-redirect if already logged in
```

### With API Specification
```bash
/create-screen Login screen

API: POST /api/v1/auth/login
Request: { email, password, rememberMe }
Response: { token, refreshToken, user }
Errors: 401 (invalid), 429 (rate limit)
```

### With Design Reference
```bash
/create-screen Login screen

Design: Material 3 với brand colors
- Elevated card cho form
- Gradient background
- Animated loading states
- Responsive (mobile + tablet)

Figma: [link]
```

---

## Advanced Features

### Auto-Detection

Command tự động phát hiện:
- ✅ Existing widgets có thể reuse
- ✅ Similar patterns trong codebase
- ✅ Required dependencies
- ✅ Breaking changes cần avoid
- ✅ Team conventions từ docs/

### Smart Suggestions

```markdown
💡 SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on codebase analysis:

1. Use TextButtonCustom for login button
   └─ Already exists in lib/features/widgets/buttons/

2. Add loading shimmer
   └─ ShimmerLoading available in lib/features/widgets/loading/

3. Consider adding biometric auth
   └─ Package available: local_auth

4. Rate limiting
   └─ Prevent brute force attacks (429 error handling)

5. Auto-fill support
   └─ Use AutofillGroup for better UX
```

---

## Integration with Existing Tools

### Works with /sync
```bash
# Before creating
/sync auth

# Check if anyone is working on similar feature
# Avoid conflicts
```

### Works with /review
```bash
# After generation
/review

# Automatic code review of generated code
```

### Works with Auto-Doc-Sync
```bash
# After commit
# Hook auto-updates:
# - CHANGES.md
# - docs/modules/login.md
# - docs/CONTEXT.md
```

---

## Output Format

Command outputs structured markdown:

```markdown
# Login Screen - Implementation Report

## Summary
- Screen: LoginScreen
- Provider: LoginProvider
- Files Generated: 7
- Lines of Code: 1,053
- Estimated Time Saved: 5h 45min
- Test Coverage: 87%

## Files Created
[List of all files with sizes]

## Dependencies Added
[List of new packages]

## Configuration Required
[Setup steps for OAuth, etc.]

## Testing Instructions
[How to test the feature]

## Documentation Updated
[Auto-generated docs]

## Next Steps
[What to do next]
```

---

## Best Practices

### ✅ Do's

```bash
# 1. Provide clear, detailed requirements
/create-screen Login với tất cả features cần thiết

# 2. Run /sync first để check conflicts
/sync auth
/create-screen Login screen

# 3. Review generated code
/review

# 4. Test before commit
flutter test

# 5. Commit với message chuẩn
git commit -m "feat(login): implement login screen"
```

### ⛔ Don'ts

```bash
# ❌ Vague requirements
/create-screen Login

# ❌ Skip review
# Luôn review code generated!

# ❌ Commit without testing
# Chạy tests trước!
```

---

## Error Handling

Nếu command fail:

```markdown
❌ ERROR: Cannot create screen

Possible causes:
1. Unclear requirements → Provide more details
2. Missing dependencies → Run flutter pub get
3. Conflicting module → Check /sync first
4. Invalid screen name → Use PascalCase

Solutions:
1. Provide clearer requirements
2. Check existing modules
3. Verify dependencies installed
```

---

## Examples

### Example 1: Simple Login
```bash
/create-screen Login với email/password
```

### Example 2: Advanced Auth
```bash
/create-screen Login screen với:
- Email/password
- Google/Facebook/Apple OAuth
- Biometric (fingerprint/face)
- Remember me
- Forgot password
```

### Example 3: Dashboard
```bash
/create-screen Dashboard với:
- Header với user avatar
- Stats cards (4 widgets)
- Chart (line graph)
- Recent activities list
- Bottom navigation
```

### Example 4: Form Screen
```bash
/create-screen User Profile Edit với:
- Avatar upload
- Name, email, phone fields
- Date picker (birthday)
- Dropdown (gender)
- Multi-select (interests)
- Save/Cancel buttons
```

---

## FAQ

**Q: Command có tự động test không?**
A: Có! Generated code includes unit và widget tests.

**Q: Có thể customize generated code không?**
A: Có, code generated là starting point. Bạn có thể edit sau.

**Q: Command có work offline không?**
A: Không, cần Claude API connection.

**Q: Làm sao để tối ưu hóa output?**
A: Provide detailed requirements và reference existing patterns.

**Q: Command có tính phí không?**
A: Sử dụng Claude API tokens (như normal usage).

---

## See Also

- [/create-widget](../create-widget/create-widget.md) - Tạo widgets
- [/sync](../sync/sync.md) - Team synchronization
- [Template](../../prompts/templates/create-flutter-screen.md) - Manual template
- [System Instructions](../../prompts/system-instructions.md) - Coding standards
