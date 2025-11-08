import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, blobUrl } = await request.json()

    if (!documentId || !blobUrl) {
      return NextResponse.json({ error: "Missing documentId or blobUrl" }, { status: 400 })
    }

    // Verify document belongs to user's course
    const { data: document } = await supabase.from("documents").select("course_id").eq("id", documentId).single()

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("id", document.course_id)
      .eq("user_id", user.id)
      .single()

    if (!course) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", documentId)

    if (deleteError) throw deleteError

    // Delete from Vercel Blob
    await del(blobUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
