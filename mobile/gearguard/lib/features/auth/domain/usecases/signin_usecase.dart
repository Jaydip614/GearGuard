import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SigninUseCase {
  final AuthRepository repository;

  SigninUseCase(this.repository);

  Future<User> call(String email, String password) {
    return repository.signin(email, password);
  }
}
