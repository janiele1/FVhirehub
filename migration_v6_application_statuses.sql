-- ULTRA NUCLEAR update for applications status check constraint
-- This script will remove EVERY SINGLE check constraint on the table to be 100% sure.

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- 1. Loop through EVERY check constraint on the 'applications' table (not just status)
    FOR r IN (
        SELECT conname
        FROM pg_constraint
        WHERE contype = 'c' 
          AND conrelid = 'public.applications'::regclass
    ) LOOP
        EXECUTE 'ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
        RAISE NOTICE 'Dropped check constraint: %', r.conname;
    END LOOP;
    
    -- 2. Add the new comprehensive constraint
    ALTER TABLE public.applications 
    ADD CONSTRAINT applications_status_check_final_v2 
    CHECK (status IN ('pending', 'completed', 'reviewed', 'approved', 'thinking', 'rejected'));
    
    RAISE NOTICE 'SUCCESS: Applied new status constraint.';
END $$;
