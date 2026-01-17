import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createInterview } from "@/app/actions/interviews"
import Link from "next/link"

export default function NewInterviewPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
                    ← Back to Dashboard
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Interview</CardTitle>
                    <CardDescription>
                        Set up a new position to start accepting video applications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createInterview} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title / Interview Name</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Senior Frontend Engineer"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description & Instructions</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Briefly describe the role and what you're looking for..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recruiterIntro">Recruiter Intro Video URL (Optional)</Label>
                            <Input
                                id="recruiterIntro"
                                name="recruiterIntro"
                                type="url"
                                placeholder="https://..."
                            />
                            <p className="text-sm text-slate-500">
                                Paste a link to a hosted video (e.g. Supabase Storage public URL).
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit">Create Interview</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
