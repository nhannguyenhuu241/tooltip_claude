import 'package:flutter/material.dart';

class CustomNavigator {
  CustomNavigator._();

  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  
  static NavigatorState? get _navigator => navigatorKey.currentState;

  static Future<T?> push<T extends Object?>(Widget page) async {
    return await _navigator?.push<T>(
      MaterialPageRoute(builder: (_) => page),
    );
  }

  static Future<T?> pushNamed<T extends Object?>(
    String routeName, {
    Object? arguments,
  }) async {
    return await _navigator?.pushNamed<T>(
      routeName,
      arguments: arguments,
    );
  }

  static Future<T?> pushReplacement<T extends Object?, TO extends Object?>(
    Widget page, {
    TO? result,
  }) async {
    return await _navigator?.pushReplacement<T, TO>(
      MaterialPageRoute(builder: (_) => page),
      result: result,
    );
  }

  static Future<T?> pushReplacementNamed<T extends Object?, TO extends Object?>(
    String routeName, {
    TO? result,
    Object? arguments,
  }) async {
    return await _navigator?.pushReplacementNamed<T, TO>(
      routeName,
      result: result,
      arguments: arguments,
    );
  }

  static Future<T?> pushAndRemoveUntil<T extends Object?>(
    Widget page,
    RoutePredicate predicate,
  ) async {
    return await _navigator?.pushAndRemoveUntil<T>(
      MaterialPageRoute(builder: (_) => page),
      predicate,
    );
  }

  static Future<T?> pushNamedAndRemoveUntil<T extends Object?>(
    String newRouteName,
    RoutePredicate predicate, {
    Object? arguments,
  }) async {
    return await _navigator?.pushNamedAndRemoveUntil<T>(
      newRouteName,
      predicate,
      arguments: arguments,
    );
  }

  static void pop<T extends Object?>([T? result]) {
    _navigator?.pop<T>(result);
  }

  static void popUntil(RoutePredicate predicate) {
    _navigator?.popUntil(predicate);
  }

  static bool canPop() => _navigator?.canPop() ?? false;

  static Future<bool> maybePop<T extends Object?>([T? result]) async {
    return await _navigator?.maybePop<T>(result) ?? false;
  }

  static void popToRoot() {
    _navigator?.popUntil((route) => route.isFirst);
  }
}