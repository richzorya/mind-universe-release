-- Separate durable executor lifetimes from the user's enabled permission.
-- Generation zero retains all pre-migration Workflow and paid request IDs.
ALTER TABLE autonomy_sessions ADD COLUMN workflow_generation INTEGER NOT NULL DEFAULT 0;
ALTER TABLE autonomy_runs ADD COLUMN scheduled_at INTEGER;
