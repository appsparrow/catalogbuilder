-- Create user_plans as a single-source-of-truth for current plan per user
create table if not exists public.user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null default 'free',
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_subscription_id text,
  stripe_customer_id text,
  updated_at timestamptz not null default now()
);

alter table public.user_plans enable row level security;

-- RLS: users can see only their own row; admin service role bypasses
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'user_plans' and policyname = 'user_plans_select_self'
  ) then
    create policy user_plans_select_self on public.user_plans
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'user_plans' and policyname = 'user_plans_upsert_self'
  ) then
    create policy user_plans_upsert_self on public.user_plans
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'user_plans' and policyname = 'user_plans_update_self'
  ) then
    create policy user_plans_update_self on public.user_plans
      for update using (auth.uid() = user_id);
  end if;
end $$;

-- Helper upsert function (for server-side use via service role)
create or replace function public.upsert_user_plan(
  p_user_id uuid,
  p_plan_id text,
  p_status text,
  p_current_start timestamptz,
  p_current_end timestamptz,
  p_cancel_at_period_end boolean,
  p_stripe_sub_id text,
  p_stripe_cus_id text
) returns void language plpgsql security definer as $$
begin
  insert into public.user_plans (user_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, stripe_subscription_id, stripe_customer_id)
  values (p_user_id, p_plan_id, p_status, p_current_start, p_current_end, p_cancel_at_period_end, p_stripe_sub_id, p_stripe_cus_id)
  on conflict (user_id) do update set
    plan_id = excluded.plan_id,
    status = excluded.status,
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    cancel_at_period_end = excluded.cancel_at_period_end,
    stripe_subscription_id = excluded.stripe_subscription_id,
    stripe_customer_id = excluded.stripe_customer_id,
    updated_at = now();
end;$$;


