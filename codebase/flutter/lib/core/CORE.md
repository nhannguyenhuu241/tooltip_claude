# lib/core/ - Core Functionality Documentation

**Last Updated:** 2026-01-29

This directory contains core functionality shared throughout the application, including configuration, providers, routing, theme, and utilities.

## 📁 Directory Structure

```
lib/core/
├── config.dart                    # Environment configuration system
├── network/
│   └── internet_checker.dart      # Internet connectivity checker
├── providers/
│   ├── locale_provider.dart       # Language management
│   └── theme_provider.dart        # Light/dark theme management
├── routing/
│   └── custom_navigator.dart      # Navigation utility without BuildContext
├── theme/
│   ├── app_colors.dart            # Application color palette
│   ├── app_spacing.dart           # Spacing constants
│   ├── app_text_styles.dart       # Text styles
│   └── app_theme.dart             # Theme definitions
└── utils/
    ├── globals.dart               # Global variables & keys
    ├── utility.dart               # Helper functions
    └── validators.dart            # Form validators
```

## 🔧 Configuration System ([config.dart](config.dart))

### Purpose
Manages application configuration based on environment (staging/production).

### Usage

```dart
// Initialization (automatically called in main.dart)
await Config.init();

// Access configuration values
String appName = Config.appName;        // "Construct"
String server = Config.server;          // API server URL
String langDefault = Config.langDefault; // "vi"
bool displayPrint = Config.displayPrint; // true/false

// Switch environment
Config.setEnvironment('production');

// Print configuration to console
Config.printConfig();
```

### Configuration File
- Location: [assets/config/config.json](../../assets/config/config.json)
- Structure:
```json
{
  "environment": "staging",
  "staging": { /* staging config */ },
  "production": { /* production config */ }
}
```

### Available Properties
- `appName`: Application name
- `appId`: Bundle identifier
- `versionName`: Display version
- `versionCode`: Build number
- `server`: Base URL for API
- `langDefault`: Default language
- `enableLang`: Enable/disable multi-language
- `releaseDate`: Release date
- `displayPrint`: Show debug logs

### SharedPreferences
Config also manages SharedPreferences instance:
```dart
SharedPreferences? prefs = Config.prefs;
```

---

## 🌐 Network ([network/](network/))

### internet_checker.dart
Internet connectivity checker utility.

**Features:**
- Check network connection
- Monitor connection status changes
- Uses `connectivity_plus` package

---

## 🎨 Providers ([providers/](providers/))

### ThemeProvider ([theme_provider.dart](providers/theme_provider.dart))

Manages app light/dark theme with persistence.

**Features:**
- Supports 3 modes: `light`, `dark`, `system`
- Saves preference to SharedPreferences
- Auto-loads theme on initialization

**Usage:**
```dart
// Read current theme
ThemeMode currentTheme = context.read<ThemeProvider>().themeMode;

// Toggle theme
context.read<ThemeProvider>().toggleTheme();

// Set specific theme
context.read<ThemeProvider>().setThemeMode(ThemeMode.dark);
```

**Persistence:**
- Key: `'isDarkMode'`
- Storage: SharedPreferences
- Auto-load on initialization

### LocaleProvider ([locale_provider.dart](providers/locale_provider.dart))

Manages app language with persistence.

**Supported Locales:**
- Vietnamese (`vi`)
- English (`en`)
- Chinese (`zh`)

**Usage:**
```dart
// Read current locale
Locale currentLocale = context.read<LocaleProvider>().locale;

// Change language
context.read<LocaleProvider>().setLocale(Locale('en'));
```

**Persistence:**
- Key: `'selectedLocale'`
- Storage: SharedPreferences
- Default: `vi` (Vietnamese)

---

## 🧭 Routing ([routing/](routing/))

### CustomNavigator ([custom_navigator.dart](routing/custom_navigator.dart))

Navigator wrapper for navigation without BuildContext.

