part of '../widgets.dart';

class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData? icon;
  final Color? iconColor;
  final Color? backgroundColor;
  final String? change;
  final bool? isPositive;
  final VoidCallback? onTap;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    this.icon,
    this.iconColor,
    this.backgroundColor,
    this.change,
    this.isPositive,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: backgroundColor,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppSpacing.borderRadiusAll12,
        child: Padding(
          padding: AppSpacing.paddingAll16,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: AutoSizeText(
                      title,
                      style: Theme.of(context).textTheme.bodySmall,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (icon != null)
                    Icon(
                      icon,
                      size: 24,
                      color: iconColor ?? Theme.of(context).colorScheme.primary,
                    ),
                ],
              ),
              AppSpacing.verticalSpace8,
              AutoSizeText(
                value,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              if (change != null) ...[
                AppSpacing.verticalSpace4,
                Row(
                  children: [
                    Icon(
                      isPositive == true
                          ? Icons.trending_up
                          : isPositive == false
                              ? Icons.trending_down
                              : Icons.trending_flat,
                      size: 16,
                      color: isPositive == true
                          ? AppColors.success
                          : isPositive == false
                              ? AppColors.error
                              : Colors.grey,
                    ),
                    AppSpacing.horizontalSpace4,
                    AutoSizeText(
                      change!,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: isPositive == true
                                ? AppColors.success
                                : isPositive == false
                                    ? AppColors.error
                                    : Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}