-- Ensure checked_in_members column exists on the teams table.
-- This is idempotent; safe to re-run even if the column already exists.
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS checked_in_members TEXT[] DEFAULT '{}';

-- Index for fast attendance look-ups (GIN supports array @> queries)
CREATE INDEX IF NOT EXISTS idx_teams_checked_in ON teams USING GIN (checked_in_members);
