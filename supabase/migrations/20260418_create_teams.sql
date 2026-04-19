-- Teams table for registration, invite flow, roster, and payment state.

create extension if not exists pgcrypto;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tournament_id text null,
  team_name text not null,
  team_name_lower text not null,
  game text not null,
  leader_email text not null,
  leader jsonb not null,
  logo text null,
  invite_code text not null,
  invite_code_lower text not null,
  invite_link text not null,
  status text not null default 'pending_players',
  players jsonb not null default '[]'::jsonb,
  substitute jsonb null,
  member_emails text[] not null default '{}'::text[],
  member_uids text[] not null default '{}'::text[],
  member_user_ids text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz null default timezone('utc', now())
);

create unique index if not exists teams_team_name_lower_unique on public.teams(team_name_lower);
create unique index if not exists teams_invite_code_lower_unique on public.teams(invite_code_lower);
create index if not exists teams_user_id_idx on public.teams(user_id);
create index if not exists teams_member_emails_idx on public.teams using gin(member_emails);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
before update on public.teams
for each row
execute function public.set_updated_at();

alter table public.teams enable row level security;

-- Read policies: leader or listed member can read the team.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_select_owner_or_member'
  ) then
    create policy teams_select_owner_or_member
    on public.teams
    for select
    using (
      auth.uid() = user_id
      or coalesce((auth.jwt() ->> 'email'), '') = any(member_emails)
      or auth.uid()::text = any(member_user_ids)
    );
  end if;
end
$$;

-- Insert policy: user can create only own team rows.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_insert_owner_only'
  ) then
    create policy teams_insert_owner_only
    on public.teams
    for insert
    with check (auth.uid() = user_id);
  end if;
end
$$;

-- Update policy:
-- Transitional policy for invite-based joins directly from client.
-- Move joins and payments to Edge Functions for stricter security.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teams' and policyname = 'teams_update_owner_or_pending'
  ) then
    create policy teams_update_owner_or_pending
    on public.teams
    for update
    using (
      auth.uid() = user_id
      or auth.uid()::text = any(member_user_ids)
      or status = 'pending_players'
    )
    with check (
      auth.uid() = user_id
      or auth.uid()::text = any(member_user_ids)
      or status = 'pending_players'
    );
  end if;
end
$$;
