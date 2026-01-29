import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_spacing.dart';
import 'app_text_styles.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      primaryContainer: AppColors.primaryLight,
      secondary: AppColors.secondary,
      secondaryContainer: AppColors.secondaryLight,
      tertiary: AppColors.tertiary,
      tertiaryContainer: AppColors.tertiaryLight,
      error: AppColors.error,
      errorContainer: AppColors.errorLight,
      surface: AppColors.surface,
      surfaceContainerHighest: AppColors.surfaceVariant,
      onPrimary: AppColors.white,
      onSecondary: AppColors.white,
      onTertiary: AppColors.white,
      onError: AppColors.white,
      onSurface: AppColors.textPrimary,
      onSurfaceVariant: AppColors.textSecondary,
      outline: AppColors.outline,
      outlineVariant: AppColors.outlineVariant,
    ),
    useMaterial3: true,
    fontFamily: AppTextStyles.fontFamily,
    textTheme: const TextTheme(
      displayLarge: AppTextStyles.displayLarge,
      displayMedium: AppTextStyles.displayMedium,
      displaySmall: AppTextStyles.displaySmall,
      headlineLarge: AppTextStyles.headlineLarge,
      headlineMedium: AppTextStyles.headlineMedium,
      headlineSmall: AppTextStyles.headlineSmall,
      titleLarge: AppTextStyles.titleLarge,
      titleMedium: AppTextStyles.titleMedium,
      titleSmall: AppTextStyles.titleSmall,
      bodyLarge: AppTextStyles.bodyLarge,
      bodyMedium: AppTextStyles.bodyMedium,
      bodySmall: AppTextStyles.bodySmall,
      labelLarge: AppTextStyles.labelLarge,
      labelMedium: AppTextStyles.labelMedium,
      labelSmall: AppTextStyles.labelSmall,
    ),
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
      backgroundColor: AppColors.surface,
      foregroundColor: AppColors.textPrimary,
      titleTextStyle: AppTextStyles.titleLarge,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        textStyle: AppTextStyles.button,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        side: const BorderSide(color: AppColors.outline),
        textStyle: AppTextStyles.button,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        textStyle: AppTextStyles.button,
      ),
    ),
    cardTheme: const CardThemeData(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusAll12,
      ),
      clipBehavior: Clip.antiAlias,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surfaceVariant.withValues(alpha: 0.3),
      contentPadding: AppSpacing.paddingHorizontal16,
      border: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.outline),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.error, width: 2),
      ),
      labelStyle: AppTextStyles.bodyLarge,
      hintStyle: AppTextStyles.bodyLarge.copyWith(color: AppColors.textTertiary),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.divider,
      thickness: 1,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primaryLight,
      primaryContainer: AppColors.primaryDark,
      secondary: AppColors.secondaryLight,
      secondaryContainer: AppColors.secondaryDark,
      tertiary: AppColors.tertiaryLight,
      tertiaryContainer: AppColors.tertiaryDark,
      error: AppColors.errorLight,
      errorContainer: AppColors.errorDark,
      surface: AppColors.surfaceDark,
      surfaceContainerHighest: AppColors.surfaceVariantDark,
      onPrimary: AppColors.black,
      onSecondary: AppColors.black,
      onTertiary: AppColors.black,
      onError: AppColors.black,
      onSurface: AppColors.textPrimaryDark,
      onSurfaceVariant: AppColors.textSecondaryDark,
      outline: AppColors.outlineDark,
      outlineVariant: AppColors.surfaceVariantDark,
    ),
    useMaterial3: true,
    fontFamily: AppTextStyles.fontFamily,
    textTheme: TextTheme(
      displayLarge: AppTextStyles.displayLarge.copyWith(color: AppColors.textPrimaryDark),
      displayMedium: AppTextStyles.displayMedium.copyWith(color: AppColors.textPrimaryDark),
      displaySmall: AppTextStyles.displaySmall.copyWith(color: AppColors.textPrimaryDark),
      headlineLarge: AppTextStyles.headlineLarge.copyWith(color: AppColors.textPrimaryDark),
      headlineMedium: AppTextStyles.headlineMedium.copyWith(color: AppColors.textPrimaryDark),
      headlineSmall: AppTextStyles.headlineSmall.copyWith(color: AppColors.textPrimaryDark),
      titleLarge: AppTextStyles.titleLarge.copyWith(color: AppColors.textPrimaryDark),
      titleMedium: AppTextStyles.titleMedium.copyWith(color: AppColors.textPrimaryDark),
      titleSmall: AppTextStyles.titleSmall.copyWith(color: AppColors.textPrimaryDark),
      bodyLarge: AppTextStyles.bodyLarge.copyWith(color: AppColors.textPrimaryDark),
      bodyMedium: AppTextStyles.bodyMedium.copyWith(color: AppColors.textPrimaryDark),
      bodySmall: AppTextStyles.bodySmall.copyWith(color: AppColors.textPrimaryDark),
      labelLarge: AppTextStyles.labelLarge.copyWith(color: AppColors.textPrimaryDark),
      labelMedium: AppTextStyles.labelMedium.copyWith(color: AppColors.textPrimaryDark),
      labelSmall: AppTextStyles.labelSmall.copyWith(color: AppColors.textPrimaryDark),
    ),
    appBarTheme: AppBarTheme(
      centerTitle: true,
      elevation: 0,
      backgroundColor: AppColors.surfaceDark,
      foregroundColor: AppColors.textPrimaryDark,
      titleTextStyle: AppTextStyles.titleLarge.copyWith(color: AppColors.textPrimaryDark),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        textStyle: AppTextStyles.button,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        side: const BorderSide(color: AppColors.outlineDark),
        textStyle: AppTextStyles.button,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        minimumSize: const Size(88, AppSpacing.buttonHeight),
        padding: AppSpacing.paddingHorizontal24,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.borderRadiusAll8,
        ),
        textStyle: AppTextStyles.button,
      ),
    ),
    cardTheme: const CardThemeData(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusAll12,
      ),
      clipBehavior: Clip.antiAlias,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surfaceVariantDark.withValues(alpha: 0.3),
      contentPadding: AppSpacing.paddingHorizontal16,
      border: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.outlineDark),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.outlineDark),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.primaryLight, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.errorLight),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: AppSpacing.borderRadiusAll8,
        borderSide: const BorderSide(color: AppColors.errorLight, width: 2),
      ),
      labelStyle: AppTextStyles.bodyLarge.copyWith(color: AppColors.textPrimaryDark),
      hintStyle: AppTextStyles.bodyLarge.copyWith(color: AppColors.textTertiaryDark),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.dividerDark,
      thickness: 1,
    ),
  );
}