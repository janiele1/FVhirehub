/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Clock, X, Loader2, User } from "lucide-react"
import { updateApplicationStatus } from "@/app/actions/applications"
import { useRouter } from "next/navigation"

interface StatusSelectorProps {
    applicationId: string
    currentStatus: string
}

export default function StatusSelector({ applicationId, currentStatus }: StatusSelectorProps) {
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    const handleStatusUpdate = async (newStatus: string) => {
        if (newStatus === currentStatus) return

        console.log(`[StatusSelector] Attempting to update application ${applicationId} to ${newStatus}`)
        setIsUpdating(true)
        try {
            await updateApplicationStatus(applicationId, newStatus)
            console.log(`[StatusSelector] Update successful, refreshing...`)
            router.refresh()
        } catch (error: any) {
            console.error("Failed to update status", error)
            alert("Failed to update status: " + (error.message || "Unknown error"))
        } finally {
            setIsUpdating(false)
        }
    }

    const statuses = [
        { id: 'pending', label: 'Pending', activeLabel: 'Pending', icon: User, color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', activeBg: 'bg-blue-100 border-blue-100' },
        { id: 'approved', label: 'Approve', activeLabel: 'Approved', icon: Check, color: 'text-green-600', hoverBg: 'hover:bg-green-50', activeBg: 'bg-green-100 border-green-200' },
        { id: 'thinking', label: 'Thinking', activeLabel: 'Thought', icon: Clock, color: 'text-amber-600', hoverBg: 'hover:bg-amber-50', activeBg: 'bg-amber-100 border-amber-200' },
        { id: 'rejected', label: 'Reject', activeLabel: 'Rejected', icon: X, color: 'text-red-600', hoverBg: 'hover:bg-red-50', activeBg: 'bg-red-100 border-red-200' },
    ]

    return (
        <div className="flex gap-2">
            {statuses.map((status) => {
                const Icon = status.icon
                const isActive = currentStatus === status.id

                return (
                    <Button
                        key={status.id}
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(status.id)}
                        className={`flex items-center gap-1.5 transition-colors ${isActive ? status.activeBg : status.hoverBg}`}
                    >
                        {isUpdating && isActive ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Icon className={`h-3.5 w-3.5 ${status.color}`} />
                        )}
                        <span className={isActive ? 'font-semibold' : ''}>
                            {isActive ? status.activeLabel : status.label}
                        </span>
                    </Button>
                )
            })}
        </div>
    )
}
