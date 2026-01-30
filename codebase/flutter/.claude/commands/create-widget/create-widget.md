---
command: create-widget
description: Tự động phân tích requirements và tạo Flutter widget với plan chi tiết
---

# Create Widget Command

Tự động tạo reusable Flutter widget với workflow phân tích và implementation plan.

## Usage

```bash
/create-widget <requirements>
```

**Example:**
```bash
/create-widget Custom Button với gradient background, icon, loading state
```

---

## Workflow Tự Động

Khi bạn chạy command này, Claude sẽ:

### Bước 1: Phân Tích Requirements (Automatic)

```markdown
📋 REQUIREMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: "Custom Button với gradient background, icon, loading state"

🔍 Extracted Requirements:
├─ Widget Type: Button (Interactive)
├─ Visual Properties:
│  ├─ Gradient background (LinearGradient)
│  ├─ Icon support (optional leading/trailing)
│  └─ Custom colors from AppColors
├─ States:
│  ├─ Normal (default)
│  ├─ Loading (CircularProgressIndicator)
│  ├─ Disabled (opacity 0.5)
│  └─ Pressed (scale animation)
├─ Properties:
│  ├─ onPressed callback
│  ├─ text (String)
│  ├─ icon (IconData?)
│  ├─ isLoading (bool)
│  ├─ isEnabled (bool)
│  └─ gradient colors
├─ Animation:
│  ├─ Scale on press (0.95)
│  └─ Smooth transitions (200ms)
└─ Accessibility: Semantic labels

📊 Complexity: Low-Medium (1-2 hours traditional, 15-30 min with AI)
```

---

### Bước 2: Context Discovery (Automatic)

```markdown
🔍 CONTEXT DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking existing codebase...

✅ Found Existing Resources:
├─ Similar Widgets:
│  ├─ TextButtonCustom (lib/features/widgets/buttons/)
│  └─ Pattern to follow for consistency
│
├─ Theme System:
│  ├─ AppColors (lib/core/theme/app_colors.dart)
│  ├─ AppTextStyles (lib/core/theme/app_text_styles.dart)
│  └─ AppSpacing (lib/core/theme/app_spacing.dart)
│
├─ Patterns:
│  ├─ Widget conventions (docs/context/widgets/)
│  ├─ Theme usage (docs/context/libs/theme-system.md)
│  └─ Material 3 design system
│
└─ Testing Examples:
   └─ button_test.dart patterns

⚠️ Considerations:
├─ Follow existing button widget patterns
├─ Use const constructors where possible
├─ Support both light/dark themes
└─ Ensure accessibility (semantics, contrast)
```

---

### Bước 3: Implementation Plan (Automatic)

```markdown
📝 IMPLEMENTATION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: Widget Structure (5 minutes)
lib/features/widgets/buttons/
├── gradient_button_custom.dart
└── test/
    └── gradient_button_custom_test.dart

Phase 2: Core Widget (10 minutes)
├─ GradientButtonCustom class
│  ├─ Stateful widget (for animations)
│  ├─ Required: onPressed, text
│  ├─ Optional: icon, isLoading, isEnabled, gradient
│  └─ Default gradient from AppColors
│
├─ _GradientButtonCustomState
│  ├─ AnimationController for scale
│  ├─ Build method with GestureDetector
│  ├─ Container with gradient decoration
│  └─ Row layout (icon + text)
│
└─ Visual Components
   ├─ Loading: CircularProgressIndicator
   ├─ Icon: Positioned leading/trailing
   └─ Text: Using AppTextStyles

Phase 3: Animation & Interaction (10 minutes)
├─ Scale animation on press
│  ├─ AnimationController (200ms)
│  ├─ Tween(0.95, 1.0)
│  └─ ScaleTransition wrapper
│
├─ State handling
│  ├─ Disabled: opacity + no interaction
│  ├─ Loading: show indicator + disable
│  └─ Normal: full interaction
│
└─ Haptic feedback (optional)

Phase 4: Theme Integration (5 minutes)
├─ Use AppColors for default gradient
├─ Use AppTextStyles for text
├─ Use AppSpacing for padding
├─ Support light/dark themes
└─ Ensure contrast ratios (WCAG AA)

Phase 5: Testing (15 minutes)
├─ Widget Tests
│  ├─ testWidgets('renders correctly')
│  ├─ testWidgets('shows loading state')
│  ├─ testWidgets('handles disabled state')
│  ├─ testWidgets('calls onPressed when tapped')
│  ├─ testWidgets('shows icon when provided')
│  └─ testWidgets('applies custom gradient')
│
└─ Visual Tests
   ├─ Golden tests for light theme
   └─ Golden tests for dark theme

Expected Test Coverage: 90%+
```

---

### Bước 4: Code Generation (Automatic)

```dart
// Claude generates widget based on plan

✅ Generated Files:
├─ gradient_button_custom.dart (187 lines)
├─ gradient_button_custom_test.dart (156 lines)
└─ Widget documented in docs/context/widgets/

Total: 2 files, ~343 lines of code
Time saved: 2 hours → 20 minutes
```

