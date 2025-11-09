"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  color: string;
}

export default function CourseGrid({ courses }: { courses: Course[] }) {
  const router = useRouter();

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No courses yet</h2>
        <p className="text-muted-foreground mt-2">
          Create your first course to get started organizing your PDFs
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/dashboard/course/${course.id}`)}
        >
          <CardHeader className="relative">
            <div
              className="w-full h-20 rounded-lg mb-2"
              style={{ backgroundColor: course.color }}
            />
            <CardTitle className="text-lg absolute p-4 pl-8 bottom-3 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent">
              {course.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {course.description ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No description</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
