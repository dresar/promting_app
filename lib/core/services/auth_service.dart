import 'package:bcrypt/bcrypt.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import '../config/app_config_service.dart';

/// Mengelola operasi autentikasi: hash password, verify password, JWT sign/verify.
/// Pengganti logika auth yang sebelumnya di Node.js backend.
class AuthService {
  static AuthService? _instance;

  AuthService._();

  static AuthService get instance {
    _instance ??= AuthService._();
    return _instance!;
  }

  // ─── BCrypt ────────────────────────────────────────────────────────────────

  /// Hash password menggunakan BCrypt (cost factor 10)
  String hashPassword(String password) {
    return BCrypt.hashpw(password, BCrypt.gensalt());
  }

  /// Verifikasi password plain vs hash
  bool checkPassword(String password, String hashed) {
    return BCrypt.checkpw(password, hashed);
  }

  // ─── JWT ───────────────────────────────────────────────────────────────────

  /// Buat access token (expires 15 menit)
  Future<String> signAccessToken({
    required String userId,
    required String email,
    required String role,
  }) async {
    final secret = await AppConfigService.instance.jwtSecret;
    final jwt = JWT(
      {
        'userId': userId,
        'email': email,
        'role': role,
        'type': 'access',
      },
    );
    return jwt.sign(SecretKey(secret), expiresIn: const Duration(minutes: 15));
  }

  /// Buat refresh token (expires 7 hari)
  Future<String> signRefreshToken({
    required String userId,
    required String tokenId,
  }) async {
    final secret = await AppConfigService.instance.jwtRefreshSecret;
    final jwt = JWT(
      {
        'userId': userId,
        'tokenId': tokenId,
        'type': 'refresh',
      },
    );
    return jwt.sign(SecretKey(secret), expiresIn: const Duration(days: 7));
  }

  /// Verifikasi access token — throw exception jika invalid/expired
  Future<Map<String, dynamic>> verifyAccessToken(String token) async {
    final secret = await AppConfigService.instance.jwtSecret;
    final jwt = JWT.verify(token, SecretKey(secret));
    return jwt.payload as Map<String, dynamic>;
  }

  /// Verifikasi refresh token — throw exception jika invalid/expired
  Future<Map<String, dynamic>> verifyRefreshToken(String token) async {
    final secret = await AppConfigService.instance.jwtRefreshSecret;
    final jwt = JWT.verify(token, SecretKey(secret));
    return jwt.payload as Map<String, dynamic>;
  }

  /// Decode token tanpa verifikasi (untuk membaca userId saja)
  Map<String, dynamic>? decodeTokenWithoutVerify(String token) {
    try {
      final jwt = JWT.decode(token);
      return jwt.payload as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  /// Cek apakah access token masih valid (tidak expired)
  Future<bool> isAccessTokenValid(String token) async {
    try {
      await verifyAccessToken(token);
      return true;
    } catch (_) {
      return false;
    }
  }
}
