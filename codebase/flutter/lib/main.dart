import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/providers/theme_provider.dart';
import 'core/providers/locale_provider.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/custom_navigator.dart';
import 'core/config.dart';
import 'core/utils/globals.dart';
import 'core/utils/utility.dart';
import 'l10n/app_localizations.dart';
import 'features/presentation/splash_module/src/ui/splash_screen.dart';
import 'features/presentation/splash_module/src/bloc/splash_bloc.dart';
import 'package:overlay_support/overlay_support.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Config.init();
  Config.printConfig();
  
  Utility.changeStatusBarColor(Colors.transparent, false);
  
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  
  Globals.myApp = GlobalKey<_MyAppState>();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => SplashBloc()),
      ],
      child: MyApp(key: Globals.myApp),
    ),
  );
}
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Widget? child;
  GlobalKey _key = GlobalKey();
  GlobalKey _childKey = GlobalKey();
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    child = SplashScreen();
  }

  onRestart() async {
    await Config.getPreferences();
    child = SplashScreen();
    _key = GlobalKey();
    _childKey = GlobalKey();
    setState(() {});
  }

  onRefresh() {
    _childKey = GlobalKey();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<ThemeProvider, LocaleProvider>(
      builder: (context, themeProvider, localeProvider, child) {
        return OverlaySupport.global(
          child: AnnotatedRegion<SystemUiOverlayStyle>(
            value: SystemUiOverlayStyle(
              statusBarColor: Colors.transparent,
              systemNavigationBarColor: Colors.white,
              statusBarIconBrightness: Brightness.dark,
              systemNavigationBarIconBrightness: Brightness.dark,
            ),
            child: MaterialApp(
              key: _key,
              debugShowCheckedModeBanner: false,
              navigatorKey: CustomNavigator.navigatorKey,
              theme: AppTheme.lightTheme,
              darkTheme: AppTheme.darkTheme,
              themeMode: themeProvider.themeMode,
              locale: localeProvider.locale,
              localizationsDelegates: [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              supportedLocales: const [
                Locale('vi'),
                Locale('en'),
                Locale('zh'),
              ],
              home: const SplashScreen(),
            ),
          ),
        );
      },
    );
  }
}

// class MyHomePage extends StatefulWidget {
//   const MyHomePage({super.key});
//
//   @override
//   State<MyHomePage> createState() => _MyHomePageState();
// }
//
// class _MyHomePageState extends State<MyHomePage> {
//   final int _counter = 0;
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         backgroundColor: Theme.of(context).colorScheme.inversePrimary,
//         title: Text(AppLocalizations.of(context)!.appName),
//         actions: [
//           PopupMenuButton<Locale>(
//             icon: const Icon(Icons.language),
//             onSelected: (Locale locale) {
//               context.read<LocaleProvider>().setLocale(locale);
//             },
//             itemBuilder: (context) => [
//               const PopupMenuItem(
//                 value: Locale('vi'),
//                 child: Text('Tiếng Việt 🇻🇳'),
//               ),
//               const PopupMenuItem(
//                 value: Locale('en'),
//                 child: Text('English 🇬🇧'),
//               ),
//               const PopupMenuItem(
//                 value: Locale('zh'),
//                 child: Text('中文 🇨🇳'),
//               ),
//             ],
//           ),
//           IconButton(
//             icon: Icon(
//               Theme.of(context).brightness == Brightness.dark
//                   ? Icons.light_mode
//                   : Icons.dark_mode,
//             ),
//             onPressed: () {
//               context.read<ThemeProvider>().toggleTheme();
//             },
//           ),
//         ],
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             Text(AppLocalizations.of(context)!.welcome),
//             Text(
//               '$_counter',
//               style: Theme.of(context).textTheme.headlineMedium,
//             ),
//           ],
//         ),
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(
//               builder: (context) => const DemoFormScreen(),
//             ),
//           );
//         },
//         tooltip: 'Demo Form',
//         child: const Icon(Icons.edit_note),
//       ), // This trailing comma makes auto-formatting nicer for build methods.
//     );
//   }
// }
