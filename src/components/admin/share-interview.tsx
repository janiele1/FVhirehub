'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Check, Share2, ExternalLink } from "lucide-react"

interface ShareInterviewProps {
    interviewId: string
}

export default function ShareInterview({ interviewId }: ShareInterviewProps) {
    const [baseUrl, setBaseUrl] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBaseUrl(window.location.origin)
    }, [])

    const shareUrl = `${baseUrl}/interview/${interviewId}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    return (
        <Card className="border-2 border-indigo-100 bg-indigo-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                    <Share2 className="h-5 w-5 text-indigo-600" />
                    Share Interview
                </CardTitle>
                <CardDescription className="text-indigo-700/70">
                    Send this link to your candidates to start their one-way interview.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={shareUrl}
                            readOnly
                            className="pr-10 bg-white border-indigo-200 focus-visible:ring-indigo-500"
                        />
                    </div>
                    <Button
                        variant={copied ? "default" : "secondary"}
                        onClick={copyToClipboard}
                        className={copied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                    </Button>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-indigo-600/60 uppercase tracking-wider">Public Link</span>
                    <Button variant="link" className="text-indigo-600 h-auto p-0 flex items-center gap-1 text-sm font-semibold" asChild>
                        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                            Test Candidate View
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
