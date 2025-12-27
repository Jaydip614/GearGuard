import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/signin_usecase.dart';
import '../../domain/usecases/signup_usecase.dart';
import '../../domain/usecases/auto_login_usecase.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SignupUseCase signup;
  final SigninUseCase signin;
  final AutoLoginUseCase autoLogin;
  final AuthRepository repository;

  AuthBloc({
    required this.signup,
    required this.signin,
    required this.autoLogin,
    required this.repository,
  }) : super(const AuthState()) {
    on<AppStarted>(_onAppStarted);
    on<SignupRequested>(_onSignup);
    on<SigninRequested>(_onSignin);
    on<LogoutRequested>(_onLogout);
  }

  Future<void> _onAppStarted(
      AppStarted event,
      Emitter<AuthState> emit,
      ) async {
    emit(const AuthState(isLoading: true));
    final user = await autoLogin();
    emit(AuthState(user: user));
  }

  Future<void> _onSignup(
      SignupRequested event,
      Emitter<AuthState> emit,
      ) async {
    emit(const AuthState(isLoading: true));
    try {
      final user = await signup(event.name, event.email, event.password);
      emit(AuthState(user: user));
    } catch (e) {
      emit(AuthState(error: e.toString()));
    }
  }

  Future<void> _onSignin(
      SigninRequested event,
      Emitter<AuthState> emit,
      ) async {
    emit(const AuthState(isLoading: true));
    try {
      final user = await signin(event.email, event.password);
      emit(AuthState(user: user));
    } catch (e) {
      emit(AuthState(error: e.toString()));
    }
  }

  Future<void> _onLogout(
      LogoutRequested event,
      Emitter<AuthState> emit,
      ) async {
    await repository.logout();
    emit(const AuthState());
  }
}
