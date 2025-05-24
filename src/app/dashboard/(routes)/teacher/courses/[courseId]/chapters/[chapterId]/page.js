import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { boolean } from "zod";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideo, ChapterVideoForm } from "./_components/chapter-video-form";

import { ChapterActions } from "./_components/chapter-actions";
import { ChapterQuizForm } from "./_components/chapter-quiz-form";
import { Banners } from "@/components/Banners";

export default async function ChapterPage({ params }) {
  const { userId } = await auth();
  const { courseId, chapterId, isPublished } = await params;

  if (!userId) return redirect("/");
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
      quizzes: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
  if (!chapter) return redirect("/");

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
    Boolean(chapter.quizzes?.questions?.length),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banners
          variant="warning"
          label="This chapter is unpublished.It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
              </div>
              <ChapterActions
                disabled={isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access setting</h2>
              </div>
              <ChapterAccessForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
            <ChapterQuizForm
              initialData={{ quizzes: chapter.quizzes }}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
