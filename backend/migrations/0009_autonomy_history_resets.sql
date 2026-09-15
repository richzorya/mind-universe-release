-- Nonsensitive clear-operation tombstones outlive individual jobs. A lost response
-- must not let a later configuration retry clear newly generated group history.
CREATE TABLE autonomy_history_resets (
  owner TEXT NOT NULL,
  group_id TEXT NOT NULL,
  reset_token TEXT NOT NULL,
  revision INTEGER NOT NULL,
  PRIMARY KEY(owner, group_id, reset_token)
);
