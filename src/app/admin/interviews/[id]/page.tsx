/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createQuestion } from "@/app/actions/questions"
// import { Clock } from "lucide-react"
import QuestionItem from "@/components/admin/question-item"
import ShareInterview from "@/components/admin/share-interview"
import InterviewSettings from "@/components/admin/interview-settings"

export default async function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: interview } = await supabaseAdmin
        .from("interviews")
        .select("*")
        .eq("id", id)
        .single()

    const { data: questions } = await supabaseAdmin
        .from("questions")
        .select("*")
        .eq("interview_id", id)
        .order("created_at", { ascending: true })

    if (!interview) {
        return <div>Interview not found</div>
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900 mb-2 block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{interview.title}</h1>
                    <p className="text-slate-500 max-w-xl">{interview.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <InterviewSettings interview={interview} />
                    <Button variant="outline" asChild>
                        <Link href={`/admin/interviews/${interview.id}/applications`}>View Applications</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href={`/admin/interviews/${interview.id}/preview`}>Preview Interview</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/interview/${interview.id}`} target="_blank" className="text-slate-400 font-medium">Public Link</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">

                {/* Left Column: Questions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Interview Questions</h2>
                    </div>

                    {questions && questions.length > 0 ? (
                        <div className="space-y-4">
                            {questions.map((q: any, index: number) => (
                                <QuestionItem key={q.id} question={q} index={index} interviewId={interview.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-8 text-center bg-slate-50">
                            <p className="text-slate-500">No questions added yet.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Share & Add Question */}
                <div className="space-y-6">
                    <ShareInterview interviewId={interview.id} />

                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Question</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={createQuestion} className="space-y-4">
                                <input type="hidden" name="interviewId" value={interview.id} />

                                <div className="space-y-2">
                                    <Label htmlFor="questionText">Question</Label>
                                    <Input id="questionText" name="questionText" placeholder="What are your strengths?" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timeLimit">Answer Time Limit (s)</Label>
                                        <Input type="number" id="timeLimit" name="timeLimit" defaultValue={60} min={30} step={30} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="thinkingTime">Thinking Time (s)</Label>
                                        <Input type="number" id="thinkingTime" name="thinkingTime" defaultValue={30} min={0} step={10} />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">Add Question</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
