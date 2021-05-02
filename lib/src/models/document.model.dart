import 'package:neardb/src/helpers.dart';
import 'package:neardb/src/models/entity.model.dart';

import '../../neardb.dart';

class Document extends Entity {
  Document._({
    required NearDB instance,
    required String key,
    required List<PathItem> path,
  }) : super(
          instance: instance,
          key: key,
          path: path,
        );

  factory Document.create({
    required NearDB instance,
    required String key,
    required List<PathItem> path,
  }) {
    if (isReservedKey(key)) {
      throw Exception('$key: is a reserved keyword, and it cannot be used.');
    }

    // Add doc to the path
    final docPath = [...path, PathItem.document(key)];
    // Return document
    return Document._(
      instance: instance,
      key: key,
      path: docPath,
    );
  }
}
