-- Migration: Add leader phone number to teams table
-- ============================================================

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS leader_phone TEXT;

-- Done.
