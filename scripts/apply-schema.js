/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const schema = `
-- Create Interviews table
create table if not exists public.interviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  is_active boolean default true,
  recruiter_intro_video_path text
);

-- Create Questions table
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  question_text text not null,
  time_limit_seconds integer default 60 not null,
  thinking_time_seconds integer default 30 not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Candidates table
create table if not exists public.candidates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  email text not null
);

-- Create Applications table
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'completed', 'reviewed'))
);

-- Create Videos table
create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  application_id uuid references public.applications(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  storage_path text not null,
  duration_seconds integer,
  unique(application_id, question_id)
);
`;

async function applySchema() {
  console.log('Applying database schema...');

  // Split by semicolons and run each statement
  const statements = schema.split(';').filter(s => s.trim());

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;

    const { error } = await supabase.rpc('exec_sql', { query: trimmed + ';' });
    if (error) {
      // RPC might not exist, try direct approach via REST
      console.log('Note: exec_sql RPC not available, schema may need manual application');
    }
  }

  console.log('Schema application attempted. If you see errors, please run supabase_schema.sql manually in the SQL Editor.');
}

applySchema();
