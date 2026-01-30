# Task: Create Flutter Widget

Template for creating reusable widgets in Construction Project.

## Context Required

- [ ] Widget purpose
- [ ] Props/parameters needed
- [ ] Visual design
- [ ] Behavior requirements
- [ ] Usage examples

## Prompt Template

```
Based on system-instructions.md:

Task: Create {widget_name} reusable widget

Context:
- Project: Construction Project (Flutter 3.8.1)
- Theme System: AppColors, AppTextStyles
- Existing widgets: docs/context/widgets/

Widget Requirements:
{describe_widget_functionality}

Parameters:
{list_required_and_optional_params}

Design:
{visual_specifications}

Behavior:
{interaction_and_state_behavior}

Usage Example:
{code_example_of_usage}

Generate:
1. Widget class (const constructor if possible)
2. Documentation comments
3. Usage example
4. Widget test

Follow:
- Material 3 design
- Const constructors where possible
- Proper null safety
- Accessibility (semantics)
```

## Expected Output

```
lib/features/widgets/{category}/
└── {widget_name}.dart

test/widgets/
└── {widget_name}_test.dart
```

## Example Usage

```
Based on system-instructions.md:

Task: Create CustomTextField reusable widget

Context:
- Project: Construction Project
- Theme: AppColors, AppTextStyles
- Similar widgets: TextButtonCustom

Widget Requirements:
- Styled text input field
- Support for validation
- Optional prefix/suffix icons
- Error message display
- Loading state
- Obscure text option (for passwords)

Parameters:
Required:
- String? label
- TextEditingController controller

Optional:
- String? Function(String?)? validator
- Widget? prefixIcon
- Widget? suffixIcon
- bool obscureText = false
- bool enabled = true
- String? errorText
- TextInputType? keyboardType

Design:
- Material 3 OutlinedInputBorder
- AppColors.primary for focus
- AppTextStyles.bodyMedium for text
- Rounded corners (8px)
- Error color: AppColors.error

Behavior:
- Auto-validation on change
- Show/hide password toggle (if obscureText)
- Disabled state styling

Usage Example:
```dart
CustomTextField(
  label: l10n.email,
  controller: emailController,
  prefixIcon: Icon(Icons.email),
  validator: EmailValidator.validate,
  keyboardType: TextInputType.emailAddress,
)
```

Generate:
1. CustomTextField widget
2. Documentation
3. Example usage
4. Widget tests
```

## Quality Checklist

After generation, verify:
- [ ] Const constructor used
- [ ] Proper documentation
- [ ] Type safety
- [ ] Null safety
- [ ] Accessibility (Semantics)
- [ ] Theme integration
- [ ] Widget tests
- [ ] No linter warnings
- [ ] Reusable and flexible
