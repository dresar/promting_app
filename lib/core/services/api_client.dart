import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';

class ApiClient {
  static final String _baseUrl = EnvConfig.baseUrl;
  final SecureStorageService _secureStorage;
  final http.Client _client;

  ApiClient(this._secureStorage) : _client = http.Client();

  Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requireAuth) {
      final token = await _secureStorage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Future<http.Response> get(String path, {bool requireAuth = true}) async {
    final url = Uri.parse('$_baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);

    var response = await _client.get(url, headers: headers);
    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        response = await _client.get(url, headers: newHeaders);
      }
    }
    return response;
  }

  Future<http.Response> post(
    String path, {
    dynamic body,
    bool requireAuth = true,
  }) async {
    final url = Uri.parse('$_baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final jsonBody = body != null ? jsonEncode(body) : null;

    var response = await _client.post(url, headers: headers, body: jsonBody);
    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        response = await _client.post(url, headers: newHeaders, body: jsonBody);
      }
    }
    return response;
  }

  Future<http.Response> put(
    String path, {
    dynamic body,
    bool requireAuth = true,
  }) async {
    final url = Uri.parse('$_baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final jsonBody = body != null ? jsonEncode(body) : null;

    var response = await _client.put(url, headers: headers, body: jsonBody);
    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        response = await _client.put(url, headers: newHeaders, body: jsonBody);
      }
    }
    return response;
  }

  Future<http.Response> delete(String path, {bool requireAuth = true}) async {
    final url = Uri.parse('$_baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);

    var response = await _client.delete(url, headers: headers);
    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        response = await _client.delete(url, headers: newHeaders);
      }
    }
    return response;
  }

  Future<http.Response> uploadFile(
    String path,
    String filePath, {
    List<int>? bytes,
    String? fileName,
    bool requireAuth = true,
  }) async {
    final url = Uri.parse('$_baseUrl$path');
    var request = http.MultipartRequest('POST', url);

    final headers = await _getHeaders(requireAuth: requireAuth);
    // Remove content-type so multipart boundary is generated correctly
    headers.remove('Content-Type');
    request.headers.addAll(headers);

    if (bytes != null && bytes.isNotEmpty) {
      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          bytes,
          filename: fileName ?? 'upload.png',
        ),
      );
    } else {
      request.files.add(await http.MultipartFile.fromPath('file', filePath));
    }

    var streamedResponse = await _client.send(request);
    var response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        var newRequest = http.MultipartRequest('POST', url);
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        newHeaders.remove('Content-Type');
        newRequest.headers.addAll(newHeaders);

        if (bytes != null && bytes.isNotEmpty) {
          newRequest.files.add(
            http.MultipartFile.fromBytes(
              'file',
              bytes,
              filename: fileName ?? 'upload.png',
            ),
          );
        } else {
          newRequest.files.add(
            await http.MultipartFile.fromPath('file', filePath),
          );
        }

        streamedResponse = await _client.send(newRequest);
        response = await http.Response.fromStream(streamedResponse);
      }
    }
    return response;
  }

  Future<http.Response> uploadFiles(
    String path,
    List<Map<String, dynamic>> filesData, {
    bool requireAuth = true,
  }) async {
    final url = Uri.parse('$_baseUrl$path');
    var request = http.MultipartRequest('POST', url);

    final headers = await _getHeaders(requireAuth: requireAuth);
    headers.remove('Content-Type');
    request.headers.addAll(headers);

    for (var fileData in filesData) {
      final bytes = fileData['bytes'] as List<int>;
      final fileName = fileData['fileName'] as String;
      request.files.add(
        http.MultipartFile.fromBytes(
          'files', // Important: must match backend expect array field name
          bytes,
          filename: fileName,
        ),
      );
    }

    var streamedResponse = await _client.send(request);
    var response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 401 && requireAuth) {
      final success = await _handleRefreshToken();
      if (success) {
        var newRequest = http.MultipartRequest('POST', url);
        final newHeaders = await _getHeaders(requireAuth: requireAuth);
        newHeaders.remove('Content-Type');
        newRequest.headers.addAll(newHeaders);

        for (var fileData in filesData) {
          final bytes = fileData['bytes'] as List<int>;
          final fileName = fileData['fileName'] as String;
          newRequest.files.add(
            http.MultipartFile.fromBytes('files', bytes, filename: fileName),
          );
        }

        streamedResponse = await _client.send(newRequest);
        response = await http.Response.fromStream(streamedResponse);
      }
    }
    return response;
  }

  Future<bool> _handleRefreshToken() async {
    final refreshToken = await _secureStorage.getRefreshToken();
    if (refreshToken == null || refreshToken.isEmpty) {
      return false;
    }

    try {
      final url = Uri.parse('$_baseUrl/api/auth/refresh');
      final response = await _client.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final newAccessToken = data['accessToken'] as String;
        await _secureStorage.saveAccessToken(newAccessToken);
        return true;
      }
    } catch (_) {}
    return false;
  }
}
