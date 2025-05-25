import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { getChapter } from "actions/get-chapter";
import { Banners } from "@/components/Banners";
import { CommentList } from "../../_components/comment-list";
import { db } from "@/lib/db";

const ChapterIdPage = async ({ params }) => {
  const { userId: clerkUserId } = await auth();
  const { courseId, chapterId } = await params;

  if (!clerkUserId) {
    console.log("No user ID found");
    return redirect("/");
  }

  // Find the local user by Clerk userId
  const user = await db.user.findUnique({ where: { clerkId: clerkUserId } });
  if (!user) {
    console.log("No local user found");
    return redirect("/");
  }

  console.log(clerkUserId);

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId: user.id, // Use local DB user ID
      chapterId,
      courseId,
    });

  if (!chapter || !course) {
    console.log("Chapter or course not found");
    return redirect("/");
  }

  // console.log("Chapter Data", chapter.videoUrl, muxData, nextChapter, userProgress, purchase);
  console.log("muxData", muxData);
  console.log("nextChapter", chapter);

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banners variant="warning" label="you need to purchase this course to watch this chapter" />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer videoUrl={chapter.videoUrl} isLocked={isLocked} title={chapter.title} />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          <div className="mt-6 px-4">
            <CommentList courseId={courseId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
