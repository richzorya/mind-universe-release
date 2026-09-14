CREATE TABLE IF NOT EXISTS autonomy_sessions (
  owner TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  daily_limit INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  workflow_created_at INTEGER,
  error TEXT
);
CREATE TABLE IF NOT EXISTS autonomy_groups (
  owner TEXT NOT NULL,
  group_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  payload TEXT NOT NULL,
  next_at INTEGER NOT NULL,
  route_index INTEGER NOT NULL DEFAULT 0,
  topic_rounds INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(owner, group_id)
);
CREATE INDEX IF NOT EXISTS autonomy_groups_due ON autonomy_groups(owner, next_at);
CREATE TABLE IF NOT EXISTS autonomy_runs (
  owner TEXT NOT NULL,
  id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  completed_at INTEGER,
  PRIMARY KEY(owner, id)
);
CREATE INDEX IF NOT EXISTS autonomy_runs_group ON autonomy_runs(owner, group_id);
CREATE TABLE IF NOT EXISTS model_leases (
  owner TEXT PRIMARY KEY NOT NULL,
  lock_id TEXT,
  lock_until INTEGER NOT NULL DEFAULT 0,
  next_allowed_at INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE jobs ADD COLUMN workflow_owner TEXT;
CREATE TABLE IF NOT EXISTS autonomy_waits (
  owner TEXT NOT NULL,
  group_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  job_id TEXT NOT NULL,
  PRIMARY KEY(owner, group_id)
);
CREATE INDEX IF NOT EXISTS autonomy_waits_job ON autonomy_waits(owner, job_id);
