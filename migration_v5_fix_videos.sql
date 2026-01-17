-- Add video_type column if it doesn't exist
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS video_type text DEFAULT 'answer';

-- Drop the restrictive unique constraint that only allowed one video per question
ALTER TABLE public.videos DROP CONSTRAINT IF EXISTS videos_application_id_question_id_key;

-- Add a new unique constraint that allows one of each type (thinking/answer) per question
ALTER TABLE public.videos 
ADD CONSTRAINT videos_application_id_question_id_video_type_key 
UNIQUE (application_id, question_id, video_type);
