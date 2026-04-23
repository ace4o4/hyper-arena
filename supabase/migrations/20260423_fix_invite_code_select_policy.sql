-- Allow any authenticated user to read teams that are still open for joining.
-- Without this, a user trying to join via invite code gets "Invalid invite code"
-- because the existing select policy only allows the owner and current members
-- to read a team row — the joiner is not yet a member, so the row is invisible.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'teams'
      and policyname = 'teams_select_pending_for_join'
  ) then
    create policy teams_select_pending_for_join
    on public.teams
    for select
    using (
      auth.role() = 'authenticated'
      and status = 'pending_players'
    );
  end if;
end
$$;
