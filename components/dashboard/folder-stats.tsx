"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen } from "lucide-react"

export default function FolderStats({ courseId }: { courseId: string }) {
  const [stats, setStats] = useState({ documents: 0, folders: 0 })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: docs } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("course_id", courseId)

      const { data: folders } = await supabase
        .from("folders")
        .select("id", { count: "exact", head: true })
        .eq("course_id", courseId)

      setStats({
        documents: docs?.length || 0,
        folders: folders?.length || 0,
      })
    }

    fetchStats()
  }, [courseId, supabase])

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-2xl font-bold">{stats.documents}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Folders</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-primary" />
          <span className="text-2xl font-bold">{stats.folders}</span>
        </CardContent>
      </Card>
    </div>
  )
}
