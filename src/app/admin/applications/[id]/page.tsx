/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { notFound } from "next/navigation"
import StatusSelector from "@/components/admin/status-selector"
import ApplicationEvaluation from "@/components/admin/application-evaluation"

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch application, candidate, and interview details
    const { data: application } = await supabaseAdmin
        .from("applications")
        .select("*, candidates(*), interviews(*)")
        .eq("id", id)
        .single()

    if (!application) notFound()

    // Fetch videos for this application
    const { data: videos } = await supabaseAdmin
        .from("videos")
        .select("*, questions(*)")
        .eq("application_id", application.id)
        .order("created_at", { ascending: true })

    // Group videos by question
    type VideoGroup = {
        question: any
        thinking: any
        answer: any
    }
    const groupedVideos = videos?.reduce<Record<string, VideoGroup>>((acc, video: any) => {
        const qId = video.question_id
        if (!acc[qId]) {
            acc[qId] = {
                question: video.questions,
                thinking: null,
                answer: null
            }
        }
        if (video.video_type === 'thinking') acc[qId].thinking = video
        else acc[qId].answer = video
        return acc
    }, {})

    const questionsWithVideos = groupedVideos ? Object.values(groupedVideos) : []

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
                <div>
                    <Link href={`/admin/interviews/${application.interview_id}/applications`} className="text-sm text-slate-500 hover:text-slate-900 mb-2 block">
                        ← Back to Application List
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {application.candidates.first_name} {application.candidates.last_name}
                    </h1>
                    <p className="text-slate-500">
                        Applying for: <span className="font-medium text-slate-900">{application.interviews.title}</span>
                    </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Application Status</span>
                    <StatusSelector applicationId={application.id} currentStatus={application.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Video Responses */}
                <div className="lg:col-span-2 space-y-6">
                    {questionsWithVideos.length > 0 ? (
                        questionsWithVideos.map((group) => {
                            return (
                                <Card key={group.question.id} className="overflow-hidden border-slate-200 shadow-sm">
                                    <CardHeader className="bg-slate-50 border-b pb-3">
                                        <CardTitle className="text-lg font-semibold text-slate-800">
                                            {group.question.question_text}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-800 bg-black">
                                            {/* Thinking Time Video */}
                                            <div className="relative">
                                                <div className="absolute top-3 left-3 z-10 bg-indigo-600/90 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest shadow-lg">
                                                    Thinking Time
                                                </div>
                                                {group.thinking ? (
                                                    <video
                                                        src={supabaseAdmin.storage.from('videos').getPublicUrl(group.thinking.storage_path).data.publicUrl}
                                                        controls
                                                        className="w-full aspect-video object-contain"
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-video flex items-center justify-center text-slate-500 text-sm italic bg-slate-900">
                                                        No thinking time recorded
                                                    </div>
                                                )}
                                            </div>

                                            {/* Answer Video */}
                                            <div className="relative">
                                                <div className="absolute top-3 left-3 z-10 bg-rose-600/90 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest shadow-lg">
                                                    Final Answer
                                                </div>
                                                {group.answer ? (
                                                    <video
                                                        src={supabaseAdmin.storage.from('videos').getPublicUrl(group.answer.storage_path).data.publicUrl}
                                                        controls
                                                        className="w-full aspect-video object-contain"
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-video flex items-center justify-center text-slate-500 text-sm italic bg-slate-900">
                                                        No answer recorded
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">No video responses found for this application yet.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar: Evaluation & Notes */}
                <div className="space-y-6">
                    <Card className="sticky top-8 border-indigo-100 shadow-md ring-1 ring-indigo-50">
                        <CardHeader className="border-b bg-indigo-50/30">
                            <CardTitle className="text-xl font-bold text-slate-900">Recruiter Review</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ApplicationEvaluation
                                applicationId={application.id}
                                initialNotes={application.notes}
                                initialRating={application.rating}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
