alter table public.teams
  add column if not exists utr_number text null,
  add column if not exists payment_rejected_reason text null;
