import 'package:flutter/foundation.dart' show kIsWeb;

class EnvConfig {
  /// Ubah ke `false` untuk Production, atau `true` untuk Development (Lokal)
  static const bool isDevelopment = false;

  /// URL API untuk development lokal (Node.js berjalan di localhost)
  static String get devBaseUrl => kIsWeb ? 'http://localhost:3000' : 'http://10.0.2.2:3000'; 

  /// URL API ketika backend Node.js sudah di-hosting di cPanel (berdomain)
  static const String prodBaseUrl = 'https://promting.apprentice.cyou'; 

  /// Mengambil URL aktif berdasarkan mode environment
  static String get baseUrl => isDevelopment ? devBaseUrl : prodBaseUrl;
}
