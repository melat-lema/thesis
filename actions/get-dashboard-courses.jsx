import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export const getDashboardCourses = async (clerkUserId) => {
  try {
    // Find the local user by Clerk userId
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });
    if (!user) {
      return { completedCourses: [], coursesInProgress: [] };
    }
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: user.id, // Use local DB user ID
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => purchase.course);

    // Create an array of promises to fetch progress for each course concurrently
    const progressPromises = courses.map(async (course) => {
      const progress = await getProgress(user.id, course.id);
      return { ...course, progress }; // Create a new object with updated progress
    });

    // Use Promise.all to wait for all progress requests to complete
    const coursesWithProgress = await Promise.all(progressPromises);

    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100);
    const coursesInProgress = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
