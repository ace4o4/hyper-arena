-- Fix: After REJECT, team status becomes 'payment_pending'.
-- The previous SELECT policy only covered 'payment_review' and 'confirmed',
-- so .select("*").single() after the UPDATE returned 0 rows → RLS error.
-- This extends the SELECT policy to also include 'payment_pending'.

drop policy if exists teams_select_payment_review_public on public.teams;
create policy teams_select_payment_review_public
on public.teams
for select
using (
  status in ('payment_review', 'payment_pending', 'confirmed')
);
