'use client'

import { deleteAdminUser } from "@/app/actions/team"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteUserButton({ userId, email }: { userId: string, email?: string }) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteAdminUser(userId)
                setOpen(false)
            } catch (error) {
                console.error("Failed to delete user:", error)
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove User?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove <strong>{email}</strong>? They will lose access to the admin dashboard immediately.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            "Remove User"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
