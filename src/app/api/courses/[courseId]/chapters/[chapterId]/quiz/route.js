import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { courseId, chapterId } = await params;
  const { title = "Chapter Quiz", description = "", questions = [] } = await req.json();

  try {
    // Ensure chapter exists using findFirst (not findUnique)
    const chapter = await db.chapter.findFirst({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Prepare question + option creation
    const formattedQuestions = questions.map((question) => {
      if (!question.text) throw new Error("Each question must have text.");

      const formattedOptions = question.options.map((optionText) => ({
        text: optionText,
        isCorrect: optionText === question.correctAnswer,
      }));

      return {
        text: question.text,
        questionType: question.questionType || "multiple_choice",
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "",
        options: {
          create: formattedOptions,
        },
      };
    });

    // Create quiz with nested questions and options
    const newQuiz = await db.quiz.create({
      data: {
        title,
        description,
        chapterId, // Multiple quizzes can now be created for the same chapter
        questions: {
          create: formattedQuestions,
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Quiz creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create quiz" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { courseId, chapterId } = params;

  try {
    const quiz = await db.quiz.findFirst({
      where: {
        chapterId: chapterId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch quiz" }, { status: 500 });
  }
}
