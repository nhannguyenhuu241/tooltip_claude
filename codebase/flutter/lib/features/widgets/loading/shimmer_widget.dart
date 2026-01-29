part of '../widgets.dart';

class ShimmerWidget extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? margin;
  final Widget? child;

  const ShimmerWidget({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
    this.margin,
    this.child,
  });

  factory ShimmerWidget.rectangular({
    required double width,
    required double height,
    BorderRadius? borderRadius,
    EdgeInsetsGeometry? margin,
  }) {
    return ShimmerWidget(
      width: width,
      height: height,
      borderRadius: borderRadius ?? AppSpacing.borderRadiusAll8,
      margin: margin,
    );
  }

  factory ShimmerWidget.circular({
    required double size,
    EdgeInsetsGeometry? margin,
  }) {
    return ShimmerWidget(
      width: size,
      height: size,
      borderRadius: BorderRadius.circular(size / 2),
      margin: margin,
    );
  }

  @override
  State<ShimmerWidget> createState() => _ShimmerWidgetState();
}

class _ShimmerWidgetState extends State<ShimmerWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
    _animation = Tween<double>(
      begin: -2,
      end: 2,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? Colors.grey[700]! : Colors.grey[300]!;
    final highlightColor = isDark ? Colors.grey[600]! : Colors.grey[100]!;

    return Container(
      width: widget.width,
      height: widget.height,
      margin: widget.margin,
      decoration: BoxDecoration(
        borderRadius: widget.borderRadius,
        color: baseColor,
      ),
      child: widget.child ??
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  borderRadius: widget.borderRadius,
                  gradient: LinearGradient(
                    begin: Alignment(_animation.value - 1, 0),
                    end: Alignment(_animation.value + 1, 0),
                    colors: [
                      baseColor,
                      highlightColor,
                      baseColor,
                    ],
                  ),
                ),
              );
            },
          ),
    );
  }
}