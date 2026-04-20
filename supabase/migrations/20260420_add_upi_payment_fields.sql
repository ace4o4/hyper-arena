alter table public.teams
  add column if not exists utr_number text null,
  add column if not exists payment_rejected_reason text null;

-- Transitional policies to support admin verification UI from authenticated clients.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_select_payment_submitted_authenticated'
  ) then
    create policy teams_select_payment_submitted_authenticated
    on public.teams
    for select
    using (
      auth.role() = 'authenticated'
      and status = 'payment_submitted'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_update_payment_review_authenticated'
  ) then
    create policy teams_update_payment_review_authenticated
    on public.teams
    for update
    using (
      auth.role() = 'authenticated'
      and status = 'payment_submitted'
    )
    with check (
      auth.role() = 'authenticated'
      and status in ('payment_pending', 'payment_submitted', 'confirmed')
    );
  end if;
end
$$;
