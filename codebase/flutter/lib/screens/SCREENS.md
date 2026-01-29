# lib/screens/ - Standalone Screens Documentation

**Last Updated:** 2026-01-29

This directory contains standalone screens that do not belong to a specific feature module. These screens are typically utility screens, demo screens, or shared screens used in multiple places.

## 📁 Structure

```
lib/screens/
└── demo_form_screen.dart          # Demo form with validation examples
```

---

## 🎯 When to Use This Directory

### ✅ Screens that belong in `lib/screens/`:
- Demo/example screens
- Utility screens (About, Settings pages that are not complex)
- Shared screens with no separate business logic
- Standalone pages that do not belong to feature modules

### ❌ Screens that should NOT be here:
- Feature-specific screens → Put in `lib/features/presentation/feature_name/`
- Screens with their own BLoC → Create a feature module
- Complex screens with many widgets → Create a feature module

---

## 📄 Demo Form Screen ([demo_form_screen.dart](demo_form_screen.dart))

### Purpose
Demo screen demonstrating how to use:
- Form validation with Validators
- Custom widgets (PrimaryButton, PasswordField)
- Localization
- Input formatters
- Real-time validation feedback

### Features

1. **Form Validation Examples:**
   - Name validation (required)
   - Username validation (custom format)
   - Email validation
   - Phone validation (Vietnamese format)
   - Password validation (min length)
   - Confirm password matching

2. **Input Formatters:**
   - Username: Allow only `[a-zA-Z0-9._-]`, max 20 chars
   - Phone: Allow only `[0-9+\s-]`, max 15 chars
   - Auto-format phone number when 10 digits are entered

3. **Real-time Feedback:**
   - Masked email display
   - Masked phone display
   - Password strength indicator
   - Validation card showing status

### Code Structure

```dart
class DemoFormScreen extends StatefulWidget {
  // Stateful to manage form state
}

class _DemoFormScreenState extends State<DemoFormScreen> {
  // Form key
  final _formKey = GlobalKey<FormState>();

  // Text controllers
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  // ... other controllers

  @override
  void dispose() {
    // ✅ IMPORTANT: Always dispose controllers
    _emailController.dispose();
    // ... dispose all controllers
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      // Handle valid form submission
    }
  }
}
```

### Usage Examples from Demo

#### 1. Basic TextFormField with Validation
```dart
TextFormField(
  controller: _nameController,
  decoration: InputDecoration(
    labelText: l10n.fullName,
    prefixIcon: const Icon(Icons.person),
  ),
  validator: Validators.required(context),
  textCapitalization: TextCapitalization.words,
)
```

#### 2. Custom Validation Logic
```dart
TextFormField(
  controller: _usernameController,
  validator: (value) {
    // First check required
    final requiredError = Validators.required(context)(value);
    if (requiredError != null) return requiredError;

    // Then custom validation
    if (!Validators.isValidUsername(value)) {
      return 'Invalid username format';
    }
    return null;
  },
  inputFormatters: [
    FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z0-9._-]')),
    LengthLimitingTextInputFormatter(20),
  ],
)
```

#### 3. Phone Field with Auto-Formatting
```dart
TextFormField(
  controller: _phoneController,
  validator: Validators.phoneNumber(context),
  keyboardType: TextInputType.phone,
  inputFormatters: [
    FilteringTextInputFormatter.allow(RegExp(r'[0-9+\s-]')),
    LengthLimitingTextInputFormatter(15),
  ],
  onChanged: (value) {
    // Auto-format when user types 10 digits
    if (value.length == 10 && Validators.isPhoneNumber(value)) {
      _phoneController.text = Validators.formatPhoneNumber(value);
      _phoneController.selection = TextSelection.fromPosition(
        TextPosition(offset: _phoneController.text.length),
      );
    }
  },
)
```

#### 4. PasswordField Widget
```dart
PasswordField(
  controller: _passwordController,
  labelText: l10n.password,
  hintText: 'Minimum 6 characters',
  validator: Validators.password(context, minLength: 6),
  showStrengthIndicator: true,
)
```

#### 5. Confirm Password Validation
```dart
TextFormField(
  controller: _confirmPasswordController,
  decoration: InputDecoration(
    labelText: l10n.confirmPassword,
    prefixIcon: const Icon(Icons.lock_outline),
  ),
  validator: Validators.confirmPassword(
    context,
    _passwordController.text, // Match against this password
  ),
  obscureText: true,
  autocorrect: false,
)
```

#### 6. Submit Button
```dart
PrimaryButton(
  text: l10n.submit,
  onPressed: _submitForm,
  icon: Icons.send,
)
```

#### 7. Validation Feedback Card
```dart
Card(
  child: Padding(
    padding: AppSpacing.paddingAll16,
    child: Column(
      children: [
        // Show masked email
        if (_emailController.text.isNotEmpty &&
            Validators.isEmail(_emailController.text))
          Text('Masked: ${Validators.maskEmail(_emailController.text)}'),

        // Show masked phone
        if (_phoneController.text.isNotEmpty &&
            Validators.isPhoneNumber(_phoneController.text))
          Text('Masked: ${Validators.maskPhoneNumber(_phoneController.text)}'),

        // Show password strength
        if (_passwordController.text.isNotEmpty)
          Text(
            'Password strength: ${Validators.isStrongPassword(_passwordController.text) ? "Strong" : "Weak"}',
            style: TextStyle(
              color: Validators.isStrongPassword(_passwordController.text)
                  ? Colors.green
                  : Colors.orange,
            ),
          ),
      ],
    ),
  ),
)
```

### Navigation to Demo Screen

Commented out in [main.dart](../main.dart), but can navigate manually:
```dart
CustomNavigator.push(DemoFormScreen());

// Or with context
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => DemoFormScreen()),
);
```

