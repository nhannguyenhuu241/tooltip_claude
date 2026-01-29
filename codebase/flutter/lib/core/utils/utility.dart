import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class Utility {
  Utility._();

  static void changeStatusBarColor(Color color, bool isDarkIcon) {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: color,
        statusBarIconBrightness: isDarkIcon ? Brightness.dark : Brightness.light,
        statusBarBrightness: isDarkIcon ? Brightness.light : Brightness.dark,
      ),
    );
  }
}