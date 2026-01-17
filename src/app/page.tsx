import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight, Video, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Logo width={120} height={40} />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Modern Video Interviews.
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl">
                  Screen candidates faster with asynchronous video interviews.
                  Create questions, send links, and review on your own time.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/admin">
                  <Button size="lg" className="h-12 px-8">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/interviews/new">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Create New Interview
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Video First</h3>
                <p className="text-slate-500">
                  See the person behind the resume. Assess communication skills and personality early on.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-blue-50 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Standardized Process</h3>
                <p className="text-slate-500">
                  Ask every candidate the same questions. Reduce bias and make fair comparisons.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-4 bg-blue-50 rounded-full">
                  <ArrowRight className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Fast Screening</h3>
                <p className="text-slate-500">
                  Review 10 video interviews in the time it takes to do 1 phone screen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-light text-sm text-slate-400">
        <p>© 2024 FV HIREHUB. Internal Tool.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
