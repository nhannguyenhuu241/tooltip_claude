import 'package:flutter/material.dart';
import '../../l10n/app_localizations.dart';

class Validators {
  static final RegExp _emailRegExp = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );
  
  static final RegExp _phoneRegExp = RegExp(
    r'^(\+?84|0)?[3|5|7|8|9][0-9]{8}$',
  );
  
  static final RegExp _nameRegExp = RegExp(
    r'^[a-zA-ZÀ-ỹĐđ\s]+$',
  );
  
  static final RegExp _usernameRegExp = RegExp(
    r'^[a-zA-Z0-9._-]{3,20}$',
  );
  
  static final RegExp _numberOnlyRegExp = RegExp(
    r'^[0-9]+$',
  );
  
  static final RegExp _urlRegExp = RegExp(
    r'^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$',
    caseSensitive: false,
  );
  
  static bool isEmail(String? value) {
    if (value == null || value.isEmpty) return false;
    return _emailRegExp.hasMatch(value);
  }
  
  static bool isPhoneNumber(String? value) {
    if (value == null || value.isEmpty) return false;
    String phone = value.replaceAll(RegExp(r'[\s-]'), '');
    return _phoneRegExp.hasMatch(phone);
  }
  
  static bool isValidName(String? value) {
    if (value == null || value.isEmpty) return false;
    return _nameRegExp.hasMatch(value.trim());
  }
  
  static bool isValidUsername(String? value) {
    if (value == null || value.isEmpty) return false;
    return _usernameRegExp.hasMatch(value);
  }
  
  static bool isNumeric(String? value) {
    if (value == null || value.isEmpty) return false;
    return _numberOnlyRegExp.hasMatch(value);
  }
  
  static bool isValidUrl(String? value) {
    if (value == null || value.isEmpty) return false;
    return _urlRegExp.hasMatch(value);
  }
  
  static bool isValidPassword(String? password) {
    if (password == null || password.isEmpty) return false;
    return password.length >= 6;
  }
  
  static bool isStrongPassword(String? password) {
    if (password == null || password.length < 8) return false;
    
    bool hasUppercase = password.contains(RegExp(r'[A-Z]'));
    bool hasLowercase = password.contains(RegExp(r'[a-z]'));
    bool hasDigits = password.contains(RegExp(r'[0-9]'));
    bool hasSpecialCharacters = password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    
    return hasUppercase && hasLowercase && hasDigits && hasSpecialCharacters;
  }
  
  static bool isValidIdCard(String? value) {
    if (value == null || value.isEmpty) return false;
    String cleaned = value.replaceAll(RegExp(r'[\s-]'), '');
    return (cleaned.length == 9 || cleaned.length == 12) && isNumeric(cleaned);
  }
  
  static bool isValidCreditCard(String? value) {
    if (value == null || value.isEmpty) return false;
    String cleaned = value.replaceAll(RegExp(r'[\s-]'), '');
    
    if (!isNumeric(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    int sum = 0;
    bool alternate = false;
    for (int i = cleaned.length - 1; i >= 0; i--) {
      int digit = int.parse(cleaned[i]);
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      sum += digit;
      alternate = !alternate;
    }
    return sum % 10 == 0;
  }
  
  static String? Function(String?) required(BuildContext context) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      return null;
    };
  }
  
  static String? Function(String?) email(BuildContext context) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (!isEmail(value)) {
        return AppLocalizations.of(context)!.invalidEmail;
      }
      return null;
    };
  }
  
  static String? Function(String?) phoneNumber(BuildContext context) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (!isPhoneNumber(value)) {
        return AppLocalizations.of(context)!.invalidPhone;
      }
      return null;
    };
  }
  
  static String? Function(String?) password(BuildContext context, {int minLength = 6}) {
    return (String? value) {
      if (value == null || value.isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (value.length < minLength) {
        return AppLocalizations.of(context)!.passwordTooShort;
      }
      return null;
    };
  }
  
  static String? Function(String?) confirmPassword(
    BuildContext context,
    String password,
  ) {
    return (String? value) {
      if (value == null || value.isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (value != password) {
        return AppLocalizations.of(context)!.passwordMismatch;
      }
      return null;
    };
  }
  
  static String? Function(String?) minLength(
    BuildContext context,
    int minLength,
  ) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (value.length < minLength) {
        return '${AppLocalizations.of(context)!.fieldRequired} (min: $minLength)';
      }
      return null;
    };
  }
  
  static String? Function(String?) maxLength(
    BuildContext context,
    int maxLength,
  ) {
    return (String? value) {
      if (value != null && value.length > maxLength) {
        return 'Maximum $maxLength characters allowed';
      }
      return null;
    };
  }
  
  static String? Function(String?) numeric(BuildContext context) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (!isNumeric(value)) {
        return 'Only numbers allowed';
      }
      return null;
    };
  }
  
  static String? Function(String?) url(BuildContext context) {
    return (String? value) {
      if (value == null || value.trim().isEmpty) {
        return AppLocalizations.of(context)!.fieldRequired;
      }
      if (!isValidUrl(value)) {
        return 'Invalid URL format';
      }
      return null;
    };
  }
  
  static String? Function(String?) combine(
    List<String? Function(String?)> validators,
  ) {
    return (String? value) {
      for (final validator in validators) {
        final result = validator(value);
        if (result != null) {
          return result;
        }
      }
      return null;
    };
  }
  
  static String formatPhoneNumber(String phoneNumber) {
    String cleaned = phoneNumber.replaceAll(RegExp(r'[\s-]'), '');
    
    if (cleaned.startsWith('+84')) {
      cleaned = '0${cleaned.substring(3)}';
    } else if (cleaned.startsWith('84')) {
      cleaned = '0${cleaned.substring(2)}';
    }
    
    if (cleaned.length == 10) {
      return '${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}';
    }
    
    return phoneNumber;
  }
  
  static String formatCreditCard(String cardNumber) {
    String cleaned = cardNumber.replaceAll(RegExp(r'[\s-]'), '');
    List<String> parts = [];
    
    for (int i = 0; i < cleaned.length; i += 4) {
      int end = i + 4;
      if (end > cleaned.length) end = cleaned.length;
      parts.add(cleaned.substring(i, end));
    }
    
    return parts.join(' ');
  }
  
  static String maskEmail(String email) {
    if (!isEmail(email)) return email;
    
    List<String> parts = email.split('@');
    String username = parts[0];
    String domain = parts[1];
    
    if (username.length <= 3) {
      return '${username[0]}***@$domain';
    }
    
    int visibleChars = username.length ~/ 3;
    if (visibleChars < 2) visibleChars = 2;
    
    String masked = username.substring(0, visibleChars);
    masked += '*' * (username.length - visibleChars * 2);
    masked += username.substring(username.length - visibleChars);
    
    return '$masked@$domain';
  }
  
  static String maskPhoneNumber(String phoneNumber) {
    String cleaned = phoneNumber.replaceAll(RegExp(r'[\s-]'), '');
    
    if (cleaned.length < 7) return phoneNumber;
    
    String masked = cleaned.substring(0, 3);
    masked += '*' * (cleaned.length - 6);
    masked += cleaned.substring(cleaned.length - 3);
    
    return formatPhoneNumber(masked);
  }
}