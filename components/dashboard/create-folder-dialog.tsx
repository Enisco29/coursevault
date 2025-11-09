"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateFolderDialog({
  courseId,
  parentFolderId,
}: {
  courseId: string;
  parentFolderId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("folders").insert({
        course_id: courseId,
        parent_folder_id: parentFolderId,
        name: folderName,
      });

      if (error) throw error;

      setFolderName("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent cursor-pointer"
        >
          <Plus className="w-4 h-4 " />
          New Sub-Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your documents
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="e.g., Lecture Notes"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Folder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
