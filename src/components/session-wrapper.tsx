'use client'

import dynamic from "next/dynamic"

const InterviewSession = dynamic(() => import("@/components/interview-recorder"), {
    ssr: false,
    loading: () => <div className="text-center py-12 text-slate-500">Loading interview...</div>
})

interface SessionWrapperProps {
    application: any
    questions: any[]
    interview: any
}

export default function SessionWrapper({ application, questions, interview }: SessionWrapperProps) {
    return (
        <InterviewSession
            application={application}
            questions={questions}
            interview={interview}
        />
    )
}
