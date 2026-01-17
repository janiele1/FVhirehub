-- Add recruiter intro video path to interviews table
ALTER TABLE public.interviews 
ADD COLUMN recruiter_intro_video_path text;

-- Add thinking time limit to questions table
ALTER TABLE public.questions 
ADD COLUMN thinking_time_seconds integer DEFAULT 30 NOT NULL;
