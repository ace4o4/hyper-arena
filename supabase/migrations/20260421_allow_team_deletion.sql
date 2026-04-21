-- Allow Team Leaders to delete their own team
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_delete_owner_only'
  ) then
    create policy teams_delete_owner_only
    on public.teams
    for delete
    using (auth.uid() = user_id);
  end if;
end
$$;
