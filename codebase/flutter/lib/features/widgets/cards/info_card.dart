part of '../widgets.dart';

class InfoCard extends StatelessWidget {
  final String? title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? elevation;

  const InfoCard({
    super.key,
    this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.backgroundColor,
    this.padding,
    this.margin,
    this.elevation,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: elevation ?? 1,
      color: backgroundColor,
      margin: margin ?? EdgeInsets.zero,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppSpacing.borderRadiusAll12,
        child: Padding(
          padding: padding ?? AppSpacing.paddingAll16,
          child: Row(
            children: [
              if (leading != null) ...[
                leading!,
                AppSpacing.horizontalSpace16,
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (title != null)
                      AutoSizeText(
                        title!,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    if (subtitle != null) ...[
                      if (title != null) AppSpacing.verticalSpace4,
                      AutoSizeText(
                        subtitle!,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ],
                ),
              ),
              if (trailing != null) ...[
                AppSpacing.horizontalSpace16,
                trailing!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}