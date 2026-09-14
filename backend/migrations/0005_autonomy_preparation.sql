-- A prepared snapshot is encrypted data, never permission to execute a model.
CREATE TABLE IF NOT EXISTS autonomy_preparations (
  owner TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL,
  payload TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS autonomy_preparations_expiry ON autonomy_preparations(expires_at);
