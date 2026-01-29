import 'dart:async';
import 'dart:io';

class InternetChecker {
  InternetChecker._();

  static final _connectivityController = StreamController<bool>.broadcast();
  static Stream<bool> get onConnectivityChanged => _connectivityController.stream;
  
  static Timer? _timer;
  static bool _lastStatus = true;

  static void startMonitoring({Duration interval = const Duration(seconds: 5)}) {
    stopMonitoring();
    _timer = Timer.periodic(interval, (_) async {
      final isConnected = await hasConnection();
      if (isConnected != _lastStatus) {
        _lastStatus = isConnected;
        _connectivityController.add(isConnected);
      }
    });
  }

  static void stopMonitoring() {
    _timer?.cancel();
    _timer = null;
  }

  static Future<bool> hasConnection() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  static Future<bool> checkConnection({
    String host = 'google.com',
    Duration timeout = const Duration(seconds: 10),
  }) async {
    try {
      final result = await InternetAddress.lookup(host).timeout(timeout);
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  static void dispose() {
    stopMonitoring();
    _connectivityController.close();
  }
}