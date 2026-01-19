'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { sendSubmissionEmail } from "@/lib/email"

export async function finishInterview(applicationId: string) {
    // 1. Update status to submitted
    await updateApplicationStatus(applicationId, 'submitted')

    // 2. Fetch details for email
    const { data: app } = await supabaseAdmin
        .from('applications')
        .select('*, candidates(*), interviews(*)')
        .eq('id', applicationId)
        .single()

    if (app && app.candidates && app.interviews) {
        const candidateName = `${app.candidates.first_name} ${app.candidates.last_name}`
        const interviewTitle = app.interviews.title

        // 3. Fetch all admin users
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

        if (!error && users) {
            const recipients = users.map(u => u.email).filter(Boolean) as string[]

            if (recipients.length > 0) {
                console.log(`Sending email for application ${applicationId} to ${recipients.length} recipients...`)
                await sendSubmissionEmail(candidateName, interviewTitle, applicationId, recipients)
            }
        }
    }
}

export async function startApplication(formData: FormData) {
    const interviewId = formData.get("interviewId") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string

    if (!interviewId || !firstName || !lastName || !email) {
        throw new Error("Missing required fields")
    }

    // 1. Create or Find Candidate
    // For MVP, we'll just insert. In production, we'd check for existing email.
    const { data: candidate, error: candidateError } = await supabaseAdmin
        .from("candidates")
        .insert([{ first_name: firstName, last_name: lastName, email }])
        .select()
        .single()

    if (candidateError) {
        console.error("Error creating candidate:", candidateError)
        throw new Error("Failed to register candidate")
    }

    // 2. Create Application
    const { data: application, error: appError } = await supabaseAdmin
        .from("applications")
        .insert([{ interview_id: interviewId, candidate_id: candidate.id, status: 'pending' }])
        .select()
        .single()

    if (appError) {
        console.error("Error creating application:", appError)
        throw new Error("Failed to start application")
    }

    // 3. Redirect to the first question (or the recorder shell)
    redirect(`/interview/session/${application.id}`)
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    console.log(`[updateApplicationStatus] Updating ${applicationId} to ${status}`)

    const { data: application, error: fetchError } = await supabaseAdmin
        .from("applications")
        .select("interview_id")
        .eq("id", applicationId)
        .single()

    if (fetchError) {
        console.error("[updateApplicationStatus] Fetch error:", fetchError)
        throw new Error("Failed to find application: " + fetchError.message)
    }

    const { data: updatedData, error } = await supabaseAdmin
        .from("applications")
        .update({ status })
        .eq("id", applicationId)
        .select()

    if (error) {
        console.error("[updateApplicationStatus] Update error:", error)
        throw new Error("Failed to update status: " + error.message)
    }

    console.log(`[updateApplicationStatus] Updated rows:`, updatedData?.length || 0)

    if (application) {
        console.log(`[updateApplicationStatus] Revalidating paths for interview: ${application.interview_id}`)
        revalidatePath(`/admin/interviews/${application.interview_id}/applications`)
        revalidatePath(`/admin/applications/${applicationId}`)
        revalidatePath('/', 'layout') // Nuclear revalidate
    }

    return { success: true }
}

export async function updateApplicationReview(applicationId: string, data: { notes?: string, rating?: number }) {
    console.log(`[updateApplicationReview] Updating ${applicationId}`, data)

    const { error } = await supabaseAdmin
        .from("applications")
        .update({
            notes: data.notes,
            rating: data.rating
        })
        .eq("id", applicationId)

    if (error) {
        console.error("[updateApplicationReview] Update error:", error)
        throw new Error("Failed to update evaluation: " + error.message)
    }

    revalidatePath(`/admin/applications/${applicationId}`)
    return { success: true }
}
