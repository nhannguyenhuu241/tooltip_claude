# Construction Project - System Instructions

Global AI behavior rules for Construction Project Flutter development.

## Project Info

- **Name**: Construction Project
- **Platform**: Flutter 3.8.1
- **State Management**: Provider
- **Architecture**: Feature-based (presentation, widgets, core)
- **Localization**: Vietnamese, English, Chinese

---

## Coding Standards

### Flutter Best Practices

1. **Widget Organization**:
   - Prefer `StatelessWidget` unless state is required
   - Extract complex widgets into separate files
   - Use `const` constructors where possible
   - Follow widget composition pattern

2. **State Management**:
   - Use Provider for global state
   - ChangeNotifier for simple state
   - Follow single responsibility principle
   - Dispose controllers in `dispose()`

3. **Naming Conventions**:
   - Files: `snake_case` (e.g., `login_screen.dart`)
   - Classes: `PascalCase` (e.g., `LoginScreen`)
   - Variables: `camelCase` (e.g., `userName`)
   - Private members: prefix with `_`

4. **Project Structure**:
   ```
   lib/
   ├── core/           # Shared utilities, theme, providers
   ├── features/       # Feature modules
   │   ├── presentation/  # Screens
   │   └── widgets/       # Reusable widgets
   └── l10n/          # Localization
   ```

### Code Quality

1. **Testing**:
   - Unit tests for business logic
   - Widget tests for UI components
   - Integration tests for flows
   - Target coverage: **>80%**

2. **Error Handling**:
   - Use try-catch for async operations
   - Show user-friendly error messages
   - Log errors for debugging
   - Never ignore exceptions

3. **Performance**:
   - Minimize widget rebuilds
   - Use `const` constructors
   - Lazy load images
   - Profile before optimizing

4. **Security**:
   - Never commit API keys
   - Validate all user inputs
   - Sanitize data before display
   - Use HTTPS only

---

## Theme System

### Using AppColors

```dart
import 'package:construction_project/core/theme/app_colors.dart';

// Good
Container(color: AppColors.primary)

// Bad (don't use direct colors)
Container(color: Colors.blue)
```

### Using AppTextStyles

```dart
import 'package:construction_project/core/theme/app_text_styles.dart';

// Good
Text('Hello', style: AppTextStyles.headlineLarge)

// Bad
Text('Hello', style: TextStyle(fontSize: 24))
```

### Using ThemeProvider

```dart
import 'package:provider/provider.dart';
import 'package:construction_project/core/providers/theme_provider.dart';

final themeProvider = Provider.of<ThemeProvider>(context);
themeProvider.toggleTheme(); // Switch dark/light mode
```

---

## Localization

### Using l10n

```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

final l10n = AppLocalizations.of(context)!;
Text(l10n.login); // Auto-translated
```

### Adding New Keys

1. Add to `l10n.yaml`
2. Add translations in `lib/l10n/app_*.arb`:
   ```json
   {
     "login": "Đăng nhập",
     "@login": {
       "description": "Login button text"
     }
   }
   ```
3. Run `flutter pub get` to regenerate

---

## Navigation

### Using CustomNavigator

```dart
import 'package:construction_project/core/routing/custom_navigator.dart';

// Push new screen
CustomNavigator.pushNamed(context, '/login');

// Replace current screen
CustomNavigator.pushReplacementNamed(context, '/home');

// Pop
CustomNavigator.pop(context);
```

---

## API Integration

### Using Dio

```dart
import 'package:dio/dio.dart';

try {
  final response = await Dio().post(
    '/api/auth/login',
    data: {'email': email, 'password': password},
  );
  // Handle success
} on DioException catch (e) {
  if (e.response?.statusCode == 401) {
    // Handle unauthorized
  }
  // Handle other errors
}
```

---

## Widget Reusability

### Use Existing Widgets

Before creating new widgets, check `lib/features/widgets/`:
- `TextButtonCustom` - Custom button with loading state
- Other reusable components

Example:
```dart
import 'package:construction_project/features/widgets/buttons/text_button_custom.dart';

TextButtonCustom(
  title: l10n.login,
  onPressed: () => handleLogin(),
  isLoading: isLoading,
)
```

---

## Testing Requirements

### Unit Tests

```dart
test('should validate email correctly', () {
  final validator = EmailValidator();
  expect(validator.validate('test@example.com'), true);
  expect(validator.validate('invalid'), false);
});
```

### Widget Tests

```dart
testWidgets('LoginScreen displays email field', (tester) async {
  await tester.pumpWidget(
    MaterialApp(home: LoginScreen()),
  );

  expect(find.byType(TextFormField), findsNWidgets(2));
});
```

---

## Commit Message Format

```
type(scope): subject

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructure
- `test`: Add tests
- `docs`: Documentation
- `style`: Formatting

Example:
```
feat(login): implement login screen with provider

- Add LoginScreen with email/password form
- Implement LoginProvider for state management
- Add form validation and error handling
- Integrate with TextButtonCustom widget
- Add l10n keys (vi, en, zh)
- Add unit and widget tests (85% coverage)
```

---

## When to Create New Features

1. **Check existing code first**
2. **Reuse existing widgets/patterns**
3. **Follow feature-based structure**:
   ```
   lib/features/presentation/{feature}_module/
   ├── src/
   │   ├── ui/
   │   │   └── {feature}_screen.dart
   │   ├── provider/ (or bloc/)
   │   │   └── {feature}_provider.dart
   │   └── models/
   │       └── {feature}_state.dart
   └── test/
       └── {feature}_screen_test.dart
   ```

---

## Important Notes

1. ✅ **Always check docs/context/libs/** for SDK documentation
2. ✅ **Always check docs/modules/** for module updates
3. ✅ **Run /sync before coding** to get latest context
4. ✅ **Follow existing patterns** in the codebase
5. ✅ **Write tests** for all new features
6. ✅ **Use l10n** for all user-facing strings
7. ✅ **Test on multiple screen sizes**
8. ⛔ **Never commit .env files**
9. ⛔ **Never use hardcoded strings**
10. ⛔ **Never ignore linter warnings**

---

## Resources

- **Flutter Docs**: https://flutter.dev/docs
- **Provider Docs**: https://pub.dev/packages/provider
- **Material 3**: https://m3.material.io
- **Project Docs**: See `docs/` directory
