-- Disable RLS on all tables to allow full access with Anon key
-- (Since we don't have the Service Role Key configured)

ALTER TABLE public.interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
