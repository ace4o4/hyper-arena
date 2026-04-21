-- Add attendance tracking to teams table
-- checked_in_members: array of composite attendance keys in the format
--   '{teamId}:{role}:{rollNo}'  (e.g. 'abc123:leader:2101234')
-- Each entry represents one member who has checked in and may only enter once.
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS checked_in_members TEXT[] DEFAULT '{}';

-- Index to speed up attendance look-ups
CREATE INDEX IF NOT EXISTS idx_teams_checked_in ON teams USING GIN (checked_in_members);
