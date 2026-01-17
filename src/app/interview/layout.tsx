import { Logo } from "@/components/logo"

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex justify-center">
                    <Logo width={140} height={40} />
                </div>
            </header>
            <main className="flex-1 container mx-auto py-8 px-4 max-w-3xl">
                {children}
            </main>
            <footer className="py-6 text-center text-sm text-slate-400">
                Powered by FV HIREHUB
            </footer>
        </div>
    )
}
