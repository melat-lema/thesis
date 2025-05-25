import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export const getCourses = async ({ userId: clerkUserId, title, categoryId }) => {
  try {
    // Find the local user by Clerk userId
    let dbUserId = undefined;
    if (clerkUserId) {
      const user = await db.user.findUnique({ where: { clerkId: clerkUserId } });
      dbUserId = user?.id;
    }
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(title && { title: { contains: title } }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: dbUserId
          ? {
              where: {
                userId: dbUserId,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (!dbUserId || course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }
        const progressPercentage = await getProgress(dbUserId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    return coursesWithProgress;
  } catch (error) {
    console.log("GET_COURSES", error);
  }
};
