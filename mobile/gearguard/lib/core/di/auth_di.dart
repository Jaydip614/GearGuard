import '../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/auto_login_usecase.dart';
import '../../features/auth/domain/usecases/signin_usecase.dart';
import '../../features/auth/domain/usecases/signup_usecase.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import 'service_locator.dart';

Future<void> initAuth() async {
  // Bloc
  sl.registerFactory(
    () => AuthBloc(
      signup: sl(),
      signin: sl(),
      autoLogin: sl(),
      repository: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => SignupUseCase(sl()));
  sl.registerLazySingleton(() => SigninUseCase(sl()));
  sl.registerLazySingleton(() => AutoLoginUseCase(sl()));

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl()),
  );

  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSource(sl(), 'https://api.example.com'),
  );
}
