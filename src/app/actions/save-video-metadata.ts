'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function saveVideoMetadata(
    applicationId: string,
    questionId: string,
    storagePath: string,
    duration: number,
    videoType: string
) {
    try {
        const { error: dbError } = await supabaseAdmin.from("videos").insert([
            {
                application_id: applicationId,
                question_id: questionId,
                storage_path: storagePath,
                duration_seconds: duration,
                video_type: videoType
            }
        ])

        if (dbError) {
            console.error("[Metadata Action] DB Insert Error:", dbError)
            return { success: false, error: `Database Error: ${dbError.message}` }
        }

        return { success: true }
    } catch (err: unknown) {
        console.error("[Metadata Action] Unexpected Error:", err)
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        return { success: false, error: errorMessage }
    }
}