### Learning Points from Demo

1. **Form State Management:**
   - Use `GlobalKey<FormState>` to control form
   - Validate with `_formKey.currentState!.validate()`
   - Reset with `_formKey.currentState!.reset()`

2. **Controller Management:**
   - Create controllers in State
   - ALWAYS dispose in `dispose()`
   - Access values: `controller.text`
   - Set values: `controller.text = 'value'`

3. **Validation Best Practices:**
   - Use Validators class for common validations
   - Combine multiple validators if needed
   - Show helper text for format requirements
   - Real-time validation with `onChanged`

4. **Input Formatters:**
   - `FilteringTextInputFormatter`: Allow/block characters
   - `LengthLimitingTextInputFormatter`: Limit length
   - Custom formatters: Implement `TextInputFormatter`

5. **Keyboard Types:**
   - `TextInputType.emailAddress`: Email keyboard
   - `TextInputType.phone`: Phone number keyboard
   - `TextInputType.number`: Number keyboard
   - `TextInputType.text`: Default text keyboard

---

## 🏗️ Adding New Screens

### Simple Screen (No Business Logic)

**When:** Utility pages, static content, simple forms

**Where:** `lib/screens/`

**Example:**
```dart
// lib/screens/about_screen.dart
import 'package:flutter/material.dart';
import 'package:construction_project/l10n/app_localizations.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.about),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(l10n.appName),
            Text('Version: ${Config.versionName}'),
            // ... more content
          ],
        ),
      ),
    );
  }
}
```

### Complex Screen (With Business Logic)

**When:** Screens with state management, API calls, complex logic

**Where:** Create feature module in `lib/features/presentation/`

**Structure:**
```
lib/features/presentation/my_screen_module/
└── src/
    ├── bloc/
    │   └── my_screen_bloc.dart
    └── ui/
        └── my_screen.dart
```

See [FEATURES.md](../features/FEATURES.md) for details.

---

## 📝 Screen Development Checklist

When creating a new screen in this directory:

### UI & UX:
- [ ] Responsive layout (works on different screen sizes)
- [ ] AppBar with proper title
- [ ] Back button functionality (auto if push route)
- [ ] Loading states if there are async operations
- [ ] Error handling and error displays
- [ ] Empty states if there are lists

### Code Quality:
- [ ] Use AppColors instead of hardcode colors
- [ ] Use AppSpacing instead of hardcode padding/margin
- [ ] Use AppLocalizations for all text
- [ ] Dispose controllers, streams, listeners
- [ ] Use const constructors when possible
- [ ] Follow naming conventions

### Forms (if applicable):
- [ ] GlobalKey<FormState> for form validation
- [ ] TextEditingControllers for text fields
- [ ] Validators for all inputs
- [ ] Dispose controllers in dispose()
- [ ] Handle keyboard (dismiss on submit)
- [ ] Show loading state when submit
- [ ] Success/error feedback

### Navigation:
- [ ] Use CustomNavigator if possible
- [ ] Pass data via constructor or arguments
- [ ] Return data with pop(result) if needed
- [ ] Handle back button behavior

### Accessibility:
- [ ] Semantic labels for widgets
- [ ] Proper text contrast
- [ ] Touch targets >= 48x48
- [ ] Support dark mode

---

## 🎨 Common Patterns

### 1. Form Screen Pattern
```dart
class MyFormScreen extends StatefulWidget {
  const MyFormScreen({super.key});

  @override
  State<MyFormScreen> createState() => _MyFormScreenState();
}

class _MyFormScreenState extends State<MyFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _controller = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      // Submit logic
      CustomNavigator.pop(true); // Return success
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Form')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: AppSpacing.paddingAll16,
          children: [
            TextFormField(
              controller: _controller,
              validator: Validators.required(context),
            ),
            AppSpacing.verticalSpace24,
            PrimaryButton(
              text: 'Submit',
              onPressed: _submit,
              isLoading: _isLoading,
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2. Detail Screen Pattern
```dart
class DetailScreen extends StatelessWidget {
  final String id;

  const DetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Detail'),
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () => _edit(),
          ),
        ],
      ),
      body: FutureBuilder(
        future: _loadData(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return ErrorWidget(
              message: snapshot.error.toString(),
              onRetry: () => setState(() {}),
            );
          }

          if (!snapshot.hasData) {
            return LoadingWidget();
          }

          return _buildContent(snapshot.data);
        },
      ),
    );
  }
}
```

### 3. List Screen Pattern
```dart
class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  List<Item> _items = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    setState(() => _isLoading = true);
    try {
      _items = await fetchItems();
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Items')),
      body: _buildBody(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _addItem(),
        child: Icon(Icons.add),
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) return LoadingWidget();
    if (_items.isEmpty) return EmptyWidget(message: 'No items');

    return RefreshIndicator(
      onRefresh: _loadItems,
      child: ListView.builder(
        itemCount: _items.length,
        itemBuilder: (context, index) {
          return ListTileCustom(
            title: _items[index].name,
            onTap: () => _viewDetail(_items[index]),
          );
        },
      ),
    );
  }
}
```

---

## 🔄 Updating This File

**IMPORTANT:** Whenever adding/removing/modifying screens in this directory:

### When adding a new screen:
1. Add file name and description to structure
2. Document purpose and features
3. Add code examples if there are new patterns
4. Update "Last Updated"

### When removing a screen:
1. Remove from structure list
2. Remove documentation section
3. Update any references in other docs

### When refactoring patterns:
1. Update pattern examples
2. Update checklist if needed
3. Note breaking changes

**Example commit:**
```
docs: update SCREENS.md - added ProfileScreen documentation
```
