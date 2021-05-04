import 'package:neardb/src/adapters/base_adapter.dart';
import 'package:neardb/src/helpers.dart';
import 'package:neardb/src/models/config.model.dart';
import 'package:neardb/src/models/fields.model.dart';

class NearDB {
  NearDB({
    required this.config,
    this.adapter = const LocalStorageAdapter(),
  }) {
    instanceId = generateUUID();
  }

  factory NearDB.database(Config config) {
    return NearDB(config: config);
  }

  final Config config;
  late String instanceId;
  final StorageAdapter adapter;
  final fields = Fields();
}
