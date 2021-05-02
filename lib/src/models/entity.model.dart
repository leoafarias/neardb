import '../../neardb.dart';

enum EntityType { collection, document }

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
}
