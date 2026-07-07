import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:sqflite/sqflite.dart' as sqflite;
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:path/path.dart' as p;
import 'package:connectivity_plus/connectivity_plus.dart';

/// Singleton service yang mengelola offline SQLite database (tidak lagi langsung ke Neon DB).
class DatabaseService {
  static DatabaseService? _instance;
  sqflite.Database? _sqliteDb;

  DatabaseService._();

  static DatabaseService get instance {
    _instance ??= DatabaseService._();
    return _instance!;
  }

  Future<bool> get isOnline async {
    final connectivityResult = await Connectivity().checkConnectivity();
    if (connectivityResult.contains(ConnectivityResult.none)) {
      return false;
    }
    return true;
  }

  Future<sqflite.Database> _getSqliteDb() async {
    if (_sqliteDb == null) {
      if (!kIsWeb && (Platform.isWindows || Platform.isLinux)) {
        sqfliteFfiInit();
        sqflite.databaseFactory = databaseFactoryFfi;
      }
      final dbPath = await sqflite.getDatabasesPath();
      final path = p.join(dbPath, 'prompt_studio.db');

      _sqliteDb = await sqflite.openDatabase(
        path,
        version: 3,
        onUpgrade: (db, oldVersion, newVersion) async {
          if (oldVersion < 2) {
            final tables = [
              'prompt_histories',
              'favorite_prompts',
              'activity_logs',
              'groq_api_keys',
              'app_config',
              'categories',
              'target_audiences',
              'design_styles',
            ];
            for (var table in tables) {
              await db.execute('DROP TABLE IF EXISTS $table');
            }
            await _createTables(db);
          }
          if (oldVersion < 3) {
            await db.execute('DROP TABLE IF EXISTS digital_product_types');
            await db.execute('CREATE TABLE IF NOT EXISTS digital_product_types (id TEXT PRIMARY KEY, name TEXT UNIQUE)');
          }
        },
        onCreate: (db, version) async {
          await _createTables(db);
        },
      );
    }
    return _sqliteDb!;
  }

  Future<void> _createTables(sqflite.Database db) async {
    await db.execute('''
      CREATE TABLE prompt_histories (
        id TEXT PRIMARY KEY,
        "userId" TEXT,
        title TEXT,
        "contentType" TEXT,
        "slideCount" INTEGER,
        "designStyle" TEXT,
        "targetAudience" TEXT,
        language TEXT,
        "generatedPrompt" TEXT,
        "createdAt" TEXT,
        "updatedAt" TEXT
      )
    ''');
    
    await db.execute('''
      CREATE TABLE favorite_prompts (
        id TEXT PRIMARY KEY,
        "userId" TEXT,
        "promptHistoryId" TEXT,
        "createdAt" TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE activity_logs (
        id TEXT PRIMARY KEY,
        "userId" TEXT,
        action TEXT,
        metadata TEXT,
        "createdAt" TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE groq_api_keys (
        id TEXT PRIMARY KEY,
        api_key TEXT UNIQUE,
        is_active INTEGER DEFAULT 1,
        last_used_at TEXT,
        error_count INTEGER DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        slug TEXT,
        icon TEXT,
        color TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS target_audiences (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS design_styles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        prompt TEXT,
        imageUrl TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS digital_product_types (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE
      )
    ''');
  }

  /// Eksekusi query SQL dengan positional parameters ($1, $2, ...).
  Future<Iterable<List<dynamic>>> execute(String sql, [List<Object?> parameters = const []]) async {
    if (kIsWeb) {
      return const [];
    }
    return _executeSqlite(sql, parameters);
  }

  Future<Iterable<List<dynamic>>> _executeSqlite(String sql, List<Object?> parameters) async {
    final db = await _getSqliteDb();
    
    String sqliteSql = sql.replaceAll('::text', '');
    sqliteSql = sqliteSql.replaceAll('NOW()', "datetime('now')");

    final RegExp paramRegExp = RegExp(r'\$(\d+)');
    List<Object?> sqliteParams = [];
    
    sqliteSql = sqliteSql.replaceAllMapped(paramRegExp, (match) {
      final index = int.parse(match.group(1)!) - 1;
      if (index >= 0 && index < parameters.length) {
        var param = parameters[index];
        if (param is bool) {
          param = param ? 1 : 0;
        }
        sqliteParams.add(param);
      } else {
        sqliteParams.add(null);
      }
      return '?';
    });

    if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
      final result = await db.rawQuery(sqliteSql, sqliteParams);
      return result.map((row) => row.values.toList()).toList();
    } else {
      await db.execute(sqliteSql, sqliteParams);
      return []; 
    }
  }

  Future<void> close() async {
    await _sqliteDb?.close();
    _sqliteDb = null;
  }
}
