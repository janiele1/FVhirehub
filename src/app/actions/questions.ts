'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function createQuestion(formData: FormData) {
    const interviewId = formData.get("interviewId") as string
    const questionText = formData.get("questionText") as string
    const timeLimit = parseInt(formData.get("timeLimit") as string) || 60
    const thinkingTime = parseInt(formData.get("thinkingTime") as string) || 30

    if (!interviewId || !questionText) {
        throw new Error("Missing required fields")
    }

    const { error } = await supabaseAdmin
        .from("questions")
        .insert([{
            interview_id: interviewId,
            question_text: questionText,
            time_limit_seconds: timeLimit,
            thinking_time_seconds: thinkingTime
        }])

    if (error) {
        console.error("Error creating question:", error)
        throw new Error("Failed to create question")
    }

    revalidatePath(`/admin/interviews/${interviewId}`)
}

export async function deleteQuestion(questionId: string, interviewId: string) {
    const { error } = await supabaseAdmin
        .from("questions")
        .delete()
        .eq('id', questionId)

    if (error) {
        console.error("Error deleting question:", error)
        throw new Error("Failed to delete question")
    }

    revalidatePath(`/admin/interviews/${interviewId}`)
}

export async function updateQuestion(questionId: string, interviewId: string, data: { questionText: string, timeLimit: number, thinkingTime: number }) {
    const { error } = await supabaseAdmin
        .from("questions")
        .update({
            question_text: data.questionText,
            time_limit_seconds: data.timeLimit,
            thinking_time_seconds: data.thinkingTime
        })
        .eq('id', questionId)

    if (error) {
        console.error("Error updating question:", error)
        throw new Error("Failed to update question")
    }

    revalidatePath(`/admin/interviews/${interviewId}`)
}
