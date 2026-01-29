# lib/features/ - Features & Widgets Documentation

**Last Updated:** 2026-01-29

This directory contains feature modules and reusable widgets of the application. Organized according to a modular architecture with BLoC pattern.

## 📁 Directory Structure

```
lib/features/
├── presentation/              # Feature modules
│   └── splash_module/
│       └── src/
│           ├── bloc/         # Business logic
│           │   └── splash_bloc.dart
│           └── ui/           # UI components
│               └── splash_screen.dart
└── widgets/                  # Reusable UI components
    ├── widgets.dart          # Central export file (part/part of pattern)
    ├── buttons/
    │   ├── primary_button.dart
    │   ├── secondary_button.dart
    │   ├── icon_button_custom.dart
    │   └── text_button_custom.dart
    ├── cards/
    │   ├── info_card.dart
    │   └── stat_card.dart
    ├── dialogs/
    │   ├── confirmation_dialog.dart
    │   ├── info_dialog.dart
    │   └── loading_dialog.dart
    ├── inputs/
    │   ├── text_field_custom.dart
    │   ├── password_field.dart
    │   ├── search_field.dart
    │   └── dropdown_field.dart
    ├── lists/
    │   └── list_tile_custom.dart
    └── loading/
        ├── loading_widget.dart
        ├── shimmer_widget.dart
        ├── error_widget.dart
        └── empty_widget.dart
```

---

## 🎯 Feature Modules ([presentation/](presentation/))

Feature modules are organized according to the pattern:
```
feature_name/
└── src/
    ├── bloc/         # Business logic (ChangeNotifier)
    └── ui/           # UI screens/widgets
```

### Splash Module ([splash_module/](presentation/splash_module/))

**Purpose:** Splash screen displayed when the app starts.

#### SplashBloc ([src/bloc/splash_bloc.dart](presentation/splash_module/src/bloc/splash_bloc.dart))

**State Management:**
- Uses ChangeNotifier (Provider pattern)
- Enum states: `loading`, `completed`

**Features:**
- 3-second timer for splash screen
- Initialization logic placeholder
- Auto-dispose timer when disposed

**Usage:**
```dart
// Already registered globally in main.dart
Provider<SplashBloc>(create: (_) => SplashBloc())

// In UI
final bloc = context.watch<SplashBloc>();
if (bloc.state == SplashState.completed) {
  // Navigate to home
}

// Init
bloc.init();
```

**Implementation Details:**
```dart
class SplashBloc extends ChangeNotifier {
  SplashState _state = SplashState.loading;
  Timer? _timer;

  void init() {
    _startSplashTimer();      // 3 seconds
    _initializeApp();         // Async initialization
  }

  void _updateState(SplashState newState) {
    _state = newState;
    notifyListeners();
  }
}
```

#### SplashScreen ([src/ui/splash_screen.dart](presentation/splash_module/src/ui/splash_screen.dart))

**Features:**
- Listen to SplashBloc state changes
- Auto-navigate when completed
- Display app logo/branding

---

## 🧩 Reusable Widgets ([widgets/](widgets/))

### Widget System Architecture

**Central Export Pattern:**
File [widgets.dart](widgets/widgets.dart) uses `part`/`part of` to organize widgets:

```dart
// widgets.dart
part 'buttons/primary_button.dart';
part 'inputs/text_field_custom.dart';
// ...

// In widget files
part of '../widgets.dart';

class PrimaryButton extends StatelessWidget {
  // ...
}
```

**Benefit:**
- Single import for all widgets
- Share dependencies (AppColors, AppSpacing, etc.)
- Consistent styling

**Import style:**
```dart
import 'package:construction_project/features/widgets/widgets.dart';

// After that, you can use all widgets
PrimaryButton(text: 'Submit');
TextFieldCustom(label: 'Email');
```

---

## 🔘 Buttons ([widgets/buttons/](widgets/buttons/))

### PrimaryButton ([primary_button.dart](widgets/buttons/primary_button.dart))

Main button of the app with loading state.

**Props:**
```dart
PrimaryButton({
  required String text,        // Button text
  VoidCallback? onPressed,     // Callback
  bool isLoading = false,      // Show loading indicator
  IconData? icon,              // Optional leading icon
  double? width,               // Custom width
  double? height,              // Default: AppSpacing.buttonHeight
  EdgeInsetsGeometry? padding, // Default: AppSpacing.paddingHorizontal24
})
```

