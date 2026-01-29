import 'package:construction_project/core/theme/app_spacing.dart';
import 'package:construction_project/core/utils/validators.dart';
import 'package:construction_project/features/widgets/widgets.dart';
import 'package:construction_project/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


class DemoFormScreen extends StatefulWidget {
  const DemoFormScreen({super.key});

  @override
  State<DemoFormScreen> createState() => _DemoFormScreenState();
}

class _DemoFormScreenState extends State<DemoFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _nameController.dispose();
    _usernameController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppLocalizations.of(context)!.success),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.profile),
      ),
      body: SingleChildScrollView(
        padding: AppSpacing.paddingAll16,
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: l10n.fullName,
                  prefixIcon: const Icon(Icons.person),
                ),
                validator: Validators.required(context),
                textCapitalization: TextCapitalization.words,
              ),
              AppSpacing.verticalSpace16,
              
              TextFormField(
                controller: _usernameController,
                decoration: InputDecoration(
                  labelText: l10n.username,
                  prefixIcon: const Icon(Icons.account_circle),
                  helperText: '3-20 characters, letters, numbers, ., -, _',
                ),
                validator: (value) {
                  final requiredError = Validators.required(context)(value);
                  if (requiredError != null) return requiredError;
                  
                  if (!Validators.isValidUsername(value)) {
                    return 'Invalid username format';
                  }
                  return null;
                },
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z0-9._-]')),
                  LengthLimitingTextInputFormatter(20),
                ],
              ),
              AppSpacing.verticalSpace16,
              
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: l10n.email,
                  prefixIcon: const Icon(Icons.email),
                ),
                validator: Validators.email(context),
                keyboardType: TextInputType.emailAddress,
                autocorrect: false,
              ),
              AppSpacing.verticalSpace16,
              
              TextFormField(
                controller: _phoneController,
                decoration: InputDecoration(
                  labelText: l10n.phoneNumber,
                  prefixIcon: const Icon(Icons.phone),
                  helperText: 'Vietnamese phone format',
                ),
                validator: Validators.phoneNumber(context),
                keyboardType: TextInputType.phone,
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[0-9+\s-]')),
                  LengthLimitingTextInputFormatter(15),
                ],
                onChanged: (value) {
                  if (value.length == 10 && Validators.isPhoneNumber(value)) {
                    _phoneController.text = Validators.formatPhoneNumber(value);
                    _phoneController.selection = TextSelection.fromPosition(
                      TextPosition(offset: _phoneController.text.length),
                    );
                  }
                },
              ),
              AppSpacing.verticalSpace16,
              
              PasswordField(
                controller: _passwordController,
                labelText: l10n.password,
                hintText: 'Minimum 6 characters',
                validator: Validators.password(context, minLength: 6),
                showStrengthIndicator: true,
              ),
              AppSpacing.verticalSpace16,
              
              TextFormField(
                controller: _confirmPasswordController,
                decoration: InputDecoration(
                  labelText: l10n.confirmPassword,
                  prefixIcon: const Icon(Icons.lock_outline),
                ),
                validator: Validators.confirmPassword(
                  context,
                  _passwordController.text,
                ),
                obscureText: true,
                autocorrect: false,
              ),
              AppSpacing.verticalSpace24,
              
              PrimaryButton(
                text: l10n.submit,
                onPressed: _submitForm,
                icon: Icons.send,
              ),
              AppSpacing.verticalSpace16,
              
              Card(
                child: Padding(
                  padding: AppSpacing.paddingAll16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Validation Examples:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      AppSpacing.verticalSpace8,
                      Text('Email: ${_emailController.text}'),
                      if (_emailController.text.isNotEmpty &&
                          Validators.isEmail(_emailController.text))
                        Text(
                          'Masked: ${Validators.maskEmail(_emailController.text)}',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      AppSpacing.verticalSpace4,
                      Text('Phone: ${_phoneController.text}'),
                      if (_phoneController.text.isNotEmpty &&
                          Validators.isPhoneNumber(_phoneController.text))
                        Text(
                          'Masked: ${Validators.maskPhoneNumber(_phoneController.text)}',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      AppSpacing.verticalSpace4,
                      if (_passwordController.text.isNotEmpty)
                        Text(
                          'Password strength: ${Validators.isStrongPassword(_passwordController.text) ? "Strong" : "Weak"}',
                          style: TextStyle(
                            color: Validators.isStrongPassword(_passwordController.text)
                                ? Colors.green
                                : Colors.orange,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}