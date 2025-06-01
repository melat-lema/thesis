import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;
    const { quizId, score, answers } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get or create user progress
    let userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: chapterId,
        },
      },
    });

    if (!userProgress) {
      userProgress = await db.userProgress.create({
        data: {
          userId: user.id,
          chapterId: chapterId,
          quizScore: score,
          attempts: 1,
          bestScore: score,
          lastAttemptAt: new Date(),
        },
      });
    } else {
      // Update existing progress
      userProgress = await db.userProgress.update({
        where: {
          id: userProgress.id,
        },
        data: {
          quizScore: score,
          attempts: userProgress.attempts + 1,
          bestScore: Math.max(userProgress.bestScore || 0, score),
          lastAttemptAt: new Date(),
          isCompleted: score >= 70, // Mark as completed if score is 70% or higher
        },
      });
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[QUIZ_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
