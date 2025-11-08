import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">CourseVault</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto px-6 py-16 flex flex-col justify-center items-center text-center gap-8">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold">Organize Your Course Materials</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            CourseVault is your secure PDF organizer for courses. Create courses, organize files into folders, and
            easily access all your study materials in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Organize Courses</h3>
            <p className="text-sm text-muted-foreground">Create courses and organize your study materials</p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Nested Folders</h3>
            <p className="text-sm text-muted-foreground">Create hierarchical folder structures</p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">View PDFs</h3>
            <p className="text-sm text-muted-foreground">View and manage all your PDFs in one place</p>
          </div>
        </div>

        <Link href="/auth/sign-up">
          <Button size="lg" className="mt-8">
            Get Started Free
          </Button>
        </Link>
      </div>
    </main>
  )
}
