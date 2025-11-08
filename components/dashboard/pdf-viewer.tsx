"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  url: string
  fileName: string
}

export default function PDFViewer({ url, fileName }: PDFViewerProps) {
  const [scale, setScale] = useState(1)

  const handleZoom = (direction: "in" | "out") => {
    setScale((prev) => {
      const newScale = direction === "in" ? Math.min(prev + 0.2, 3) : Math.max(prev - 0.2, 0.5)
      return newScale
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-muted">
      <div className="border-b border-border bg-background p-4 flex items-center justify-between">
        <p className="text-sm font-medium truncate">{fileName}</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleZoom("out")} disabled={scale <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={() => handleZoom("in")} disabled={scale >= 3}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="ghost" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open External
            </a>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <iframe
          src={`${url}#toolbar=0`}
          className="border border-border rounded-lg shadow-lg"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          title={fileName}
        />
      </div>
    </div>
  )
}
