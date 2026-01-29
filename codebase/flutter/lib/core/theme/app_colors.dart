import 'package:flutter/material.dart';

class AppColors {
  // Primary - Modern Blue (Professional, Trust, Technology)
  static const Color primary = Color(0xFF0066FF);
  static const Color primaryDark = Color(0xFF0052CC);
  static const Color primaryLight = Color(0xFF3385FF);
  
  // Secondary - Deep Purple (Innovation, Premium)
  static const Color secondary = Color(0xFF6B46C1);
  static const Color secondaryDark = Color(0xFF553C9A);
  static const Color secondaryLight = Color(0xFF9F7AEA);
  
  // Tertiary - Teal (Growth, Balance)
  static const Color tertiary = Color(0xFF0891B2);
  static const Color tertiaryDark = Color(0xFF0E7490);
  static const Color tertiaryLight = Color(0xFF06B6D4);
  
  // Status Colors
  static const Color error = Color(0xFFDC2626);
  static const Color errorDark = Color(0xFFB91C1C);
  static const Color errorLight = Color(0xFFEF4444);
  
  static const Color success = Color(0xFF16A34A);
  static const Color successDark = Color(0xFF15803D);
  static const Color successLight = Color(0xFF22C55E);
  
  static const Color warning = Color(0xFFEAB308);
  static const Color warningDark = Color(0xFFCA8A04);
  static const Color warningLight = Color(0xFFFACC15);
  
  static const Color info = Color(0xFF0EA5E9);
  static const Color infoDark = Color(0xFF0284C7);
  static const Color infoLight = Color(0xFF38BDF8);
  
  // Background Colors
  static const Color background = Color(0xFFFBFCFE);
  static const Color backgroundDark = Color(0xFF0F0F14);
  
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceDark = Color(0xFF1A1A22);
  
  static const Color surfaceVariant = Color(0xFFF5F7FA);
  static const Color surfaceVariantDark = Color(0xFF252530);
  
  // Chart & Analytics Colors
  static const Color chartBlue = Color(0xFF3B82F6);
  static const Color chartGreen = Color(0xFF10B981);
  static const Color chartOrange = Color(0xFFF59E0B);
  static const Color chartPurple = Color(0xFF8B5CF6);
  static const Color chartPink = Color(0xFFEC4899);
  static const Color chartCyan = Color(0xFF06B6D4);
  
  // Border & Divider Colors
  static const Color outline = Color(0xFFE5E7EB);
  static const Color outlineDark = Color(0xFF374151);
  static const Color outlineVariant = Color(0xFFF3F4F6);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF111827);
  static const Color textPrimaryDark = Color(0xFFF9FAFB);
  
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textSecondaryDark = Color(0xFF9CA3AF);
  
  static const Color textTertiary = Color(0xFF9CA3AF);
  static const Color textTertiaryDark = Color(0xFF6B7280);
  
  static const Color textDisabled = Color(0xFFD1D5DB);
  static const Color textDisabledDark = Color(0xFF4B5563);
  
  // Base Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color transparent = Colors.transparent;
  
  // Additional UI Colors
  static const Color divider = Color(0xFFE5E7EB);
  static const Color dividerDark = Color(0xFF374151);
  
  static const Color shadow = Color(0x0F000000);
  static const Color shadowDark = Color(0x3D000000);
  
  static const Color scrim = Color(0x80000000);
  
  // Card Elevation Colors (Dark Mode)
  static const Color cardDark1 = Color(0xFF1E1E28);
  static const Color cardDark2 = Color(0xFF23232F);
  static const Color cardDark3 = Color(0xFF282836);
  
  // Helper Method
  static Color getColor(BuildContext context, Color lightColor, Color darkColor) {
    return Theme.of(context).brightness == Brightness.dark ? darkColor : lightColor;
  }
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryDark],
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [secondary, secondaryDark],
  );
  
  static const LinearGradient analyticsGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0066FF), Color(0xFF6B46C1)],
  );
}