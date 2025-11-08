import { put, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const courseId = formData.get("courseId") as string
    const folderId = formData.get("folderId") as string | null

    if (!file || !courseId) {
      return NextResponse.json({ error: "Missing file or courseId" }, { status: 400 })
    }

    // Verify course belongs to user
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .eq("user_id", user.id)
      .single()

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 })
    }

    // Upload to Vercel Blob
    const blob = await put(`${courseId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Save to database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        folder_id: folderId || null,
        course_id: courseId,
        file_name: file.name,
        file_url: blob.url,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup blob if database insert fails
      await del(blob.url)
      throw dbError
    }

    return NextResponse.json({
      success: true,
      document,
      url: blob.url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