**Features:**
- Loading state with CircularProgressIndicator
- Optional icon
- Responsive with AutoSizeText
- Follows app theme colors

**Usage:**
```dart
PrimaryButton(
  text: 'Submit',
  onPressed: () => submit(),
  isLoading: isSubmitting,
  icon: Icons.send,
)
```

### SecondaryButton ([secondary_button.dart](widgets/buttons/secondary_button.dart))

Secondary button with outlined style.

**Props:** Similar to PrimaryButton

**Styling:**
- Outlined button style
- Secondary color scheme
- Transparent background

### IconButtonCustom ([icon_button_custom.dart](widgets/buttons/icon_button_custom.dart))

Icon button with customization.

**Props:**
```dart
IconButtonCustom({
  required IconData icon,
  VoidCallback? onPressed,
  Color? color,
  double? size,
  String? tooltip,
})
```

### TextButtonCustom ([text_button_custom.dart](widgets/buttons/text_button_custom.dart))

Text-only button for secondary actions.

**Usage:**
- Cancel buttons
- Navigation links
- Secondary actions

---

## 📝 Input Fields ([widgets/inputs/](widgets/inputs/))

### TextFieldCustom ([text_field_custom.dart](widgets/inputs/text_field_custom.dart))

Custom text field with consistent styling.

**Props:**
```dart
TextFieldCustom({
  String? label,
  String? hint,
  String? initialValue,
  TextEditingController? controller,
  String? Function(String?)? validator,
  TextInputType? keyboardType,
  List<TextInputFormatter>? inputFormatters,
  bool readOnly = false,
  int? maxLines = 1,
  int? maxLength,
  Widget? prefixIcon,
  Widget? suffixIcon,
  VoidCallback? onTap,
  Function(String)? onChanged,
})
```

**Features:**
- Integrated with Validators
- Prefix/suffix icons
- Character counter
- Multi-line support
- Theme-aware styling

**Usage:**
```dart
TextFieldCustom(
  label: 'Email',
  hint: 'Enter your email',
  controller: emailController,
  validator: Validators.email(context),
  keyboardType: TextInputType.emailAddress,
  prefixIcon: Icon(Icons.email),
)
```

### PasswordField ([password_field.dart](widgets/inputs/password_field.dart))

Password field with show/hide toggle.

**Features:**
- Toggle visibility icon
- Obscure text
- Password validation support
- Auto-capitalizes false

**Usage:**
```dart
PasswordField(
  label: 'Password',
  controller: passwordController,
  validator: Validators.password(context, minLength: 8),
)
```

### SearchField ([search_field.dart](widgets/inputs/search_field.dart))

Search input with clear button.

**Features:**
- Search icon
- Clear button when has text
- Debounce support (typically)
- onChange callback

### DropdownField ([dropdown_field.dart](widgets/inputs/dropdown_field.dart))

Custom dropdown select field.

**Props:**
```dart
DropdownField<T>({
  String? label,
  T? value,
  required List<DropdownMenuItem<T>> items,
  void Function(T?)? onChanged,
  String? Function(T?)? validator,
})
```

---

## 💬 Dialogs ([widgets/dialogs/](widgets/dialogs/))

### ConfirmationDialog ([confirmation_dialog.dart](widgets/dialogs/confirmation_dialog.dart))

Dialog to confirm an action.

**Props:**
```dart
ConfirmationDialog({
  required String title,
  required String message,
  String? confirmText,     // Default: "Confirm"
  String? cancelText,      // Default: "Cancel"
  VoidCallback? onConfirm,
  VoidCallback? onCancel,
  bool isDestructive = false, // Red color for confirm
})
```

**Usage:**
```dart
showDialog(
  context: context,
  builder: (_) => ConfirmationDialog(
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    isDestructive: true,
    onConfirm: () => deleteItem(),
  ),
);
```

### InfoDialog ([info_dialog.dart](widgets/dialogs/info_dialog.dart))

Dialog to display information.

**Props:**
```dart
InfoDialog({
  required String title,
  required String message,
  String? buttonText,      // Default: "OK"
  VoidCallback? onPressed,
  IconData? icon,
})
```

