import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "teacher" or "student"

    if (!id || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify admin role
    // const admin = await db.user.findUnique({
    //   where: { id: userId },
    //   select: { role: true },
    // });

    // if (!admin || admin.role !== "admin") {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Delete user and all related data
    await db.$transaction(async (tx) => {
      // Delete messages where user is sender or receiver
      await tx.message.deleteMany({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
      });

      // Delete comments
      await tx.comment.deleteMany({
        where: { userId: id },
      });

      // Delete chapa transactions
      await tx.chapaTransaction.deleteMany({
        where: { userId: id },
      });

      // Delete teacher qualifications if exists
      await tx.teacherQualification.deleteMany({
        where: { userId: id },
      });

      // For teachers, handle their courses
      if (type === "teacher") {
        // Get all courses by this teacher
        const teacherCourses = await tx.course.findMany({
          where: { teacherId: id },
          select: { id: true },
        });

        // Delete all related data for each course
        for (const course of teacherCourses) {
          // Delete course attachments
          await tx.attachment.deleteMany({
            where: { courseId: course.id },
          });

          // Delete course chapters and related data
          const chapters = await tx.chapter.findMany({
            where: { courseId: course.id },
            select: { id: true },
          });

          for (const chapter of chapters) {
            // Delete mux data
            await tx.muxData.deleteMany({
              where: { chapterId: chapter.id },
            });

            // Delete quizzes and questions
            const quizzes = await tx.quiz.findMany({
              where: { chapterId: chapter.id },
              select: { id: true },
            });

            for (const quiz of quizzes) {
              await tx.question.deleteMany({
                where: { quizId: quiz.id },
              });
              await tx.quiz.delete({
                where: { id: quiz.id },
              });
            }

            // Delete user progress
            await tx.userProgress.deleteMany({
              where: { chapterId: chapter.id },
            });

            // Delete chapter
            await tx.chapter.delete({
              where: { id: chapter.id },
            });
          }

          // Delete purchases
          await tx.purchase.deleteMany({
            where: { courseId: course.id },
          });

          // Delete course
          await tx.course.delete({
            where: { id: course.id },
          });
        }
      }

      // For students, handle their enrollments
      if (type === "student") {
        // Delete purchases
        await tx.purchase.deleteMany({
          where: { userId: id },
        });

        // Delete user progress
        await tx.userProgress.deleteMany({
          where: { userId: id },
        });
      }

      // Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });

    return new NextResponse("User deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE_USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
