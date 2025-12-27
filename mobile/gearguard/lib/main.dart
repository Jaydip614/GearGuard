import 'package:flutter/material.dart';
import 'package:gearguard/app.dart';

import 'core/di/service_locator.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  /// DI
  await di.init();

  runApp(const GearGuardApp());
}
