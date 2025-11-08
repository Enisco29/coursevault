import { createClient } from "@/lib/supabase/server"
import CourseGrid from "@/components/dashboard/course-grid"
import CreateCourseButton from "@/components/dashboard/create-course-button"

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <p className="text-muted-foreground mt-1">Organize and manage all your course materials</p>
        </div>
        <CreateCourseButton />
      </div>
      <CourseGrid courses={courses || []} />
    </div>
  )
}
