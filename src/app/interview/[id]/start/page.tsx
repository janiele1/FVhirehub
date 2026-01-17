import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startApplication } from "@/app/actions/applications"

export default async function StartInterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div className="max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>
                        Please enter your details to begin the interview.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={startApplication} className="space-y-4">
                        <input type="hidden" name="interviewId" value={id} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>

                        <Button type="submit" className="w-full">Start Interview</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-6 text-center">
                <Link href={`/interview/${id}`} className="text-sm text-slate-500 hover:text-slate-900">
                    ← Back to details
                </Link>
            </div>
        </div>
    )
}
