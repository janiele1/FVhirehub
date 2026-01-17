import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Eye, CheckCircle2, Clock, XCircle, User } from "lucide-react"
import CollapsibleFolder from "@/components/admin/collapsible-folder"

export default async function InterviewApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { data: interview } = await supabaseAdmin
        .from("interviews")
        .select("title")
        .eq("id", id)
        .single()

    const { data: applications } = await supabaseAdmin
        .from("applications")
        .select("*, candidates(*)")
        .eq("interview_id", id)
        .order("created_at", { ascending: false })

    const statusGroups = [
        { id: 'pending', label: 'New / Pending', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { id: 'approved', label: 'Approved', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
        { id: 'thinking', label: 'Thinking', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { id: 'rejected', label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    ]

    const groupedApplications = statusGroups.map(group => {
        const items = applications?.filter(app => {
            // Map legacy 'completed' or 'reviewed' to 'pending' if they haven't been moved yet
            if (group.id === 'pending') {
                return app.status === 'pending' || app.status === 'completed' || app.status === 'reviewed'
            }
            return app.status === group.id
        }) || []

        return {
            ...group,
            items
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href={`/admin/interviews/${id}`} className="text-sm text-slate-500 hover:text-slate-900 mb-1 block">
                        ← Back to Interview Details
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applications</h1>
                    <p className="text-slate-500">For {interview?.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Pending Applications */}
                <div className="lg:col-span-8 space-y-6">
                    {groupedApplications.filter(g => g.id === 'pending').map((group) => {
                        const Icon = group.id === 'pending' ? User : group.id === 'approved' ? CheckCircle2 : group.id === 'thinking' ? Clock : XCircle
                        return (
                            <div key={group.id} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-5 w-5 ${group.color}`} />
                                    <h2 className="text-xl font-bold text-slate-800">{group.label} ({group.items.length})</h2>
                                </div>
                                <Card className={`border-l-4 ${group.border}`}>
                                    <CardContent className="p-0">
                                        {group.items.length > 0 ? (
                                            <div className="divide-y text-left">
                                                {group.items.map((app: any) => (
                                                    <div key={app.id} className="py-4 px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                        <div>
                                                            <h3 className="font-medium text-slate-900">
                                                                {app.candidates.first_name} {app.candidates.last_name}
                                                            </h3>
                                                            <p className="text-sm text-slate-500">{app.candidates.email}</p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                Applied: {new Date(app.created_at).toDateString()}
                                                            </p>
                                                        </div>
                                                        <Link href={`/admin/applications/${app.id}`}>
                                                            <Button variant="outline" size="sm" className="gap-2">
                                                                <Eye className="h-4 w-4" />
                                                                Review
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 px-6 text-center text-slate-400 text-sm italic">
                                                No pending applications
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}

                    {(!applications || applications.length === 0) && (
                        <Card className="border-dashed bg-slate-50 py-12">
                            <CardContent className="text-center text-slate-500">
                                No applications received yet.
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side: Collapsible Folders */}
                <div className="lg:col-span-4 space-y-6 sticky top-8">
                    {groupedApplications.filter(g => g.id !== 'pending').map((group) => (
                        <CollapsibleFolder key={group.id} group={group} />
                    ))}
                </div>
            </div>
        </div>
    )
}
