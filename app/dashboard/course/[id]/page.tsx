import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FolderView from "@/components/dashboard/folder-view";
import BreadcrumbNav from "@/components/dashboard/breadcrumb-nav";
import CourseSettings from "@/components/dashboard/course-settings";

export const revalidate = 0;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();

  if (!course) redirect("/dashboard");

  const { data: rootFolders } = await supabase
    .from("folders")
    .select("*")
    .eq("course_id", courseId)
    .is("parent_folder_id", null)
    .order("name", { ascending: true });

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("course_id", courseId)
    .is("folder_id", null)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="">
        <div>
          <div className="flex justify-between items-center">
            <BreadcrumbNav courseName={course.title} />
            <CourseSettings course={course} />
          </div>
          <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-2">{course.description}</p>
          )}
        </div>
      </div>
      <FolderView
        courseId={courseId}
        folders={rootFolders || []}
        documents={documents || []}
      />
    </div>
  );
}
