import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export default async function InterviewLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: interview } = await supabase
        .from("interviews")
        .select("*, questions(*)")
        .eq("id", id)
        .single()

    if (!interview) {
        notFound()
    }

    const questionCount = interview.questions?.length || 0
    // Estimate duration: 2 mins per question + 5 mins buffer
    const estimatedDuration = Math.ceil((questionCount * 2) + 5)

    return (
        <div className="space-y-8">
            <div className="space-y-8 max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl text-center">
                    {interview.title}
                </h1>

                {interview.description && (
                    <div className="text-lg text-slate-600 leading-relaxed text-left space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {interview.description.split('\n').map((paragraph: string, i: number) => (
                            paragraph.trim() && (
                                <p key={i}>
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                )}
            </div>

            <Card className="border-t-4 border-t-blue-600 shadow-lg">
                <CardHeader>
                    <CardTitle>What to expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-slate-900">{questionCount} Questions</h3>
                                <p className="text-sm text-slate-500">You&apos;ll answer a series of video questions.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-slate-900">~{estimatedDuration} Minutes</h3>
                                <p className="text-sm text-slate-500">Estimated time to complete.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-slate-900">Video Responses</h3>
                                <p className="text-sm text-slate-500">Your answers will be recorded via webcam.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-slate-900">One chance only</h3>
                                <p className="text-sm text-slate-500">You cannot retake your answers once submitted.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <Link href={`/interview/${interview.id}/start`}>
                            <Button size="lg" className="w-full md:w-auto px-8 text-lg h-12">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-slate-500">
                <p>Please ensure you are in a quiet environment with good lighting.</p>
            </div>
        </div>
    )
}
