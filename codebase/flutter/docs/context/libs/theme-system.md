# Theme System Documentation

Construction Project theme architecture and usage guide.

## Files

```
lib/core/theme/
├── app_colors.dart       # Color palette
├── app_text_styles.dart  # Typography
├── app_theme.dart        # Theme configuration
└── app_spacing.dart      # Spacing constants
```

## AppColors

### Usage

```dart
import 'package:construction_project/core/theme/app_colors.dart';

Container(
  color: AppColors.primary,
  child: Text(
    'Hello',
    style: TextStyle(color: AppColors.onPrimary),
  ),
)
```

### Available Colors

```dart
class AppColors {
  // Primary colors
  static const primary = Color(0xFF...);
  static const onPrimary = Color(0xFF...);

  // Background
  static const background = Color(0xFF...);
  static const surface = Color(0xFF...);

  // Text
  static const textPrimary = Color(0xFF...);
  static const textSecondary = Color(0xFF...);

  // State colors
  static const error = Color(0xFF...);
  static const success = Color(0xFF...);
  static const warning = Color(0xFF...);
  static const info = Color(0xFF...);
}
```

## AppTextStyles

### Usage

```dart
import 'package:construction_project/core/theme/app_text_styles.dart';

Text(
  'Headline',
  style: AppTextStyles.headlineLarge,
)

Text(
  'Body text',
  style: AppTextStyles.bodyMedium.copyWith(
    color: AppColors.textSecondary,
  ),
)
```

### Available Styles

```dart
class AppTextStyles {
  // Headlines
  static final headlineLarge = TextStyle(...);
  static final headlineMedium = TextStyle(...);
  static final headlineSmall = TextStyle(...);

  // Body text
  static final bodyLarge = TextStyle(...);
  static final bodyMedium = TextStyle(...);
  static final bodySmall = TextStyle(...);

  // Labels
  static final labelLarge = TextStyle(...);
  static final labelMedium = TextStyle(...);
  static final labelSmall = TextStyle(...);
}
```

## ThemeProvider

Dynamic theme switching (dark/light mode).

### Setup in Main App

```dart
import 'package:provider/provider.dart';
import 'package:construction_project/core/providers/theme_provider.dart';
import 'package:construction_project/core/theme/app_theme.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            home: HomePage(),
          );
        },
      ),
    );
  }
}
```

### Toggle Theme

```dart
import 'package:provider/provider.dart';

// In widget
final themeProvider = Provider.of<ThemeProvider>(context, listen: false);

// Toggle dark/light
themeProvider.toggleTheme();

// Set specific mode
themeProvider.setThemeMode(ThemeMode.dark);
themeProvider.setThemeMode(ThemeMode.light);
themeProvider.setThemeMode(ThemeMode.system); // Follow system
```

## AppSpacing

Consistent spacing throughout app.

```dart
import 'package:construction_project/core/theme/app_spacing.dart';

Padding(
  padding: EdgeInsets.all(AppSpacing.md),
  child: Column(
    children: [
      Text('Item 1'),
      SizedBox(height: AppSpacing.sm),
      Text('Item 2'),
    ],
  ),
)
```

### Available Spacing

```dart
class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}
```

## Material 3 Integration

Project uses Material 3 design system.

### Theme Configuration

```dart
// lib/core/theme/app_theme.dart
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,
        // ...
      ),
      textTheme: TextTheme(
        headlineLarge: AppTextStyles.headlineLarge,
        bodyMedium: AppTextStyles.bodyMedium,
        // ...
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.dark(
        // Dark mode colors
      ),
    );
  }
}
```

## Best Practices

### ✅ DO

```dart
// Use theme colors
Container(color: AppColors.primary)

// Use text styles
Text('Hello', style: AppTextStyles.bodyMedium)

// Use spacing constants
Padding(padding: EdgeInsets.all(AppSpacing.md))

// Customize with copyWith
Text('Custom', style: AppTextStyles.bodyMedium.copyWith(
  fontWeight: FontWeight.bold,
))
```

### ❌ DON'T

```dart
// Don't use hardcoded colors
Container(color: Colors.blue) // BAD

// Don't use hardcoded text styles
Text('Hello', style: TextStyle(fontSize: 16)) // BAD

// Don't use magic numbers for spacing
Padding(padding: EdgeInsets.all(16.0)) // BAD
```

## Responsive Design

### Screen Size Breakpoints

```dart
class Breakpoints {
  static const double mobile = 600;
  static const double tablet = 900;
  static const double desktop = 1200;
}

// Usage
final width = MediaQuery.of(context).size.width;
final isMobile = width < Breakpoints.mobile;
final isTablet = width >= Breakpoints.mobile && width < Breakpoints.tablet;
```

### Responsive Text

```dart
// Adjust text size based on screen
Text(
  'Responsive',
  style: AppTextStyles.headlineLarge.copyWith(
    fontSize: MediaQuery.of(context).size.width < 600 ? 24 : 32,
  ),
)
```

## Dark Mode

Theme automatically switches based on ThemeProvider:

```dart
// In widget, get current theme
final isDark = Theme.of(context).brightness == Brightness.dark;

// Conditional styling
Container(
  color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
)
```

## Important Notes

1. ✅ Always use `AppColors` instead of `Colors.*`
2. ✅ Always use `AppTextStyles` instead of raw `TextStyle`
3. ✅ Use `AppSpacing` for consistent spacing
4. ✅ Support both light and dark themes
5. ⛔ Never hardcode colors or text sizes
6. ⛔ Don't ignore theme changes from ThemeProvider

## See Also

- `lib/core/theme/` - Theme source files
- `lib/core/providers/theme_provider.dart` - Theme state management
- Material 3 Design: https://m3.material.io
