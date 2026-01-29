part of '../widgets.dart';

class LoadingDialog extends StatelessWidget {
  final String? message;

  const LoadingDialog({
    super.key,
    this.message,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required Future<T> Function() future,
    String? message,
    bool barrierDismissible = false,
  }) async {
    showDialog(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (context) => LoadingDialog(message: message),
    );

    try {
      final result = await future();
      if (context.mounted) {
        Navigator.of(context).pop();
      }
      return result;
    } catch (e) {
      if (context.mounted) {
        Navigator.of(context).pop();
      }
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final loadingMessage = message ?? l10n.loading;

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Center(
        child: Container(
          padding: AppSpacing.paddingAll24,
          decoration: BoxDecoration(
            color: Theme.of(context).dialogTheme.backgroundColor ?? Theme.of(context).colorScheme.surface,
            borderRadius: AppSpacing.borderRadiusAll16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              if (loadingMessage.isNotEmpty) ...[
                AppSpacing.verticalSpace16,
                AutoSizeText(
                  loadingMessage,
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}