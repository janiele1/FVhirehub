-- Create Interviews table
create table public.interviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  is_active boolean default true,
  recruiter_intro_video_path text
);

-- Create Questions table
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  question_text text not null,
  time_limit_seconds integer default 60 not null,
  thinking_time_seconds integer default 30 not null,
  order_index integer default 0
);

-- Create Candidates table
create table public.candidates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  email text not null
);

-- Create Applications table (connecting candidates to interviews)
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'completed', 'reviewed'))
);

-- Create Videos table (for storing responses)
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  application_id uuid references public.applications(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  storage_path text not null,
  duration_seconds integer,
  
  unique(application_id, question_id)
);

-- Enable RLS (Row Level Security) - Basic setup
alter table public.interviews enable row level security;
alter table public.questions enable row level security;
alter table public.candidates enable row level security;
alter table public.applications enable row level security;
alter table public.videos enable row level security;

-- Policies (Simplified for internal use MVP)
-- Allow anyone to read active interviews (for candidates to see what they are applying to)
create policy "Public Read Active Interviews" on public.interviews for select
using (is_active = true);

-- Allow full access to authenticated users (Admins)
create policy "Enable all for authenticated users" on public.interviews for all to authenticated using (true);
create policy "Enable all for authenticated users" on public.questions for all to authenticated using (true);
create policy "Enable all for authenticated users" on public.candidates for all to authenticated using (true);
create policy "Enable all for authenticated users" on public.applications for all to authenticated using (true);
create policy "Enable all for authenticated users" on public.videos for all to authenticated using (true);

-- Allow candidates to insert themselves
create policy "Enable insert for candidates" on public.candidates for insert to anon with check (true);
-- Allow candidates to read their own data (would need stricter checks ideally, but for MVP insert only is key)

-- Allow candidates to insert applications
create policy "Enable insert for applications" on public.applications for insert to anon with check (true);
