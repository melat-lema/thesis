import { db } from "@/lib/db";

export const getProgress = async (userId, courseId) => {
  try {
    // Get the course to check if it's AI-generated
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return 0;
    }

    // Get all published chapters for the course
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    if (publishedChapters.length === 0) {
      return 0;
    }

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    // Get completed chapters for the user
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    // Calculate progress percentage
    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
