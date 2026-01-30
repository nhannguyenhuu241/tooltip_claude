# Provider State Management Pattern

State management approach for Construction Project using Provider package.

## Package Info

```yaml
# pubspec.yaml
dependencies:
  provider: ^6.1.5
```

## Pattern Overview

### Basic Provider

```dart
import 'package:flutter/foundation.dart';

class CounterProvider extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // ← Notify listeners of state change
  }

  void reset() {
    _count = 0;
    notifyListeners();
  }
}
```

### Using Provider in Widget

```dart
import 'package:provider/provider.dart';

class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => CounterProvider(),
      child: Scaffold(
        body: Consumer<CounterProvider>(
          builder: (context, provider, child) {
            return Column(
              children: [
                Text('Count: ${provider.count}'),
                ElevatedButton(
                  onPressed: provider.increment,
                  child: Text('Increment'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
```

## Global Providers

### ThemeProvider

Located: `lib/core/providers/theme_provider.dart`

```dart
final themeProvider = Provider.of<ThemeProvider>(context);
themeProvider.toggleTheme(); // Switch dark/light
```

### LocaleProvider

Located: `lib/core/providers/locale_provider.dart`

```dart
final localeProvider = Provider.of<LocaleProvider>(context);
localeProvider.setLocale(Locale('vi')); // Change language
```

## Best Practices

### 1. Separate State from UI

✅ **Good:**
```dart
// login_provider.dart
class LoginProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // API call
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

❌ **Bad:**
```dart
// Don't mix UI logic in provider
class BadProvider extends ChangeNotifier {
  void showDialog(BuildContext context) { // ← BAD!
    showDialog(context: context, ...);
  }
}
```

### 2. Dispose Resources

```dart
class MyProvider extends ChangeNotifier {
  final StreamController _controller = StreamController();

  @override
  void dispose() {
    _controller.close(); // ← Clean up
    super.dispose();
  }
}
```

### 3. Use Consumer for Targeted Rebuilds

✅ **Good** (only rebuilds Text widget):
```dart
Consumer<CounterProvider>(
  builder: (context, provider, child) {
    return Text('${provider.count}');
  },
)
```

❌ **Bad** (rebuilds entire screen):
```dart
class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<CounterProvider>(context);
    return Scaffold(...); // ← Whole scaffold rebuilds
  }
}
```

### 4. Use Selector for Specific Values

```dart
Selector<UserProvider, String>(
  selector: (context, provider) => provider.userName,
  builder: (context, userName, child) {
    return Text(userName); // Only rebuilds when userName changes
  },
)
```

## Common Patterns

### Loading State

```dart
class DataProvider extends ChangeNotifier {
  bool _isLoading = false;
  List<Item> _items = [];
  String? _error;

  bool get isLoading => _isLoading;
  List<Item> get items => _items;
  String? get error => _error;

  Future<void> loadData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _items = await api.fetchItems();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

### Form State

```dart
class FormProvider extends ChangeNotifier {
  final formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  String get email => _email;
  String get password => _password;

  void updateEmail(String value) {
    _email = value;
    notifyListeners();
  }

  void updatePassword(String value) {
    _password = value;
    notifyListeners();
  }

  bool validate() {
    return formKey.currentState?.validate() ?? false;
  }
}
```

## MultiProvider Setup

For apps with multiple global providers:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => ThemeProvider()),
    ChangeNotifierProvider(create: (_) => LocaleProvider()),
    ChangeNotifierProvider(create: (_) => AuthProvider()),
  ],
  child: MyApp(),
)
```

## Testing Providers

```dart
test('increment increases count', () {
  final provider = CounterProvider();

  provider.increment();
  expect(provider.count, 1);

  provider.increment();
  expect(provider.count, 2);
});
```

## References

- [Provider Package Docs](https://pub.dev/packages/provider)
- [Flutter State Management](https://flutter.dev/docs/development/data-and-backend/state-mgmt)
- Project examples: `lib/core/providers/`
