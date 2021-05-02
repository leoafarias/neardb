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
