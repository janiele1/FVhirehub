import { supabaseAdmin } from "@/lib/supabase-admin"
import { notFound } from "next/navigation"
import SessionWrapper from "@/components/session-wrapper"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function InterviewPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // 1. Fetch Interview (Not Application)
    const { data: interview } = await supabaseAdmin
        .from("interviews")
        .select("*, questions(*)")
        .eq("id", id)
        .single()

    if (!interview) {
        notFound()
    }

    const questions = interview.questions || []

    // Create a dummy application object for the recorder
    const dummyApplication = {
        id: 'preview-mode',
        interview_id: id,
        candidate_id: 'preview-candidate',
        status: 'preview'
    }

    return (
        <div className="space-y-6">
            <div className="max-w-3xl mx-auto">
                <Link href={`/admin/interviews/${id}`} className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Interview Setup
                </Link>

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{interview.title}</h1>
                        <p className="text-slate-500 font-medium">Recruiter Preview Mode</p>
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-200 shadow-sm">
                        Preview Mode
                    </div>
                </div>

                <SessionWrapper
                    application={dummyApplication}
                    questions={questions}
                    interview={{ ...interview, isPreview: true }}
                />
            </div>
        </div>
    )
}
