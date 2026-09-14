ALTER TABLE autonomy_groups ADD COLUMN delivery_tail_at INTEGER;
ALTER TABLE autonomy_groups ADD COLUMN last_message_at INTEGER;
ALTER TABLE autonomy_groups ADD COLUMN previous_message_at INTEGER;
ALTER TABLE autonomy_groups ADD COLUMN message_times TEXT;
ALTER TABLE jobs ADD COLUMN retain_result INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN notification_workflow_at INTEGER;
CREATE TABLE IF NOT EXISTS autonomy_local_usage (
  owner TEXT NOT NULL,
  day_start INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  calls INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(owner, day_start, group_id)
);
