import 'dart:convert';
import 'dart:io';

import 'package:neardb/src/helpers.dart';
import 'package:neardb/src/models/config.model.dart';
import 'package:neardb/src/models/entity.model.dart';
import 'package:neardb/src/models/fields.model.dart';

class LocalStorageAdapter implements BaseStorageAdapter {
  final Config config;
  const LocalStorageAdapter(this.config);

  @override
  Future<Map<String, dynamic>> get(List<PathItem> path) async {
    final file = File(buildFilePath(path));
    final json = await file.readAsString();
    return jsonDecode(json);
  }

  @override
  Future<void> set(Map<String, dynamic> value, List<PathItem> path) async {
    final file = File(buildFilePath(path));
    final json = jsonEncode(value);
    await file.writeAsString(json);
    return;
  }

  @override
  Future<void> update(Map<String, dynamic> value, List<PathItem> path) async {
    final doc = await get(path);
    for (final key in value.keys) {
      if (value[key] == Fields.deleteValue) {
        value.remove(key);
        doc.remove(key);
      }
    }
    // Merge
    doc.addAll(value);
    // Save values
    await set(doc, path);
  }

  @override
  Future<void> remove(List<PathItem> path) async {
    await File(buildFilePath(path)).delete();
  }
}

abstract class BaseStorageAdapter {
  final Config config;
  const BaseStorageAdapter(this.config);

  Future<Map<String, dynamic>> get(List<PathItem> path);
  Future<void> set(Map<String, dynamic> value, List<PathItem> path);
  Future<void> update(Map<String, dynamic> value, List<PathItem> path);
  Future<void> remove(List<PathItem> path);
}
