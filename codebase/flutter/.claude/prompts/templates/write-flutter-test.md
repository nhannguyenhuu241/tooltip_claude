# Task: Write Flutter Tests

Template for writing comprehensive tests in Construction Project.

## Context Required

- [ ] Code to test (screen/widget/provider)
- [ ] Test scenarios
- [ ] Expected behaviors
- [ ] Edge cases

## Prompt Template

```
Based on system-instructions.md:

Task: Write tests for {component_name}

Context:
- Project: Construction Project (Flutter 3.8.1)
- Testing: flutter_test package
- Target coverage: >80%

Component:
{paste_code_to_test}

Test Scenarios:
{list_all_scenarios_to_test}

Edge Cases:
{list_edge_cases}

Generate:
1. Unit tests (for logic/providers)
2. Widget tests (for UI components)
3. Integration tests (if needed)
4. Mock dependencies where needed

Test Coverage:
- Normal flows
- Error cases
- Edge cases
- Loading states
- Empty states
```

## Expected Output

```
test/
├── features/
│   ├── {feature}_screen_test.dart
│   └── {feature}_provider_test.dart
└── widgets/
    └── {widget}_test.dart
```

## Example: Testing LoginProvider

```
Based on system-instructions.md:

Task: Write tests for LoginProvider

Context:
- LoginProvider manages authentication state
- Uses Dio for API calls
- Handles loading, success, error states

Component:
```dart
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
      final response = await Dio().post('/api/auth/login',
        data: {'email': email, 'password': password});
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
}
```

Test Scenarios:
1. Successful login
   - isLoading becomes true
   - API called with correct data
   - isLoading becomes false on success
   - Returns true

2. Failed login (401)
   - isLoading becomes true
   - API returns 401
   - errorMessage set to "Invalid credentials"
   - isLoading becomes false
   - Returns false

3. Network error
   - isLoading becomes true
   - Network failure
   - errorMessage set appropriately
   - isLoading becomes false
   - Returns false

4. Email validation
   - Empty email rejected
   - Invalid format rejected
   - Valid email accepted

Generate:
1. Unit tests with mocked Dio
2. Test all scenarios
3. Verify state changes
4. Mock API responses
```

## Example: Testing LoginScreen Widget

```
Based on system-instructions.md:

Task: Write widget tests for LoginScreen

Component:
LoginScreen - stateful widget with email/password form

Test Scenarios:
1. Widget renders correctly
   - Email field present
   - Password field present
   - Login button present
   - "Forgot password" link present

2. Form validation
   - Invalid email shows error
   - Empty password shows error
   - Valid inputs enable button

3. Login interaction
   - Tap login with valid inputs
   - Loading indicator shows
   - Navigate on success
   - Error shown on failure

4. Password visibility toggle
   - Password obscured by default
   - Toggle shows password
   - Toggle hides password

Generate:
1. Widget tests for all scenarios
2. Mock LoginProvider
3. Verify widget tree
4. Test user interactions
5. Test navigation
```

## Quality Checklist

After generation, verify:
- [ ] All test scenarios covered
- [ ] Edge cases tested
- [ ] Mocks properly set up
- [ ] Tests are independent
- [ ] Clear test descriptions
- [ ] No flaky tests
- [ ] Coverage >80%
- [ ] Tests run successfully
