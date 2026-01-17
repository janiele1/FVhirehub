'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function uploadVideoResponse(formData: FormData) {
    const applicationId = formData.get("applicationId") as string
    const questionId = formData.get("questionId") as string
    const videoBlob = formData.get("video") as Blob
    const duration = parseInt(formData.get("duration") as string) || 0
    const videoType = (formData.get("videoType") as string) || "answer"

    if (!applicationId || !questionId || !videoBlob) {
        throw new Error("Missing required fields")
    }

    const fileName = `${applicationId}/${questionId}_${videoType}.webm`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
        .from("videos")
        .upload(fileName, videoBlob, {
            upsert: true,
            contentType: 'video/webm'
        })

    if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error("Failed to upload video")
    }

    // 2. Create Video Record in DB
    const { error: dbError } = await supabaseAdmin.from("videos").insert([
        {
            application_id: applicationId,
            question_id: questionId,
            storage_path: fileName,
            duration_seconds: duration,
            video_type: videoType
        }
    ])

    if (dbError) {
        console.error("DB error:", dbError)
        throw new Error("Failed to save video record")
    }

    return { success: true }
}
