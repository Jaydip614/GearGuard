import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class AutoLoginUseCase {
  final AuthRepository repository;

  AutoLoginUseCase(this.repository);

  Future<User?> call() {
    return repository.autoLogin();
  }
}
