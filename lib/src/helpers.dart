import 'package:neardb/src/models/entity.model.dart';
import 'package:uuid/uuid.dart';

/// Generates UUID
String generateUUID() {
  return Uuid().v4();
}

/// Check if key that is used for document or collection is reserved
bool isReservedKey(String key) {
  return _redervedKeywords[key] == true;
}

Map<String, bool> _redervedKeywords = {
  '_meta': true,
  'collection': true,
  'doc': true,
  'document': true,
  'indices': true,
};

String buildFilePath(List<PathItem> pathList) {
  // Needs to be a valid array
  final fileIdx = pathList.lastIndexWhere(
    (path) => path.type == EntityType.collection,
  );

  // Build remaining path to file
  var remainingPathList = <PathItem>[];
  for (var idx = 0; idx < pathList.length; idx++) {
    if (idx > fileIdx) {
      remainingPathList.add(pathList[idx]);
    }
  }
  final lastType = pathList.last.type;
  if (pathList is List &&
      (lastType == EntityType.document || lastType == EntityType.collection)) {
    pathList.last = PathItem.addExtension(pathList.last);
    return pathList.map((e) => e.key).join('/');
  } else {
    throw Exception('Not a valid path');
  }
}

String documentPathKey(List<PathItem> path) {
  final lastItem = path.last;
  if (lastItem.type == EntityType.document) {
    return lastItem.key;
  } else {
    throw Exception('last Item in path is not a document');
  }
}
