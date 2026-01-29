part of '../widgets.dart';

class PasswordField extends StatefulWidget {
  final TextEditingController? controller;
  final String? labelText;
  final String? hintText;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String)? onFieldSubmitted;
  final TextInputAction? textInputAction;
  final bool showStrengthIndicator;
  final FocusNode? focusNode;
  final bool autofocus;

  const PasswordField({
    super.key,
    this.controller,
    this.labelText,
    this.hintText,
    this.validator,
    this.onChanged,
    this.onFieldSubmitted,
    this.textInputAction,
    this.showStrengthIndicator = false,
    this.focusNode,
    this.autofocus = false,
  });

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;
  String _password = '';

  @override
  void initState() {
    super.initState();
    widget.controller?.addListener(_updatePassword);
  }

  @override
  void dispose() {
    widget.controller?.removeListener(_updatePassword);
    super.dispose();
  }

  void _updatePassword() {
    if (widget.controller != null) {
      setState(() {
        _password = widget.controller!.text;
      });
    }
  }

  Color _getStrengthColor() {
    if (_password.isEmpty) return Colors.grey;
    if (_password.length < 6) return AppColors.error;
    if (Validators.isStrongPassword(_password)) return AppColors.success;
    return AppColors.warning;
  }

  String _getStrengthText(BuildContext context) {
    if (_password.isEmpty) return '';
    if (_password.length < 6) return 'Weak';
    if (Validators.isStrongPassword(_password)) return 'Strong';
    return 'Medium';
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: widget.controller,
          validator: widget.validator,
          onChanged: (value) {
            if (widget.showStrengthIndicator) {
              setState(() {
                _password = value;
              });
            }
            widget.onChanged?.call(value);
          },
          onFieldSubmitted: widget.onFieldSubmitted,
          textInputAction: widget.textInputAction,
          obscureText: _obscureText,
          focusNode: widget.focusNode,
          autofocus: widget.autofocus,
          decoration: InputDecoration(
            labelText: widget.labelText ?? l10n.password,
            hintText: widget.hintText,
            prefixIcon: const Icon(Icons.lock_outline),
            suffixIcon: IconButton(
              icon: Icon(
                _obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
              ),
              onPressed: () {
                setState(() {
                  _obscureText = !_obscureText;
                });
              },
            ),
          ),
        ),
        if (widget.showStrengthIndicator && _password.isNotEmpty) ...[
          AppSpacing.verticalSpace8,
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: _password.length < 6
                      ? 0.33
                      : Validators.isStrongPassword(_password)
                          ? 1.0
                          : 0.66,
                  backgroundColor: Colors.grey.shade300,
                  valueColor: AlwaysStoppedAnimation<Color>(_getStrengthColor()),
                ),
              ),
              AppSpacing.horizontalSpace8,
              AutoSizeText(
                _getStrengthText(context),
                style: TextStyle(
                  color: _getStrengthColor(),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}