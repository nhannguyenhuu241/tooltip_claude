import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Config {
  static Map<String, dynamic> _config = {};
  static String _environment = 'production';
  static SharedPreferences? _prefs;

  static Map<String, dynamic> get config => _config;
  static String get environment => _environment;
  static SharedPreferences? get prefs => _prefs;

  static Map<String, dynamic> get currentEnvironmentConfig {
    return _config[_environment] ?? {};
  }

  static String get appName => currentEnvironmentConfig['appName'] ?? 'Clara';
  static String get appId => currentEnvironmentConfig['appId'] ?? 'com.clara.app';
  static String get versionName => currentEnvironmentConfig['versionName'] ?? '1.0.0';
  static int get versionCode => currentEnvironmentConfig['versionCode'] ?? 1;
  static String get server => currentEnvironmentConfig['server'] ?? '';
  static String get langDefault => currentEnvironmentConfig['langDefault'] ?? 'vi';
  static bool get enableLang => currentEnvironmentConfig['enableLang'] ?? true;
  static String get releaseDate => currentEnvironmentConfig['releaseDate'] ?? '';
  static String get storeFile => currentEnvironmentConfig['storeFile'] ?? '';
  static String get storePassword => currentEnvironmentConfig['storePassword'] ?? '';
  static String get keyAlias => currentEnvironmentConfig['keyAlias'] ?? '';
  static String get keyPassword => currentEnvironmentConfig['keyPassword'] ?? '';
  static bool get displayPrint => currentEnvironmentConfig['displayPrint'] ?? false;

  static Future<void> loadConfig() async {
    try {
      final String jsonString = await rootBundle.loadString('assets/config/config.json');
      _config = json.decode(jsonString);
      _environment = _config['environment'] ?? 'production';
    } catch (e) {
      print('Error loading config: $e');
    }
  }

  static Future<void> getPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static Future<void> init() async {
    await loadConfig();
    await getPreferences();
  }

  static void setEnvironment(String env) {
    if (_config.containsKey(env)) {
      _environment = env;
    }
  }

  static void printConfig() {
    if (displayPrint) {
      print('=== Configuration ===');
      print('Environment: $_environment');
      print('App Name: $appName');
      print('App ID: $appId');
      print('Version: $versionName ($versionCode)');
      print('Server: $server');
      print('Default Language: $langDefault');
      print('Enable Language: $enableLang');
      print('Release Date: $releaseDate');
      print('==================');
    }
  }
}