part of '../widgets.dart';

class ListTileCustom extends StatelessWidget {
  final Widget? leading;
  final String? title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final bool selected;
  final bool enabled;
  final EdgeInsetsGeometry? contentPadding;
  final Color? tileColor;
  final Color? selectedTileColor;
  final ShapeBorder? shape;
  final bool dense;

  const ListTileCustom({
    super.key,
    this.leading,
    this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.selected = false,
    this.enabled = true,
    this.contentPadding,
    this.tileColor,
    this.selectedTileColor,
    this.shape,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: leading,
      title: title != null ? AutoSizeText(title!) : null,
      subtitle: subtitle != null ? AutoSizeText(subtitle!) : null,
      trailing: trailing,
      onTap: enabled ? onTap : null,
      onLongPress: enabled ? onLongPress : null,
      selected: selected,
      enabled: enabled,
      contentPadding: contentPadding ?? AppSpacing.paddingHorizontal16,
      tileColor: tileColor,
      selectedTileColor: selectedTileColor,
      shape: shape ??
          RoundedRectangleBorder(
            borderRadius: AppSpacing.borderRadiusAll8,
          ),
      dense: dense,
    );
  }
}