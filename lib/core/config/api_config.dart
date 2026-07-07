/// Konfigurasi endpoint API.
/// Karena backend sekarang embedded (langsung ke Neon),
/// file ini hanya menyimpan konstanta nama endpoint yang masih
/// digunakan sebagai referensi internal — tidak ada HTTP URL.
class ApiConfig {
  // Tidak ada baseUrl — backend berjalan langsung di dalam aplikasi.
  // Semua akses data dilakukan via DatabaseService langsung ke Neon PostgreSQL.

  // Konstanta ini dipertahankan sebagai referensi tetapi tidak digunakan
  // oleh network layer (yang sudah dihapus).
  static const String login = 'auth/login';
  static const String register = 'auth/register';
  static const String demoLogin = 'auth/demo-login';
  static const String logout = 'auth/logout';
  static const String refreshToken = 'auth/refresh-token';

  static const String profile = 'users/profile';
  static const String changePassword = 'users/change-password';


  static const String generatePrompt = 'prompts/generate';
  static const String promptHistory = 'prompts/history';
  static const String favorites = 'prompts/favorites';

  static const String templates = 'templates';
  static const String templatesSearch = 'templates/search';

  static const String categories = 'categories';

  static const String settings = 'settings';
}
