import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Validate questions and options
function isValidQuestion(question) {
  return (
    question?.text?.trim() &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    question.options.every(opt => typeof opt === "string" && opt.trim()) &&
    question.options.includes(question.correctAnswer)
  );
}

export async function PATCH(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId, quizId } = await params;
    const { questions } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!questions?.length) return new NextResponse("At least one question is required", { status: 400 });

    // Validate questions
    const invalids = questions
      .map((q, i) => (!isValidQuestion(q) ? `Question ${i + 1}` : null))
      .filter(Boolean);

    if (invalids.length > 0) {
      return new NextResponse(`Invalid input in: ${invalids.join(", ")}`, { status: 400 });
    }

    // Confirm user owns the course
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) return new NextResponse("Unauthorized", { status: 401 });

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { select: { id: true } } },
    });

    if (!quiz) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    const questionIds = quiz.questions.map(q => q.id);

    // Update quiz via transaction
    const updatedQuiz = await db.$transaction(async (tx) => {
      await tx.option.deleteMany({
        where: {
          questionId: { in: questionIds },
        },
      });

      await tx.question.deleteMany({
        where: {
          id: { in: questionIds },
        },
      });

      return await tx.quiz.update({
        where: { id: quizId },
        data: {
          questions: {
            create: questions.map(q => ({
              text: q.text.trim(),
              correctAnswer: q.correctAnswer.trim(),
              questionType: q.questionType || "multiple_choice",
              explanation: q.explanation || "",
              options: {
                create: q.options.map(opt => ({
                  text: opt.trim(),
                  isCorrect: opt.trim() === q.correctAnswer.trim(),
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: { options: true },
          },
        },
      });
    });

    return NextResponse.json(updatedQuiz);

  } catch (error) {
    console.error("[QUIZ_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
