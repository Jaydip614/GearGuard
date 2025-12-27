import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/signup_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';

class AppRouter {
  final AuthBloc authBloc;

  AppRouter(this.authBloc);

  late final GoRouter router = GoRouter(
    initialLocation: '/',
    refreshListenable: StreamListenable(authBloc.stream),
    redirect: (context, state) {
      final authState = authBloc.state;
      final isLoggingIn = state.uri.toString() == '/login';
      final isSigningUp = state.uri.toString() == '/signup';
      final isAuthenticated = authState.isAuthenticated;

      if (!isAuthenticated) {
        if (isLoggingIn || isSigningUp) {
          return null;
        }
        return '/login';
      }

      if (isLoggingIn || isSigningUp) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
    ],
  );
}

class StreamListenable extends ChangeNotifier {
  final Stream stream;

  StreamListenable(this.stream) {
    stream.listen((_) => notifyListeners());
  }
}
