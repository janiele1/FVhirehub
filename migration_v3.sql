-- Add video_type column to videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS video_type text DEFAULT 'answer' CHECK (video_type IN ('answer', 'thinking'));

-- Update the unique constraint to include video_type
-- We use a DO block to drop the constraint safely if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_application_id_question_id_key') THEN
        ALTER TABLE public.videos DROP CONSTRAINT videos_application_id_question_id_key;
    END IF;
END $$;

ALTER TABLE public.videos 
ADD CONSTRAINT videos_application_id_question_id_video_type_key UNIQUE (application_id, question_id, video_type);
