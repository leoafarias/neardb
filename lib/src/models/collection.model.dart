import 'package:neardb/src/helpers.dart';
import 'package:neardb/src/models/entity.model.dart';

import '../../neardb.dart';

class Collection extends Entity {
  Collection._({
    required NearDB instance,
    required String key,
    required List<PathItem> path,
  }) : super(instance: instance, key: key, path: path);

  factory Collection.create({
    required NearDB instance,
    required String key,
    required List<PathItem> path,
  }) {
    if (isReservedKey(key)) {
      throw Exception('$key: is a reserved keyword, and it cannot be used.');
    }

    final collectionPath = [...path, PathItem.collection(key)];

    return Collection._(
      instance: instance,
      key: key,
      path: collectionPath,
    );
  }
}
