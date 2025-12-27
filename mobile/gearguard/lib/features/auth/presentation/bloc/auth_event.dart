abstract class AuthEvent {}

class AppStarted extends AuthEvent {}

class SignupRequested extends AuthEvent {
  final String name, email, password;
  SignupRequested(this.name, this.email, this.password);
}

class SigninRequested extends AuthEvent {
  final String email, password;
  SigninRequested(this.email, this.password);
}

class LogoutRequested extends AuthEvent {}
