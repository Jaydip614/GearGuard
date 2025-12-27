import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remote;

  static const _tokenKey = 'auth_token';

  AuthRepositoryImpl(this.remote);

  @override
  Future<User> signup(String name, String email, String password) async {
    final data = await remote.signup(name, email, password);
    final user = UserModel.fromJson(data);
    await _saveToken(user.token);
    return user;
  }

  @override
  Future<User> signin(String email, String password) async {
    final data = await remote.signin(email, password);
    final user = UserModel.fromJson(data);
    await _saveToken(user.token);
    return user;
  }

  @override
  Future<User?> autoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);

    if (token == null) return null;

    return User(
      id: '',
      name: '',
      email: '',
      token: token,
    );
  }

  @override
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
}