### LoadingDialog ([loading_dialog.dart](widgets/dialogs/loading_dialog.dart))

Full-screen loading overlay.

**Props:**
```dart
LoadingDialog({
  String? message,         // Loading text
  bool dismissible = false,
})
```

**Usage:**
```dart
// Show
showDialog(
  context: context,
  barrierDismissible: false,
  builder: (_) => LoadingDialog(message: 'Processing...'),
);

// Hide
Navigator.pop(context);
```

---

## 🎴 Cards ([widgets/cards/](widgets/cards/))

### InfoCard ([info_card.dart](widgets/cards/info_card.dart))

Card to display information with icon.

**Props:**
```dart
InfoCard({
  required String title,
  required String subtitle,
  IconData? icon,
  Color? iconColor,
  VoidCallback? onTap,
})
```

**Usage:**
```dart
InfoCard(
  title: 'Project Name',
  subtitle: 'Construction Project 2024',
  icon: Icons.construction,
  iconColor: AppColors.primary,
  onTap: () => viewDetails(),
)
```

### StatCard ([stat_card.dart](widgets/cards/stat_card.dart))

Card to display statistics data.

**Props:**
```dart
StatCard({
  required String label,
  required String value,
  String? subtitle,
  IconData? icon,
  Color? color,
  String? trend,           // "+12%", "-5%"
  bool isPositive = true,
})
```

**Usage:**
```dart
StatCard(
  label: 'Total Projects',
  value: '24',
  icon: Icons.folder,
  color: AppColors.primary,
  trend: '+12%',
  isPositive: true,
)
```

---

## 📋 Lists ([widgets/lists/](widgets/lists/))

### ListTileCustom ([list_tile_custom.dart](widgets/lists/list_tile_custom.dart))

Custom list tile with consistent styling.

**Props:**
```dart
ListTileCustom({
  required String title,
  String? subtitle,
  Widget? leading,
  Widget? trailing,
  VoidCallback? onTap,
  bool selected = false,
})
```

---

## ⏳ Loading States ([widgets/loading/](widgets/loading/))

### LoadingWidget ([loading_widget.dart](widgets/loading/loading_widget.dart))

Loading indicator widget.

**Props:**
```dart
LoadingWidget({
  String? message,
  double? size,
  Color? color,
})
```

**Usage:**
```dart
if (isLoading) {
  return LoadingWidget(message: 'Loading data...');
}
```

### ShimmerWidget ([shimmer_widget.dart](widgets/loading/shimmer_widget.dart))

Skeleton loading animation.

**Props:**
```dart
ShimmerWidget({
  double width,
  double height,
  BorderRadius? borderRadius,
})
```

**Usage:**
```dart
// Loading card placeholder
ShimmerWidget(
  width: double.infinity,
  height: 100,
  borderRadius: BorderRadius.circular(12),
)
```

### ErrorWidget ([error_widget.dart](widgets/loading/error_widget.dart))

Error state display.

**Props:**
```dart
ErrorWidget({
  required String message,
  VoidCallback? onRetry,
  IconData? icon,
})
```

**Usage:**
```dart
if (hasError) {
  return ErrorWidget(
    message: 'Failed to load data',
    onRetry: () => retry(),
  );
}
```

### EmptyWidget ([empty_widget.dart](widgets/loading/empty_widget.dart))

Empty state display.

**Props:**
```dart
EmptyWidget({
  required String message,
  String? subtitle,
  IconData? icon,
  VoidCallback? onAction,
  String? actionText,
})
```

**Usage:**
```dart
if (items.isEmpty) {
  return EmptyWidget(
    message: 'No projects found',
    subtitle: 'Create your first project',
    icon: Icons.folder_off,
    actionText: 'Create Project',
    onAction: () => createProject(),
  );
}
```

---

## 🏗️ Creating New Feature Modules

### Step-by-Step Guide:

1. **Create Directory Structure:**
```bash
lib/features/presentation/my_feature/
└── src/
    ├── bloc/
    │   └── my_feature_bloc.dart
    └── ui/
        ├── my_feature_screen.dart
        └── widgets/
            └── feature_specific_widget.dart
```

