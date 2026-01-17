'use client'

import { useState } from "react"
import { ChevronDown, ChevronRight, Eye, CheckCircle2, Clock, XCircle, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ICON_MAP: Record<string, any> = {
    pending: User,
    approved: CheckCircle2,
    thinking: Clock,
    rejected: XCircle
}

interface CollapsibleFolderProps {
    group: {
        id: string
        label: string
        color: string
        bg: string
        border: string
        items: any[]
    }
}

export default function CollapsibleFolder({ group }: CollapsibleFolderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const Icon = ICON_MAP[group.id] || User

    return (
        <div className="space-y-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-1 group hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${group.color}`} />
                    <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">{group.label}</h2>
                    <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                        {isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                        )}
                    </div>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {group.items.length}
                </span>
            </button>

            {isOpen && (
                <Card className={`border-l-4 ${group.border} overflow-hidden transition-all duration-300 ease-in-out`}>
                    <CardContent className="p-0">
                        {group.items.length > 0 ? (
                            <div className="divide-y text-left">
                                {group.items.map((app: any) => (
                                    <div key={app.id} className="py-3 px-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xs font-semibold text-slate-900 truncate">
                                                {app.candidates.first_name} {app.candidates.last_name}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 truncate">{app.candidates.email}</p>
                                        </div>
                                        <Link href={`/admin/applications/${app.id}`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 px-4 text-center text-slate-400 text-[10px] italic">
                                Empty folder
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
