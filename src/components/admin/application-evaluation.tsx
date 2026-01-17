'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Save, Loader2, CheckCircle } from "lucide-react"
import { updateApplicationReview } from "@/app/actions/applications"

interface ApplicationEvaluationProps {
    applicationId: string
    initialNotes: string | null
    initialRating: number | null
}

export default function ApplicationEvaluation({ applicationId, initialNotes, initialRating }: ApplicationEvaluationProps) {
    const [notes, setNotes] = useState(initialNotes || "")
    const [rating, setRating] = useState(initialRating || 0)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => setSaveSuccess(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [saveSuccess])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateApplicationReview(applicationId, { notes, rating })
            setSaveSuccess(true)
        } catch (error) {
            alert("Failed to save evaluation")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Candidate Rating</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                            />
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400">Select a star rating based on candidate performance.</p>
            </div>

            <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recruiter Notes</Label>
                <Textarea
                    id="notes"
                    placeholder="Enter your assessment of the candidate..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[150px] bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
            </div>

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full ${saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"}`}
            >
                {isSaving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : saveSuccess ? (
                    <><CheckCircle className="mr-2 h-4 w-4" /> Assessment Saved</>
                ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Evaluation</>
                )}
            </Button>
        </div>
    )
}
