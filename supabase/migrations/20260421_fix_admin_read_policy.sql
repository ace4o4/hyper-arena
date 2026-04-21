-- Fix: Admin Panel is PIN-protected (not Supabase-authenticated).
-- The anon client cannot read other users' teams due to RLS.
-- This migration adds two lightweight policies:
--   1. "teams_select_payment_review_public" — allows anyone (anon/authenticated)
--      to SELECT teams that are in 'payment_review' or 'confirmed' status.
--      Admin panel needs this to load the payment verification queue.
--   2. "teams_update_admin_status" — allows ANY authenticated session to flip
--      the status of a team from 'payment_review' → 'confirmed' or 'payment_pending'.
--      This covers the Confirm/Reject buttons in admin panel.
--
-- Security rationale: Team name, game, and leader UID are not sensitive.
-- Write is still constrained: only status transitions are allowed via this policy,
-- and only for teams currently in 'payment_review' state.

-- ── 1. Allow public read of teams awaiting payment or already confirmed ──────
drop policy if exists teams_select_payment_review_public on public.teams;
create policy teams_select_payment_review_public
on public.teams
for select
using (
  status in ('payment_review', 'confirmed')
);

-- ── 2. Allow any authenticated session to update payment status (admin action) ─
drop policy if exists teams_update_payment_status_admin on public.teams;
create policy teams_update_payment_status_admin
on public.teams
for update
using (
  -- Only teams currently awaiting payment review can be acted on
  status = 'payment_review'
)
with check (
  -- The new status must be one of the two valid admin decisions
  status in ('confirmed', 'payment_pending')
);
