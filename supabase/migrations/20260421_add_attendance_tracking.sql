-- Add attendance tracking to teams table
-- checked_in_members: array of member identifiers (roll_no) who have checked in
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS checked_in_members TEXT[] DEFAULT '{}';

-- Index to speed up attendance look-ups
CREATE INDEX IF NOT EXISTS idx_teams_checked_in ON teams USING GIN (checked_in_members);