---

### Bước 5: Validation Checklist (Automatic)

```markdown
✅ QUALITY VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code Quality:
✅ Follows system-instructions.md
✅ Uses AppColors, AppTextStyles, AppSpacing
✅ Const constructors where applicable
✅ Stateless where possible (or Stateful if needed)
✅ Clean code, no duplication
✅ Material 3 design compliance

Functionality:
✅ Normal state works
✅ Loading state shows indicator
✅ Disabled state prevents interaction
✅ Press animation smooth
✅ Icon positioning correct
✅ Gradient applies correctly
✅ Theme-aware (light/dark)

Accessibility:
✅ Semantic labels provided
✅ Contrast ratios meet WCAG AA
✅ Tap target size ≥48dp
✅ Screen reader compatible

Testing:
✅ Widget tests (>90% coverage)
✅ All states tested
✅ Interaction tests
✅ Golden tests (visual regression)

Reusability:
✅ Configurable via properties
✅ Sensible defaults
✅ No hardcoded values
✅ Works in different contexts

Performance:
✅ Const constructors used
✅ No unnecessary rebuilds
✅ Animations optimized (60fps)
```

---

### Bước 6: Next Steps (Automatic)

```markdown
🚀 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Review Generated Code
   ├─ Check gradient_button_custom.dart
   ├─ Verify animations work smoothly
   └─ Test on both light/dark themes

2. Test Widget
   ├─ Run: flutter test
   ├─ Manual test in demo screen
   ├─ Check on different screen sizes
   └─ Verify accessibility

3. Integration
   ├─ Use in existing screens
   ├─ Replace old button implementations
   └─ Ensure consistency

4. Commit Changes
   ├─ git add .
   ├─ git commit -m "feat(widgets): add GradientButtonCustom"
   └─ Hook auto-updates docs/

5. Documentation (Auto-updated by hook)
   ✅ CHANGES.md
   ✅ docs/context/widgets/gradient-button-custom.md
   ✅ docs/CONTEXT.md
```

---

## Command Options

### Basic Usage
```bash
/create-widget Custom Button với gradient
```

### With Detailed Requirements
```bash
/create-widget Custom Button với:
- Gradient background (primary → secondary)
- Optional leading/trailing icon
- Loading state với CircularProgressIndicator
- Disabled state (opacity 0.5)
- Scale animation on press (0.95)
- Haptic feedback
```

### With Design Specifications
```bash
/create-widget Custom Card với:
- Elevated shadow (Material 3)
- Rounded corners (12dp)
- Header với icon + title
- Content area (flexible)
- Footer với actions
- Tap to expand/collapse
```

### With Interaction Details
```bash
/create-widget Custom Input Field với:
- Floating label animation
- Prefix/suffix icons
- Character counter
- Error state với message
- Success state (green border)
- Real-time validation
```

---

## Widget Categories

### Buttons
```bash
/create-widget Gradient Button
/create-widget Icon Button với badge
/create-widget Floating Action Button extended
```

### Inputs
```bash
/create-widget Search Field với autocomplete
/create-widget Date Picker Field
/create-widget Chip Input (multi-select)
```

### Cards
```bash
/create-widget Stats Card với chart
/create-widget User Profile Card
/create-widget Product Card với image
```

### Lists
```bash
/create-widget Expandable List Item
/create-widget Swipeable List Item với actions
/create-widget Grouped List Header
```

### Loading States
```bash
/create-widget Skeleton Loader
/create-widget Progress Card
/create-widget Shimmer Effect Container
```

---

## Advanced Features

### Auto-Detection

Command tự động phát hiện:
- ✅ Similar widgets to follow patterns
- ✅ Theme system usage requirements
- ✅ Animation best practices
- ✅ Accessibility requirements
- ✅ Material 3 guidelines

### Smart Suggestions

```markdown
💡 SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on widget type:

For Buttons:
1. Add haptic feedback for better UX
2. Support icon + text layout variants
3. Include disabled state styling
4. Add press animation for feedback

For Input Fields:
1. Implement validation patterns
2. Add error/success states
3. Include character counter
4. Support clear button

For Cards:
1. Add elevation/shadow variations
2. Support tap/long-press actions
3. Include hero animation tag
4. Add skeleton loading state

For Lists:
1. Implement infinite scroll support
2. Add pull-to-refresh
3. Include empty state
4. Support item swipe actions
```

---

## Integration with Existing Tools

### Works with /sync
```bash
# Before creating
/sync widgets

# Check existing widget patterns
# Ensure consistency
```

### Works with /review
```bash
# After generation
/review

# Automatic code review of generated widget
```

### Works with Auto-Doc-Sync
```bash
# After commit
# Hook auto-updates:
# - CHANGES.md
# - docs/context/widgets/widget-name.md
# - docs/CONTEXT.md
```

---

## Output Format

Command outputs structured markdown:

