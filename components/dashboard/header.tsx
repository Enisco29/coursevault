"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ user }: { user: User }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="font-bold bg-black text-white p-2 rounded-md md:hidden block">
          <BookOpen />
        </div>
        <div className="md:block hidden"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu className="w-8 h-8" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
