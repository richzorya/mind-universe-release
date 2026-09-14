-- Additive upgrade: the previous Worker remains able to finish and release its
-- original owner-wide lease while the new Worker deploys.
CREATE TABLE scoped_model_leases (
  owner TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'legacy',
  lock_id TEXT,
  lock_until INTEGER NOT NULL DEFAULT 0,
  next_allowed_at INTEGER NOT NULL DEFAULT 0,
  legacy_copy INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(owner, scope)
);
INSERT INTO scoped_model_leases(owner, scope, lock_id, lock_until, next_allowed_at, legacy_copy)
  SELECT l.owner, COALESCE((SELECT 'group:' || a.group_id FROM autonomy_runs a WHERE a.owner = l.owner AND a.id = l.lock_id),
    CASE WHEN l.lock_id IS NULL THEN 'legacy' ELSE 'job:' || l.lock_id END), l.lock_id, l.lock_until, 0, 1 FROM model_leases l;
CREATE INDEX scoped_model_leases_job ON scoped_model_leases(owner, lock_id);
-- A copied lease remains live only while its old executor still owns it. This
-- also sees old requests that start between migration and Worker deployment.
CREATE VIEW current_model_leases AS
  SELECT owner, scope, lock_id, lock_until, next_allowed_at FROM scoped_model_leases s
  WHERE legacy_copy = 0 OR EXISTS(SELECT 1 FROM model_leases l WHERE l.owner = s.owner AND l.lock_id = s.lock_id)
  UNION ALL
  SELECT l.owner, COALESCE((SELECT 'group:' || a.group_id FROM autonomy_runs a WHERE a.owner = l.owner AND a.id = l.lock_id), 'job:' || l.lock_id),
    l.lock_id, l.lock_until, 0 FROM model_leases l
  WHERE l.lock_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM scoped_model_leases s WHERE s.owner = l.owner AND s.lock_id = l.lock_id);
ALTER TABLE autonomy_groups ADD COLUMN workflow_generation INTEGER NOT NULL DEFAULT 0;
ALTER TABLE autonomy_groups ADD COLUMN workflow_created_at INTEGER;
ALTER TABLE autonomy_groups ADD COLUMN created_revision INTEGER NOT NULL DEFAULT 0;
ALTER TABLE autonomy_groups ADD COLUMN error TEXT;
UPDATE autonomy_groups SET created_revision = revision;
ALTER TABLE autonomy_sessions ADD COLUMN stopped_groups TEXT;
ALTER TABLE jobs ADD COLUMN notification_deferred INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN notification_generation INTEGER NOT NULL DEFAULT 0;
CREATE TABLE device_presence (
  owner TEXT PRIMARY KEY NOT NULL,
  visible_until INTEGER NOT NULL
);
