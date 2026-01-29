# Construction Project

A modern Flutter construction management application with multi-language support, featuring a clean architecture and comprehensive documentation.

[![Flutter Version](https://img.shields.io/badge/Flutter-3.8.1+-blue.svg)](https://flutter.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Overview

Construction Project is a production-ready Flutter application designed for construction management. Built with best practices in mind, it features a modular architecture, comprehensive state management, and full internationalization support.

## ✨ Features

- 🌍 **Multi-language Support** - Vietnamese, English, and Chinese
- 🎨 **Theme System** - Light and dark mode with automatic persistence
- ⚙️ **Environment Configuration** - Staging and production environments
- 🏗️ **Modular Architecture** - Feature-based organization with BLoC pattern
- 🎯 **Comprehensive Validation** - 20+ validators with formatting utilities
- 🧩 **Reusable Widgets** - Pre-built buttons, inputs, dialogs, cards, and more
- 📱 **Responsive Design** - Optimized for different screen sizes
- 🔐 **Type-safe Navigation** - Custom navigator without BuildContext dependency
- 📝 **Complete Documentation** - Detailed docs for every module

## 🛠️ Tech Stack

- **Framework:** Flutter 3.8.1+
- **State Management:** Provider + BLoC pattern (ChangeNotifier)
- **Localization:** Flutter Intl (ARB files)
- **Navigation:** Custom Navigator wrapper
- **HTTP Client:** Dio
- **Local Storage:** SharedPreferences
- **Connectivity:** connectivity_plus
- **UI Components:** Custom widget library

### Key Dependencies

```yaml
dependencies:
  flutter: sdk: flutter
  provider: ^6.1.5              # State management
  dio: ^5.8.0+1                 # HTTP client
  shared_preferences: ^2.5.3    # Local storage
  connectivity_plus: ^6.1.4     # Network status
  cached_network_image: ^3.4.1  # Image caching
  auto_size_text_plus: ^3.0.2   # Responsive text
```

## 🚀 Getting Started

### Prerequisites

- Flutter SDK 3.8.1 or higher
- Dart SDK 3.8.1 or higher
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio with SDK 21+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd construct_source
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Generate localization files**
   ```bash
   flutter gen-l10n
   ```

4. **Run the app**
   ```bash
   # Debug mode
   flutter run

   # Release mode
   flutter run --release

   # Specific device
   flutter run -d <device_id>
   ```

### Configuration

Edit `assets/config/config.json` to configure environments:

```json
{
  "environment": "staging",
  "staging": {
    "appName": "Construct",
    "server": "https://staging-api.example.com",
    "langDefault": "vi",
    "displayPrint": true
  },
  "production": {
    "appName": "Construct",
    "server": "https://api.example.com",
    "langDefault": "vi",
    "displayPrint": false
  }
}
```

## 📁 Project Structure

```
lib/
├── core/                      # Core functionality
│   ├── config.dart           # Environment configuration
│   ├── providers/            # Global state providers
│   ├── routing/              # Navigation utilities
│   ├── theme/                # Theme system
│   ├── network/              # Network utilities
│   └── utils/                # Helper functions & validators
├── features/                  # Feature modules
│   ├── presentation/         # Feature screens & BLoCs
│   └── widgets/              # Reusable UI components
├── l10n/                     # Auto-generated localization
├── screens/                  # Standalone screens
└── main.dart                 # App entry point

assets/
├── config/                   # Configuration files
├── icons/                    # App icons
├── images/                   # Images
└── l10n/                     # Translation files (ARB)
```

### 📚 Detailed Documentation

For comprehensive documentation, see:

- **[CLAUDE.md](CLAUDE.md)** - Complete project guide for Claude Code
- **[lib/core/CORE.md](lib/core/CORE.md)** - Core functionality documentation
- **[lib/features/FEATURES.md](lib/features/FEATURES.md)** - Features & widgets guide
- **[lib/l10n/L10N.md](lib/l10n/L10N.md)** - Localization guide
- **[lib/screens/SCREENS.md](lib/screens/SCREENS.md)** - Screens documentation

## 💻 Development

### Commands

```bash
# Run app in debug mode
flutter run

# Hot reload (press 'r' in terminal)
# Hot restart (press 'R' in terminal)

# Analyze code
flutter analyze

# Format code
flutter format lib/

# Check for outdated dependencies
flutter pub outdated
```

### Building

```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

### Testing

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/path/to/test_file.dart

# Generate coverage report
flutter test --coverage
```

## 🌍 Localization

### Supported Languages

- 🇻🇳 Vietnamese (Default)
- 🇬🇧 English
- 🇨🇳 Chinese

### Adding Translations

1. Edit ARB files in `assets/l10n/`
   - `app_vi.arb` (Template)
   - `app_en.arb`
   - `app_zh.arb`

2. Generate localization files
   ```bash
   flutter gen-l10n
   ```

3. Use in code
   ```dart
   Text(AppLocalizations.of(context)!.myKey)
   ```

See [lib/l10n/L10N.md](lib/l10n/L10N.md) for detailed localization guide.

## 🎨 Theme System

### Switching Themes

```dart
// Toggle between light and dark
context.read<ThemeProvider>().toggleTheme();

// Set specific theme
context.read<ThemeProvider>().setThemeMode(ThemeMode.dark);
```

### Using Colors

```dart
// Static colors
Container(color: AppColors.primary);

// Theme-aware colors
Color textColor = AppColors.getColor(
  context,
  AppColors.textPrimary,
  AppColors.textPrimaryDark,
);
```

## 🏗️ Architecture

### State Management

The app uses **Provider** with **BLoC pattern** (ChangeNotifier):

```dart
class MyFeatureBloc extends ChangeNotifier {
  MyState _state = MyState.initial;
  MyState get state => _state;

  void updateState(MyState newState) {
    _state = newState;
    notifyListeners();
  }
}
```

### Navigation

Uses `CustomNavigator` for navigation without BuildContext:

```dart
// Push new screen
CustomNavigator.push(MyScreen());

// Pop
CustomNavigator.pop();

// Push and remove all
CustomNavigator.pushAndRemoveUntil(
  HomeScreen(),
  (route) => false,
);
```

## 🧩 Reusable Widgets

### Buttons

```dart
PrimaryButton(
  text: 'Submit',
  onPressed: () => submit(),
  isLoading: isLoading,
  icon: Icons.send,
)
```

### Input Fields

```dart
TextFieldCustom(
  label: 'Email',
  controller: emailController,
  validator: Validators.email(context),
  prefixIcon: Icon(Icons.email),
)

PasswordField(
  label: 'Password',
  controller: passwordController,
  validator: Validators.password(context, minLength: 8),
)
```

### Dialogs

```dart
showDialog(
  context: context,
  builder: (_) => ConfirmationDialog(
    title: 'Delete Item',
    message: 'Are you sure?',
    isDestructive: true,
    onConfirm: () => deleteItem(),
  ),
);
```

See [lib/features/FEATURES.md](lib/features/FEATURES.md) for complete widget documentation.

## 📝 Form Validation

The app includes comprehensive validation utilities:

```dart
TextFormField(
  validator: Validators.combine([
    Validators.required(context),
    Validators.email(context),
  ]),
)

// Available validators:
// - email, phoneNumber, password
// - required, minLength, maxLength
// - numeric, url
// - confirmPassword
```

See [lib/core/CORE.md](lib/core/CORE.md#validators) for all validators.

## 🔧 Configuration

### Environment Variables

Configure in `assets/config/config.json`:

```dart
// Access configuration
String appName = Config.appName;
String server = Config.server;
bool displayPrint = Config.displayPrint;

// Switch environment
Config.setEnvironment('production');
```

## 📱 Platform Support

- ✅ iOS 11.0+
- ✅ Android 5.0+ (API 21+)
- ✅ Web (Chrome, Safari, Firefox, Edge)

## 🤝 Contributing

### Code Style

- Follow [Effective Dart](https://dart.dev/guides/language/effective-dart) guidelines
- Use `flutter format` before committing
- Respect lint rules in `analysis_options.yaml`

### Commit Convention

```bash
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance
```

### Documentation Updates

**IMPORTANT:** When modifying code, update the corresponding documentation:

- Changes in `lib/core/` → Update [lib/core/CORE.md](lib/core/CORE.md)
- Changes in `lib/features/` → Update [lib/features/FEATURES.md](lib/features/FEATURES.md)
- Changes in localization → Update [lib/l10n/L10N.md](lib/l10n/L10N.md)
- Changes in screens → Update [lib/screens/SCREENS.md](lib/screens/SCREENS.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Created by the Development Team

## 📞 Support

For questions or support, please contact:
- Email: support@example.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- All open-source contributors

---

**Built with ❤️ using Flutter**
