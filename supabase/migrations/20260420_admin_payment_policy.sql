-- Allow JWT app_metadata.role='admin' users to read/update all teams for payment review.

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin';
$$;

drop policy if exists teams_select_owner_or_member on public.teams;
create policy teams_select_owner_or_member
on public.teams
for select
using (
  auth.uid() = user_id
  or coalesce((auth.jwt() ->> 'email'), '') = any(member_emails)
  or auth.uid()::text = any(member_user_ids)
  or public.is_admin()
);

drop policy if exists teams_update_owner_or_pending on public.teams;
create policy teams_update_owner_or_pending
on public.teams
for update
using (
  auth.uid() = user_id
  or auth.uid()::text = any(member_user_ids)
  or status = 'pending_players'
  or public.is_admin()
)
with check (
  auth.uid() = user_id
  or auth.uid()::text = any(member_user_ids)
  or status = 'pending_players'
  or public.is_admin()
);
