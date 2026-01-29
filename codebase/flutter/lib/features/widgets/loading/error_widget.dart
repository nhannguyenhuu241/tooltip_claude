part of '../widgets.dart';

class ErrorWidgetCustom extends StatelessWidget {
  final String? title;
  final String? message;
  final VoidCallback? onRetry;
  final IconData? icon;
  final Color? iconColor;
  final double? iconSize;

  const ErrorWidgetCustom({
    super.key,
    this.title,
    this.message,
    this.onRetry,
    this.icon,
    this.iconColor,
    this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final errorTitle = title ?? l10n.error;
    final errorMessage = message ?? l10n.unknownError;

    return Center(
      child: Padding(
        padding: AppSpacing.paddingAll24,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon ?? Icons.error_outline,
              size: iconSize ?? 64,
              color: iconColor ?? AppColors.error,
            ),
            AppSpacing.verticalSpace16,
            AutoSizeText(
              errorTitle,
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            AppSpacing.verticalSpace8,
            AutoSizeText(
              errorMessage,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).textTheme.bodySmall?.color,
                  ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              AppSpacing.verticalSpace24,
              PrimaryButton(
                text: l10n.tryAgain,
                onPressed: onRetry,
                icon: Icons.refresh,
              ),
            ],
          ],
        ),
      ),
    );
  }
}