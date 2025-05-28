import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { userId: clerkUserId } = await auth();
    const { chapterId } = await params;
    const { isCompleted } = await req.json();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the local user from our database
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get the chapter to check if it's from an AI-generated course
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Check if user has purchased the course or if it's an AI-generated course
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: chapter.courseId,
        },
      },
    });

    // Allow progress tracking for both purchased courses and AI-generated courses
    if (!purchase && !chapter.course.isPublished) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId,
        },
      },
      update: {
        isCompleted,
        lastAttemptAt: new Date(),
      },
      create: {
        userId: user.id,
        chapterId,
        isCompleted,
        lastAttemptAt: new Date(),
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
