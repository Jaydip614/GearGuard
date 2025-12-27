import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  AuthRemoteDataSource(this.client, this.baseUrl);

  Future<Map<String, dynamic>> signup(
      String name,
      String email,
      String password,
      ) async {
    final response = await client.post(
      Uri.parse('$baseUrl/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    }
    throw Exception('Signup failed');
  }

  Future<Map<String, dynamic>> signin(
      String email,
      String password,
      ) async {
    final response = await client.post(
      Uri.parse('$baseUrl/signin'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Signin failed');
  }
}
