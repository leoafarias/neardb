abstract class Config {
  Config({
    this.instanceUrl,
    this.headers,
    this.cacheExpiration,
  });

  final String? instanceUrl;
  final Map<String, String>? headers;
  final int? cacheExpiration;
}
