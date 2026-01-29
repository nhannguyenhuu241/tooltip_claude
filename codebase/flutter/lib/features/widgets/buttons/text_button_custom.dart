part of '../widgets.dart';

class TextButtonCustom extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color? color;
  final TextStyle? style;
  final bool underline;

  const TextButtonCustom({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.color,
    this.style,
    this.underline = false,
  });

  @override
  Widget build(BuildContext context) {
    final textStyle = style ??
        Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: color ?? Theme.of(context).colorScheme.primary,
              decoration: underline ? TextDecoration.underline : null,
            );

    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: 16,
              color: color ?? Theme.of(context).colorScheme.primary,
            ),
            AppSpacing.horizontalSpace4,
          ],
          AutoSizeText(text, style: textStyle),
        ],
      ),
    );
  }
}