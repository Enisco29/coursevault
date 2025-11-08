import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FolderView from "@/components/dashboard/folder-view"
import BreadcrumbNav from "@/components/dashboard/breadcrumb-nav"

export const revalidate = 0

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string; folderId: string }>
}) {
  const { id: courseId, folderId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: course } = await supabase.from("courses").select("*").eq("id", courseId).eq("user_id", user.id).single()

  if (!course) redirect("/dashboard")

  const { data: folder } = await supabase
    .from("folders")
    .select("*")
    .eq("id", folderId)
    .eq("course_id", courseId)
    .single()

  if (!folder) redirect(`/dashboard/course/${courseId}`)

  const { data: subfolders } = await supabase
    .from("folders")
    .select("*")
    .eq("parent_folder_id", folderId)
    .order("name", { ascending: true })

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div>
        <BreadcrumbNav courseName={course.title} folderPath={folder.name} />
        <h1 className="text-3xl font-bold mt-4">{folder.name}</h1>
      </div>
      <FolderView
        courseId={courseId}
        parentFolderId={folderId}
        folders={subfolders || []}
        documents={documents || []}
      />
    </div>
  )
}
