part of '../widgets.dart';

class InfoDialog extends StatelessWidget {
  final String title;
  final String message;
  final String? buttonText;
  final IconData? icon;
  final Color? iconColor;

  const InfoDialog({
    super.key,
    required this.title,
    required this.message,
    this.buttonText,
    this.icon,
    this.iconColor,
  });

  static Future<void> show({
    required BuildContext context,
    required String title,
    required String message,
    String? buttonText,
    IconData? icon,
    Color? iconColor,
  }) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (context) => InfoDialog(
        title: title,
        message: message,
        buttonText: buttonText,
        icon: icon,
        iconColor: iconColor,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusAll16,
      ),
      title: Column(
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: 48,
              color: iconColor ?? Theme.of(context).colorScheme.primary,
            ),
            AppSpacing.verticalSpace12,
          ],
          AutoSizeText(
            title,
            textAlign: TextAlign.center,
          ),
        ],
      ),
      content: AutoSizeText(
        message,
        textAlign: TextAlign.center,
      ),
      actions: [
        Center(
          child: TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: AutoSizeText(buttonText ?? l10n.ok),
          ),
        ),
      ],
    );
  }
}