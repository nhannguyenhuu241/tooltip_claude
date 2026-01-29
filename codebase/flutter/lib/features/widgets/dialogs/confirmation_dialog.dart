part of '../widgets.dart';

class ConfirmationDialog extends StatelessWidget {
  final String title;
  final String message;
  final String? confirmText;
  final String? cancelText;
  final VoidCallback? onConfirm;
  final VoidCallback? onCancel;
  final Color? confirmColor;
  final IconData? icon;

  const ConfirmationDialog({
    super.key,
    required this.title,
    required this.message,
    this.confirmText,
    this.cancelText,
    this.onConfirm,
    this.onCancel,
    this.confirmColor,
    this.icon,
  });

  static Future<bool?> show({
    required BuildContext context,
    required String title,
    required String message,
    String? confirmText,
    String? cancelText,
    Color? confirmColor,
    IconData? icon,
  }) async {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) => ConfirmationDialog(
        title: title,
        message: message,
        confirmText: confirmText,
        cancelText: cancelText,
        confirmColor: confirmColor,
        icon: icon,
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
      title: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, color: confirmColor),
            AppSpacing.horizontalSpace12,
          ],
          Expanded(child: AutoSizeText(title)),
        ],
      ),
      content: AutoSizeText(message),
      actions: [
        TextButton(
          onPressed: () {
            onCancel?.call();
            Navigator.of(context).pop(false);
          },
          child: AutoSizeText(cancelText ?? l10n.cancel),
        ),
        TextButton(
          onPressed: () {
            onConfirm?.call();
            Navigator.of(context).pop(true);
          },
          child: AutoSizeText(
            confirmText ?? l10n.confirm,
            style: TextStyle(color: confirmColor),
          ),
        ),
      ],
    );
  }
}