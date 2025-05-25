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

const ChapterIdPage = async ({ params }) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
    console.log("No user ID found");
    return redirect("/");
  }

  console.log(userId);

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId,
      chapterId,
      courseId,
    });

  console.log(chapter, course);

  if (!chapter || !course) {
    console.log("Chapter or course not found");
    return redirect("/");
  }

  // DEBUG VIDEO PLAYER

  console.log(chapter.videoUrl, muxData, nextChapter, userProgress, purchase);

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banners variant="warning" label="you need to purchase this course to watch this chapter" />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playBackId={muxData?.playBackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
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
            {/* <Preview value={chapter.description} /> */}
            <p className="text-md text-muted-foreground ml-3">{chapter.description}</p>
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => {
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>;
                })}
                {/* <Preview value={chapter.description} /> */}
                <p className="text-xs text-muted-foreground ml-3">{chapter.description}</p>
              </div>
            </>
          )}
          <div className="mt-6 px-4">
            <CommentList courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