```markdown
# GradientButtonCustom - Implementation Report

## Summary
- Widget: GradientButtonCustom
- Category: Buttons
- Files Generated: 2
- Lines of Code: 343
- Estimated Time Saved: 1h 40min
- Test Coverage: 92%

## Files Created
[List of all files with sizes]

## Properties & API
[List of widget properties and methods]

## Usage Examples
[Code examples showing how to use widget]

## Testing Coverage
[Test cases included]

## Documentation Updated
[Auto-generated docs]

## Next Steps
[What to do next]
```

---

## Best Practices

### ✅ Do's

```bash
# 1. Provide clear widget requirements
/create-widget Button với tất cả states và animations

# 2. Specify visual details
/create-widget Card với gradient, shadow, và rounded corners

# 3. Include interaction requirements
/create-widget Input field với validation và error states

# 4. Review generated code
/review

# 5. Test thoroughly
flutter test
```

### ⛔ Don'ts

```bash
# ❌ Vague requirements
/create-widget Button

# ❌ Skip testing
# Luôn run tests!

# ❌ Ignore accessibility
# Widget phải accessible!

# ❌ Hardcode values
# Use theme system!
```

---

## Widget Types Supported

### Interactive Widgets
- Buttons (standard, icon, floating, gradient)
- Input fields (text, date, search, chips)
- Sliders, switches, checkboxes
- Dropdowns, pickers

### Display Widgets
- Cards (stats, profile, product)
- Lists (expandable, swipeable, grouped)
- Charts (line, bar, pie)
- Avatars, badges, chips

### Layout Widgets
- Headers, footers
- Navigation bars, tabs
- Grids, carousels
- Dividers, spacers

### Feedback Widgets
- Loading (shimmer, skeleton, spinner)
- Error states
- Empty states
- Success/warning messages

---

## Error Handling

Nếu command fail:

```markdown
❌ ERROR: Cannot create widget

Possible causes:
1. Unclear requirements → Provide more details
2. Conflicting widget exists → Check /sync widgets
3. Invalid widget type → Use supported types
4. Missing theme dependencies → Check AppColors, AppTextStyles

Solutions:
1. Provide clearer requirements with examples
2. Check existing widgets in lib/features/widgets/
3. Verify widget type is valid
4. Ensure theme system is available
```

---

## Examples

### Example 1: Simple Button
```bash
/create-widget Custom Button với gradient background
```

### Example 2: Complex Card
```bash
/create-widget Stats Card với:
- Header (icon + title + subtitle)
- Main stat (large number với animation)
- Chart (line graph)
- Footer (trend indicator)
- Tap to navigate to details
```

### Example 3: Input Field
```bash
/create-widget Search Field với:
- Autocomplete dropdown
- Recent searches
- Clear button
- Loading state
- Debounced search (300ms)
```

### Example 4: List Item
```bash
/create-widget Swipeable List Item với:
- Leading avatar
- Title + subtitle
- Trailing timestamp
- Swipe left: Delete action (red)
- Swipe right: Archive action (blue)
- Confirmation before delete
```

---

## FAQ

**Q: Widget có tự động responsive không?**
A: Có, generated widgets sử dụng MediaQuery và LayoutBuilder khi cần.

**Q: Có thể customize widget sau khi generate không?**
A: Có, code generated là starting point. Bạn có thể edit thoải mái.

**Q: Widget có work với theme system không?**
A: Có! Tất cả widgets sử dụng AppColors, AppTextStyles, AppSpacing.

**Q: Làm sao để reuse widget ở nhiều screens?**
A: Widget được đặt trong lib/features/widgets/ nên import và dùng ở bất kỳ đâu.

**Q: Widget có tests không?**
A: Có! Mỗi widget có widget tests (>90% coverage) và golden tests.

**Q: Làm sao để update widget sau này?**
A: Edit file widget, run tests, commit. Hook sẽ auto-update docs.

---

## Testing Guidelines

### Unit Tests
- Test all widget properties
- Test all states (normal, loading, disabled, error)
- Test callbacks/interactions
- Test edge cases

### Widget Tests
- Test widget renders correctly
- Test user interactions (tap, swipe, etc.)
- Test animations
- Test accessibility

### Golden Tests
- Capture widget appearance (light theme)
- Capture widget appearance (dark theme)
- Capture all states visually
- Detect visual regressions

---

## Performance Considerations

Generated widgets follow these performance best practices:
- ✅ Use const constructors
- ✅ Avoid unnecessary rebuilds
- ✅ Optimize animations (60fps)
- ✅ Use Stateless where possible
- ✅ Implement shouldRebuild wisely
- ✅ Cache expensive computations

---

## See Also

- [/create-screen](../create-screen/create-screen.md) - Tạo screens
- [/sync](../sync/sync.md) - Team synchronization
- [Template](../../prompts/templates/create-flutter-widget.md) - Manual template
- [System Instructions](../../prompts/system-instructions.md) - Coding standards
- [Widget Library](../../../docs/context/widgets/) - Existing widgets
