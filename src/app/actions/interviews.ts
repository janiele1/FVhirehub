'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createInterview(formData: FormData) {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const recruiterIntro = formData.get("recruiterIntro") as string

    if (!title) {
        throw new Error("Title is required")
    }

    const { data, error } = await supabaseAdmin
        .from("interviews")
        .insert([{
            title,
            description,
            recruiter_intro_video_path: recruiterIntro || null
        }])
        .select()
        .single()

    if (error) {
        console.error("Error creating interview:", error)
        throw new Error("Failed to create interview")
    }

    revalidatePath("/admin")
    redirect(`/admin/interviews/${data.id}`)
}

export async function updateInterview(interviewId: string, formData: FormData) {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const recruiterIntro = formData.get("recruiterIntro") as string

    if (!title) {
        throw new Error("Title is required")
    }

    const { error } = await supabaseAdmin
        .from("interviews")
        .update({
            title,
            description,
            recruiter_intro_video_path: recruiterIntro || null
        })
        .eq("id", interviewId)

    if (error) {
        console.error("Error updating interview:", error)
        throw new Error("Failed to update interview")
    }

    revalidatePath("/admin")
    revalidatePath(`/admin/interviews/${interviewId}`)
}

export async function deleteInterview(interviewId: string) {
    const { error } = await supabaseAdmin
        .from("interviews")
        .delete()
        .eq("id", interviewId)

    if (error) {
        console.error("Error deleting interview:", error)
        throw new Error("Failed to delete interview")
    }

    revalidatePath("/admin")
    redirect("/admin")
}