**Why?**
- Allows navigation from business logic/BLoC
- No need to pass BuildContext through multiple layers
- Centralized navigation logic

**Setup:**
Navigator key is registered in MaterialApp at [main.dart:88](../../main.dart#L88):
```dart
MaterialApp(
  navigatorKey: CustomNavigator.navigatorKey,
  // ...
)
```

**Available Methods:**

```dart
// Push new screen
CustomNavigator.push(MyScreen());
CustomNavigator.pushNamed('/route', arguments: data);

// Replace current screen
CustomNavigator.pushReplacement(NewScreen());
CustomNavigator.pushReplacementNamed('/route');

// Push and remove until
CustomNavigator.pushAndRemoveUntil(
  HomeScreen(),
  (route) => false, // Remove all
);

// Pop operations
CustomNavigator.pop();
CustomNavigator.pop(result);
CustomNavigator.popUntil((route) => route.isFirst);
CustomNavigator.popToRoot();

// Check if can pop
bool canPop = CustomNavigator.canPop();
bool didPop = await CustomNavigator.maybePop();
```

**Example in BLoC:**
```dart
class LoginBloc extends ChangeNotifier {
  Future<void> login() async {
    // ... login logic
    if (success) {
      CustomNavigator.pushAndRemoveUntil(
        HomeScreen(),
        (route) => false,
      );
    }
  }
}
```

---

## 🎨 Theme System ([theme/](theme/))

### AppColors ([app_colors.dart](theme/app_colors.dart))

Application color palette with dark mode support.

**Color Categories:**

1. **Primary Colors** (Blue - Professional, Trust)
   - `primary`: #0066FF
   - `primaryDark`: #0052CC
   - `primaryLight`: #3385FF

2. **Secondary Colors** (Purple - Innovation)
   - `secondary`: #6B46C1
   - `secondaryDark`: #553C9A
   - `secondaryLight`: #9F7AEA

3. **Tertiary Colors** (Teal - Growth)
   - `tertiary`: #0891B2
   - `tertiaryDark`: #0E7490
   - `tertiaryLight`: #06B6D4

4. **Status Colors**
   - Error: Red (#DC2626)
   - Success: Green (#16A34A)
   - Warning: Yellow (#EAB308)
   - Info: Blue (#0EA5E9)

5. **Background & Surface**
   - `background`: #FBFCFE (light), #0F0F14 (dark)
   - `surface`: #FFFFFF (light), #1A1A22 (dark)
   - `surfaceVariant`: #F5F7FA (light), #252530 (dark)

6. **Chart Colors**
   - `chartBlue`, `chartGreen`, `chartOrange`
   - `chartPurple`, `chartPink`, `chartCyan`

7. **Text Colors**
   - Primary, Secondary, Tertiary, Disabled
   - Each level has dark mode variant

**Usage:**
```dart
// Static colors
Container(color: AppColors.primary);

// Dynamic color based on theme
Color textColor = AppColors.getColor(
  context,
  AppColors.textPrimary,      // Light mode
  AppColors.textPrimaryDark,  // Dark mode
);

// Gradients
Container(
  decoration: BoxDecoration(
    gradient: AppColors.primaryGradient,
  ),
);
```

### AppSpacing ([app_spacing.dart](theme/app_spacing.dart))

Constants for spacing and sizing.

**Common values:**
- Padding: 4, 8, 12, 16, 20, 24, 32
- Margin values
- Border radius values
- Button heights
- Icon sizes

### AppTextStyles ([app_text_styles.dart](theme/app_text_styles.dart))

Consistent text style definitions.

**Categories:**
- Display: Large headings
- Headline: Section headings
- Title: Card/dialog titles
- Body: Main content
- Label: Labels and captions

### AppTheme ([app_theme.dart](theme/app_theme.dart))

Theme definitions for light and dark mode.

**Export:**
```dart
class AppTheme {
  static ThemeData lightTheme = /* ... */;
  static ThemeData darkTheme = /* ... */;
}
```

---

## 🛠️ Utils ([utils/](utils/))

### Validators ([validators.dart](utils/validators.dart))

Comprehensive validation utilities for forms.

**Boolean Validators:**
```dart
bool isValid = Validators.isEmail(email);
bool isValid = Validators.isPhoneNumber(phone); // VN format
bool isValid = Validators.isValidName(name);     // Vietnamese names
bool isValid = Validators.isValidUsername(username);
bool isValid = Validators.isNumeric(value);
bool isValid = Validators.isValidUrl(url);
bool isValid = Validators.isValidPassword(password); // min 6 chars
bool isValid = Validators.isStrongPassword(password); // 8+ chars, uppercase, lowercase, digit, special
bool isValid = Validators.isValidIdCard(idCard);     // 9 or 12 digits
bool isValid = Validators.isValidCreditCard(card);   // Luhn algorithm
```

**Form Validators (return String?):**
```dart
TextFormField(
  validator: Validators.required(context),
  // or
  validator: Validators.email(context),
  validator: Validators.phoneNumber(context),
  validator: Validators.password(context, minLength: 8),
  validator: Validators.confirmPassword(context, passwordController.text),
  validator: Validators.minLength(context, 10),
  validator: Validators.maxLength(context, 100),
  validator: Validators.numeric(context),
  validator: Validators.url(context),
);
```

**Combine Multiple Validators:**
```dart
TextFormField(
  validator: Validators.combine([
    Validators.required(context),
    Validators.email(context),
  ]),
);
```

**Formatting Utilities:**
```dart
// Format phone: "0912 345 678"
String formatted = Validators.formatPhoneNumber(phone);

// Format credit card: "1234 5678 9012 3456"
String formatted = Validators.formatCreditCard(card);

// Mask email: "us***er@example.com"
String masked = Validators.maskEmail(email);

// Mask phone: "091***678"
String masked = Validators.maskPhoneNumber(phone);
```

**Regular Expressions:**
- Email: Standard email format
- Phone: Vietnamese format (`+84` or `0` + `3|5|7|8|9` + 8 digits)
- Name: Vietnamese characters + spaces
- Username: Alphanumeric + `._-` (3-20 chars)
- Number: Digits only
- URL: HTTP/HTTPS/FTP protocols

### Globals ([globals.dart](utils/globals.dart))

Global variables and keys shared across the app.

**Typical contents:**
- GlobalKeys for navigation
- App-wide state variables
- Singleton instances

### Utility ([utility.dart](utils/utility.dart))

Helper utility functions.

**Common utilities:**
- Date/time formatting
- String manipulation
- Number formatting
- Status bar customization
- Platform-specific helpers

---

## 📝 Maintenance Notes

### When adding new colors:
1. Add to [app_colors.dart](theme/app_colors.dart)
2. Define both light and dark variants
3. Update theme in [app_theme.dart](theme/app_theme.dart)

### When adding new validators:
1. Add to [validators.dart](utils/validators.dart)
2. Add localization key to ARB files
3. Test with edge cases

### When adding new Providers:
1. Create class extending ChangeNotifier
2. Register in [main.dart](../../main.dart#L32-L37)
3. Consider persistence with SharedPreferences

### When updating config:
1. Update [assets/config/config.json](../../assets/config/config.json)
2. Add property getter to [config.dart](config.dart) if needed
3. Update this documentation

---

## 🔄 Updating This File

**IMPORTANT:** Whenever there are changes in the `lib/core/` directory, update this file so Claude Code can understand the context:

1. Add/remove files → Update directory structure
2. Change APIs → Update usage examples
3. Add features → Update documentation section
4. Update "Last Updated" date at the top

**Example commit message:**
```
docs: update CORE.md - added new EmailValidator utility
```
