CREATE TABLE IF NOT EXISTS jobs (
  owner TEXT NOT NULL,
  id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reply', 'notification-test')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  payload TEXT,
  result TEXT,
  error TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  started_at INTEGER,
  workflow_created_at INTEGER,
  acknowledged_at INTEGER,
  push_status TEXT NOT NULL DEFAULT 'pending',
  PRIMARY KEY (owner, id)
);
CREATE INDEX IF NOT EXISTS jobs_created ON jobs(created_at);
CREATE INDEX IF NOT EXISTS jobs_owner_created ON jobs(owner, created_at);
CREATE INDEX IF NOT EXISTS jobs_owner_pending ON jobs(owner, status, expires_at);
CREATE INDEX IF NOT EXISTS jobs_expiry ON jobs(expires_at);
CREATE INDEX IF NOT EXISTS jobs_unscheduled ON jobs(status, workflow_created_at, created_at);
CREATE TABLE IF NOT EXISTS subscriptions (
  owner TEXT PRIMARY KEY NOT NULL,
  subscription TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS subscriptions_expiry ON subscriptions(expires_at);
