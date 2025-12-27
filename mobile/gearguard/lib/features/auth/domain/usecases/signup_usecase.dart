import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignupUseCase {
  final AuthRepository repository;

  SignupUseCase(this.repository);

  Future<User> call(String name, String email, String password) {
    return repository.signup(name, email, password);
  }
}
