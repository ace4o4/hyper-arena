-- ============================================================
-- Migration: Add payment proof fields
-- ============================================================
-- Adds UTR number, payment screenshot URL, and rejection note
-- to the teams table. Also adds a storage bucket for screenshots.
-- ============================================================

-- 1. Add payment proof columns to teams table
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS utr_number TEXT,
  ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT,
  ADD COLUMN IF NOT EXISTS rejection_note TEXT;

-- 2. Update the status check constraint to include 'payment_rejected'
-- First drop existing constraint if any
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_status_check;

-- Re-add with payment_rejected included
ALTER TABLE public.teams
  ADD CONSTRAINT teams_status_check
  CHECK (status IN ('pending_players', 'payment_pending', 'payment_review', 'confirmed', 'payment_rejected'));

-- 3. Create payment-screenshots bucket (if it doesn't exist)
-- This is done via Supabase dashboard or API, but we document it here.
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('payment-screenshots', 'payment-screenshots', true)
-- ON CONFLICT (id) DO NOTHING;

-- 4. RLS: Allow users to read their own payment screenshot field
-- (already covered by existing team RLS — no extra policy needed)

-- Done.
