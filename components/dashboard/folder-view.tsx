"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateFolderDialog from "./create-folder-dialog";
import DocumentList from "./document-list";
import UploadZone from "./upload-zone";

interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
}

interface Folder {
  id: string;
  name: string;
  created_at: string;
}

export default function FolderView({
  courseId,
  parentFolderId = null,
  folders,
  documents,
}: {
  courseId: string;
  parentFolderId?: string | null;
  folders: Folder[];
  documents: Document[];
}) {
  const [openUpload, setOpenUpload] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 items-center justify-between">
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full py-5 cursor-pointer">
              <UploadIcon className="w-4 h-4" />
              Upload PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload PDF</DialogTitle>
              <DialogDescription>
                Upload one or more PDF files to this folder
              </DialogDescription>
            </DialogHeader>
            <UploadZone
              courseId={courseId}
              folderId={parentFolderId}
              onUploadComplete={() => {
                setOpenUpload(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
        <div className="w-full justify-between flex">
          <h2 className="text-xl font-semibold">Course Content</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <CreateFolderDialog
              courseId={courseId}
              parentFolderId={parentFolderId}
            />
          </div>
        </div>
      </div>

      {folders.length === 0 && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
          <FolderIcon className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Create a folder or upload documents to get started
          </p>
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Folders
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/course/${courseId}/folder/${folder.id}`
                      )
                    }
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <FolderIcon className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">Folder</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && <DocumentList documents={documents} />}
        </>
      )}
    </div>
  );
}
