import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { DeleteInterviewButton } from "@/components/admin/delete-interview-button"

export default async function AdminDashboard() {
    const { data: interviews } = await supabaseAdmin
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interviews</h1>
                    <p className="text-slate-500">Manage your interview positions and questions.</p>
                </div>
                <Link href="/admin/interviews/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Interview
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {interviews && interviews.length > 0 ? (
                    interviews.map((interview: { id: string; title: string; description: string; created_at: string }) => (
                        <Card key={interview.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">{interview.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-xs text-slate-500">
                                        {new Date(interview.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/interviews/${interview.id}/applications`}>
                                            <Button variant="secondary" size="sm">Applications</Button>
                                        </Link>
                                        <Link href={`/admin/interviews/${interview.id}`}>
                                            <Button variant="outline" size="sm">Manage</Button>
                                        </Link>
                                        <DeleteInterviewButton id={interview.id} title={interview.title} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-dashed bg-slate-50 col-span-full">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-lg font-medium">No interviews yet</CardTitle>
                            <CardDescription>Create your first interview to get started.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center pb-6">
                            <Link href="/admin/interviews/new">
                                <Button variant="outline" size="sm">Create Interview</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