2. **Create BLoC:**
```dart
// my_feature_bloc.dart
import 'package:flutter/material.dart';

enum MyFeatureState { initial, loading, loaded, error }

class MyFeatureBloc extends ChangeNotifier {
  MyFeatureState _state = MyFeatureState.initial;
  MyFeatureState get state => _state;

  void _updateState(MyFeatureState newState) {
    _state = newState;
    notifyListeners();
  }

  Future<void> loadData() async {
    _updateState(MyFeatureState.loading);
    try {
      // Load data logic
      _updateState(MyFeatureState.loaded);
    } catch (e) {
      _updateState(MyFeatureState.error);
    }
  }

  @override
  void dispose() {
    // Cleanup
    super.dispose();
  }
}
```

3. **Register Provider (if needed globally):**
```dart
// main.dart
MultiProvider(
  providers: [
    // ... existing providers
    ChangeNotifierProvider(create: (_) => MyFeatureBloc()),
  ],
  child: MyApp(),
)
```

4. **Create UI:**
```dart
// my_feature_screen.dart
class MyFeatureScreen extends StatefulWidget {
  const MyFeatureScreen({super.key});

  @override
  State<MyFeatureScreen> createState() => _MyFeatureScreenState();
}

class _MyFeatureScreenState extends State<MyFeatureScreen> {
  @override
  void initState() {
    super.initState();
    context.read<MyFeatureBloc>().loadData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<MyFeatureBloc>(
        builder: (context, bloc, child) {
          switch (bloc.state) {
            case MyFeatureState.loading:
              return LoadingWidget();
            case MyFeatureState.error:
              return ErrorWidget(
                message: 'Failed to load',
                onRetry: () => bloc.loadData(),
              );
            case MyFeatureState.loaded:
              return _buildContent();
            default:
              return Container();
          }
        },
      ),
    );
  }

  Widget _buildContent() {
    // Build UI
  }
}
```

---

## 🎨 Creating New Widgets

### For Part-Based Widgets (widgets.dart):

1. **Create Widget File:**
```dart
// widgets/my_category/my_widget.dart
part of '../widgets.dart';

class MyWidget extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;

  const MyWidget({
    super.key,
    required this.text,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // Use AppColors, AppSpacing
      color: AppColors.primary,
      padding: AppSpacing.padding16,
      child: Text(text),
    );
  }
}
```

2. **Add to widgets.dart:**
```dart
// widgets.dart
part 'my_category/my_widget.dart';
```

### For Standalone Widgets:

Create independent file if widget is complex or needs private classes.

---

## 📝 Best Practices

### BLoC Pattern:
- ✅ Extend ChangeNotifier for simple state management
- ✅ Use enum for clear states
- ✅ Always dispose resources (timers, streams, controllers)
- ✅ Keep UI logic in widgets, business logic in BLoC
- ✅ Use CustomNavigator.push() instead of Navigator.push(context)

### Widget Development:
- ✅ Use AppColors instead of hardcode colors
- ✅ Use AppSpacing instead of hardcode padding/margin
- ✅ Support both light and dark theme
- ✅ Add loading states for async operations
- ✅ Handle error states
- ✅ Use const constructors when possible
- ✅ Validate props with assert if needed

### Reusability:
- ✅ Make widgets configurable with props
- ✅ Provide sensible defaults
- ✅ Document props with comments
- ✅ Create examples in comments

### Testing:
```dart
// Example widget test
testWidgets('PrimaryButton shows loading', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: PrimaryButton(
        text: 'Submit',
        isLoading: true,
      ),
    ),
  );

  expect(find.byType(CircularProgressIndicator), findsOneWidget);
  expect(find.text('Submit'), findsNothing);
});
```

---

## 🔄 Update This File

**IMPORTANT:** Whenever there are changes in the `lib/features/` directory, please update this file:

### When adding a new Feature Module:
1. Add to directory structure
2. Document BLoC states and methods
3. Add usage examples
4. Update "Last Updated"

### When adding a new Widget:
1. Add to the corresponding category (buttons/inputs/etc.)
2. Document props fully
3. Add usage example
4. Screenshot if possible

### When refactoring:
1. Update all references
2. Update examples
3. Note breaking changes if any

**Example commit:**
```
docs: update FEATURES.md - added ProjectCard widget
```
