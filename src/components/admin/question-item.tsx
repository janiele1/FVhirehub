'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Clock, Edit2, Save, X } from "lucide-react"
import { updateQuestion, deleteQuestion } from "@/app/actions/questions"

interface QuestionItemProps {
    question: any
    index: number
    interviewId: string
}

export default function QuestionItem({ question, index, interviewId }: QuestionItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form state
    const [text, setText] = useState(question.question_text)
    const [timeLimit, setTimeLimit] = useState(question.time_limit_seconds)
    const [thinkingTime, setThinkingTime] = useState(question.thinking_time_seconds)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateQuestion(question.id, interviewId, {
                questionText: text,
                timeLimit: Number(timeLimit),
                thinkingTime: Number(thinkingTime)
            })
            setIsEditing(false)
        } catch (error) {
            alert("Failed to save changes")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset to original values
        setText(question.question_text)
        setTimeLimit(question.time_limit_seconds)
        setThinkingTime(question.thinking_time_seconds)
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <Card className="border-blue-500 shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Answer Time (s)</Label>
                            <Input
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                min={30} step={30}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Thinking Time (s)</Label>
                            <Input
                                type="number"
                                value={thinkingTime}
                                onChange={(e) => setThinkingTime(e.target.value)}
                                min={0} step={10}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-4 flex gap-4 items-start justify-between">
                <div className="flex gap-4 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                        {index + 1}
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="font-medium text-lg">{question.question_text}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Answer: {question.time_limit_seconds}s</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Thinking: {question.thinking_time_seconds}s</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4" />
                    </Button>

                    <form action={async () => {
                        // We need a confirm here ideally, but for now direct delete
                        if (!confirm("Are you sure you want to delete this question?")) return;
                        await deleteQuestion(question.id, interviewId)
                    }}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" type="submit">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
