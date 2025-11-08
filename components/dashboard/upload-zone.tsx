"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UploadZoneProps {
  courseId: string
  folderId?: string | null
  onUploadComplete?: () => void
}

export default function UploadZone({ courseId, folderId, onUploadComplete }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; progress: number; id: string }[]>([])
  const router = useRouter()

  const handleUpload = useCallback(
    async (files: FileList) => {
      setIsUploading(true)
      const newFiles = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        progress: 0,
      }))
      setUploadedFiles(newFiles)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.includes("pdf")) {
          setUploadedFiles((prev) => prev.map((f) => (f.id === newFiles[i].id ? { ...f, progress: -1 } : f)))
          continue
        }

        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("courseId", courseId)
          if (folderId) formData.append("folderId", folderId)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Upload failed")

          setUploadedFiles((prev) => prev.map((f) => (f.id === newFiles[i].id ? { ...f, progress: 100 } : f)))
        } catch (error) {
          console.error("Upload error:", error)
          setUploadedFiles((prev) => prev.map((f) => (f.id === newFiles[i].id ? { ...f, progress: -1 } : f)))
        }
      }

      setIsUploading(false)
      setTimeout(() => {
        setUploadedFiles([])
        router.refresh()
        onUploadComplete?.()
      }, 1500)
    },
    [courseId, folderId, router, onUploadComplete],
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium">Drag PDF files here</p>
        <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <Button asChild variant="outline" className="mt-4 bg-transparent" disabled={isUploading}>
          <label htmlFor="file-upload">{isUploading ? "Uploading..." : "Select Files"}</label>
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Upload Status</p>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <div className="flex-1">
                <p className="text-sm truncate">{file.name}</p>
                {file.progress >= 0 && file.progress < 100 && (
                  <div className="w-full bg-border rounded-full h-1 mt-1">
                    <div
                      className="bg-primary h-1 rounded-full transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
                {file.progress === 100 && <p className="text-xs text-green-600 mt-1">Uploaded</p>}
                {file.progress === -1 && <p className="text-xs text-destructive mt-1">Failed (PDF only)</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
