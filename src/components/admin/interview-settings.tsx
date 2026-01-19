/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Trash2, X, Save, AlertTriangle, Loader2 } from "lucide-react"
import { updateInterview, deleteInterview } from "@/app/actions/interviews"

interface InterviewSettingsProps {
    interview: any
}

export default function InterviewSettings({ interview }: InterviewSettingsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [title, setTitle] = useState(interview.title)
    const [description, setDescription] = useState(interview.description || "")
    const [introVideo, setIntroVideo] = useState(interview.recruiter_intro_video_path || "")

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("recruiterIntro", introVideo)

            await updateInterview(interview.id, formData)
            setIsEditing(false)
        } catch (error) {
            alert("Failed to update interview")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this interview? This will also remove all candidate responses and questions.")) return

        setIsLoading(true)
        try {
            await deleteInterview(interview.id)
        } catch (error) {
            alert("Failed to delete interview")
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <Card className="border-indigo-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Edit Interview Details</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Interview Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="introVideo">Recruiter Intro Video URL (Optional)</Label>
                            <Input
                                id="introVideo"
                                value={introVideo}
                                onChange={(e) => setIntroVideo(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                Edit Details
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Trash2 className="h-3.5 w-3.5 mr-2" />}
                Delete
            </Button>
        </div>
    )
}
