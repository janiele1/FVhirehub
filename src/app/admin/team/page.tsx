/* eslint-disable @typescript-eslint/no-explicit-any */
import { listAdminUsers } from "@/app/actions/team"
import { AddUserForm } from "@/components/admin/add-user-form"
import { DeleteUserButton } from "@/components/admin/delete-user-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, User } from "lucide-react"
// import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export default async function TeamPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email?.toLowerCase() !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase()) {
        redirect("/admin")
    }

    const users = await listAdminUsers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Management</h1>
                    <p className="text-slate-500">Manage access to the admin dashboard.</p>
                </div>
                <AddUserForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                    <CardDescription>
                        A list of all users with access to the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User className="h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.email}
                                        {user.user_metadata?.full_name && (
                                            <span className="block text-xs text-slate-500 font-normal">
                                                {user.user_metadata.full_name}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="h-3 w-3 text-slate-400" />
                                            <span className="text-sm text-slate-600">Admin</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DeleteUserButton userId={user.id} email={user.email} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
