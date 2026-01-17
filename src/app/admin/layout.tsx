import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="border-b bg-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="flex items-center gap-2">
                            <Logo width={100} height={35} />
                            <span className="text-sm font-semibold text-slate-500">Admin</span>
                        </Link>
                        <div className="hidden md:flex gap-4">
                            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Interviews
                            </Link>
                            <Link href="/admin/candidates" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Candidates
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Placeholder for User Profile / Logout */}
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto py-8 px-4">
                {children}
            </main>
        </div>
    )
}
