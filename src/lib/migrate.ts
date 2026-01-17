import { supabaseAdmin } from "@/lib/supabase-admin"

export async function runMigration() {
    console.log("Starting migration...")

    // 1. Add recruiter_intro_video_path to interviews
    const { error: err1 } = await supabaseAdmin.rpc('exec_sql', {
        query: 'ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS recruiter_intro_video_path text;'
    })

    if (err1) console.error("Err1 (Interviews):", err1)
    else console.log("Success (Interviews)")

    // 2. Add thinking_time_seconds to questions
    const { error: err2 } = await supabaseAdmin.rpc('exec_sql', {
        query: 'ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS thinking_time_seconds integer DEFAULT 30 NOT NULL;'
    })

    if (err2) console.error("Err2 (Questions):", err2)
    else console.log("Success (Questions)")
}
