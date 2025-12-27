import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> signup(String name, String email, String password);
  Future<User> signin(String email, String password);
  Future<User?> autoLogin();
  Future<void> logout();
}
