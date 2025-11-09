import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PDFViewer from "@/components/dashboard/pdf-viewer"
import DocumentNav from "@/components/dashboard/document-nav"

export const revalidate = 0

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: documentId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: document } = await supabase.from("documents").select("*").eq("id", documentId).single()

  if (!document) redirect("/dashboard")

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", document.course_id)
    .eq("user_id", user.id)
    .single()

  if (!course) redirect("/dashboard")

  return (
    <div className="flex flex-col h-screen bg-background">
      <DocumentNav document={document} courseId={course.id} />
      <PDFViewer url={document.file_url} fileName={document.file_name} />
    </div>
  )
}
