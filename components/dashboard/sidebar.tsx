"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar({ user }: { user: User }) {
  const router = useRouter();

  return (
    <aside className="w-64 border-r border-border bg-background p-6 hidden md:flex flex-col">
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">CourseVault</h1>
      </div>
      <nav className="space-y-2 flex-1">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-accent text-sm font-medium"
        >
          My Courses
        </Link>
      </nav>
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </aside>
  );
}
