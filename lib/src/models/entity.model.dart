import 'package:neardb/src/helpers.dart';

import '../../neardb.dart';

enum EntityType {
  collection,
  document,
  subcollection,
}

/// Base entity for Beardb
abstract class Entity {
  Entity({
    required this.instance,
    required this.key,
    required this.path,
  });

  final NearDB instance;
  final List<PathItem> path;
  final String key;

  bool get exists {
    // TODO: exist logic
    return true;
  }
}

class NearDBPath {
  const NearDBPath({
    required this.pathList,
    required this.key,
  });

  final String key;
  final List<PathItem> pathList;

  NearDBPath document(String key) {
    final list = [...pathList, PathItem.document(key)];
    return NearDBPath(
      pathList: list,
      key: key,
    );
  }

  NearDBPath collection(String key) {
    final list = [...pathList, PathItem.collection(key)];
    return NearDBPath(
      pathList: list,
      key: key,
    );
  }

  NearDBPath subCollection(String key) {
    final list = [...pathList, PathItem.collection(key)];
    return NearDBPath(
      pathList: list,
      key: key,
    );
  }

  String get filePath {
    return buildFilePath(pathList);
  }
}

/// A path item
class PathItem {
  final EntityType type;
  final String key;
  PathItem._({
    required this.type,
    required this.key,
  });

  /// Returns a `PathItem` of type collection for [key]
  factory PathItem.collection(String key) {
    return PathItem._(
      type: EntityType.collection,
      key: key,
    );
  }

  /// Returns a `PathItem` of type document for [key]
  factory PathItem.document(String key) {
    return PathItem._(
      type: EntityType.document,
      key: key,
    );
  }

  /// Returns a `PathItem` of type subcollection for [key]
  factory PathItem.subcollection(String key) {
    return PathItem._(
      type: EntityType.subcollection,
      key: key,
    );
  }

  factory PathItem.addExtension(PathItem item) {
    return PathItem._(type: item.type, key: '${item.key}.json');
  }
}
