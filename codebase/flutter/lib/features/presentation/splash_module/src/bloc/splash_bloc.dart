import 'dart:async';
import 'package:flutter/material.dart';

enum SplashState { loading, completed }

class SplashBloc extends ChangeNotifier {
  SplashState _state = SplashState.loading;
  SplashState get state => _state;

  Timer? _timer;

  void init() {
    _startSplashTimer();
    _initializeApp();
  }

  void _startSplashTimer() {
    _timer = Timer(const Duration(seconds: 3), () {
      _updateState(SplashState.completed);
    });
  }

  Future<void> _initializeApp() async {
    try {
      await Future.delayed(const Duration(seconds: 2));
      
    } catch (e) {
      debugPrint('Initialization error: $e');
    }
  }

  void _updateState(SplashState newState) {
    _state = newState;
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}