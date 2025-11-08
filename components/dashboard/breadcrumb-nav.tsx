"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function BreadcrumbNav({
  courseName,
  folderPath,
}: {
  courseName: string
  folderPath?: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/dashboard" className="hover:text-foreground">
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span>{courseName}</span>
      {folderPath && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span>{folderPath}</span>
        </>
      )}
    </div>
  )
}
