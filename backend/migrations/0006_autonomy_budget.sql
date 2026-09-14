-- Nonsecret scheduling metadata; old encrypted configurations are read once on the next status check.
ALTER TABLE autonomy_groups ADD COLUMN daily_limit INTEGER;
-- This installation's shared system protection replaces the old hidden 80-call cap.
UPDATE autonomy_sessions SET daily_limit = 500;
