-- The Art of Movement · proposed authenticated training schema
-- REVIEW IN A NON-PRODUCTION SUPABASE PROJECT BEFORE APPLYING.
-- Not deployed. Requires existing auth.users identity shared with Life OS.
create table if not exists public.aom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  performed_at timestamptz not null default now(),
  discipline text not null check (discipline in ('strength','mobility','dance','recovery')),
  duration_minutes integer check (duration_minutes between 1 and 360),
  effort integer check (effort between 1 and 10),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.aom_strength_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.aom_sessions(id) on delete cascade,
  exercise_name text not null check (char_length(exercise_name) between 1 and 120),
  set_number integer not null check (set_number between 1 and 30),
  reps integer check (reps between 0 and 100),
  weight_lb numeric(7,2) check (weight_lb between 0 and 2000),
  perceived_effort integer check (perceived_effort between 1 and 10),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now()
);
create table if not exists public.aom_skill_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discipline text not null,
  assessed_at timestamptz not null default now(),
  assessment_source text not null default 'self' check (assessment_source in ('self','instructor')),
  scores jsonb not null default '{}'::jsonb,
  suggested_level text,
  observations text,
  review_status text not null default 'self_assessed' check (review_status in ('self_assessed','awaiting_review','corrections_required','approved')),
  created_at timestamptz not null default now()
);
create table if not exists public.aom_body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_on date not null,
  weight_lb numeric(6,2) check (weight_lb between 60 and 800),
  notes text,
  unique(user_id,measured_on)
);
-- Each table uses owner-only access. No public reads.
alter table public.aom_sessions enable row level security;
alter table public.aom_strength_sets enable row level security;
alter table public.aom_skill_assessments enable row level security;
alter table public.aom_body_metrics enable row level security;
create policy "aom sessions owner" on public.aom_sessions for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "aom sets owner" on public.aom_strength_sets for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "aom assessments owner" on public.aom_skill_assessments for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "aom metrics owner" on public.aom_body_metrics for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
-- Prevent attaching a set to a different user's session, even if session UUID is known.
create or replace function public.aom_validate_set_owner() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
 if not exists (select 1 from public.aom_sessions s where s.id = new.session_id and s.user_id = new.user_id) then
   raise exception 'Session owner mismatch';
 end if;
 return new;
end; $$;
create trigger aom_set_owner_guard before insert or update on public.aom_strength_sets for each row execute function public.aom_validate_set_owner();
-- Future instructor review requires separate verified role and carefully scoped RLS; no cross-user policies granted here.
