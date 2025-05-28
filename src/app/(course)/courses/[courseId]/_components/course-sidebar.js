import { CourseProgress } from "@/components/course-progress";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CourseSidebarItem from "./course-sidebar-item";

const CourseSidebar = async ({ course, progressCount }) => {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return redirect("/");
  }

  // Get the local user from our database
  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  // Get user progress for all chapters
  const userProgress = await db.userProgress.findMany({
    where: {
      userId: user.id,
      chapterId: {
        in: course.chapters.map((chapter) => chapter.id),
      },
    },
  });

  // Create a map of chapter progress
  const chapterProgressMap = userProgress.reduce((acc, progress) => {
    acc[progress.chapterId] = progress.isCompleted;
    return acc;
  }, {});

  // Prepare chapters data for progress component
  const chaptersWithProgress = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    isCompleted: !!chapterProgressMap[chapter.id],
  }));

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {(purchase || course.isPublished) && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
              chapters={chaptersWithProgress}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapterProgressMap[chapter.id]}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
