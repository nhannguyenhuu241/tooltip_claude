part of '../widgets.dart';

class EmptyWidget extends StatelessWidget {
  final String? title;
  final String? message;
  final IconData? icon;
  final Color? iconColor;
  final double? iconSize;
  final Widget? action;

  const EmptyWidget({
    super.key,
    this.title,
    this.message,
    this.icon,
    this.iconColor,
    this.iconSize,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final emptyTitle = title ?? l10n.noData;
    final emptyMessage = message ?? l10n.noResults;

    return Center(
      child: Padding(
        padding: AppSpacing.paddingAll24,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon ?? Icons.inbox_outlined,
              size: iconSize ?? 80,
              color: iconColor ?? Colors.grey,
            ),
            AppSpacing.verticalSpace16,
            AutoSizeText(
              emptyTitle,
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            AppSpacing.verticalSpace8,
            AutoSizeText(
              emptyMessage,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).textTheme.bodySmall?.color,
                  ),
              textAlign: TextAlign.center,
            ),
            if (action != null) ...[
              AppSpacing.verticalSpace24,
              action!,
            ],
          ],
        ),
      ),
    );
  }
}