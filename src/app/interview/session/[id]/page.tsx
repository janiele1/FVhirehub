import { supabaseAdmin } from "@/lib/supabase-admin"
import { notFound } from "next/navigation"
import SessionWrapper from "@/components/session-wrapper"

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // 1. Fetch Application
    const { data: application } = await supabaseAdmin
        .from("applications")
        .select("*, interviews(*)")
        .eq("id", id)
        .single()

    if (!application) {
        notFound()
    }

    // 2. Fetch Questions
    const { data: questions } = await supabaseAdmin
        .from("questions")
        .select("*")
        .eq("interview_id", application.interview_id)
        .order("created_at", { ascending: true })

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">{application.interviews.title}</h1>
                <p className="text-slate-500">Get ready to record your answers</p>
            </div>

            <SessionWrapper
                application={application}
                questions={questions || []}
                interview={application.interviews}
            />
        </div>
    )
}
