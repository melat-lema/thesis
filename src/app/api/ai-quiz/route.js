import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req) {
  try {
    const { courseId, topic } = await req.json();

    // Get the study material and its chapters
    const studyMaterial = await db.studyMaterial.findUnique({
      where: { cId: courseId },
      include: {
        chapters: true,
      },
    });

    if (!studyMaterial) {
      return new NextResponse("Study material not found", { status: 404 });
    }

    // Get the course content from chapters
    const courseContent = studyMaterial.chapters.map((chapter) => ({
      notes: chapter.notes,
      chapterId: chapter.chapterId,
    }));

    // Generate quiz using AI
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Generate 10 multiple choice questions based on the following course content. The questions should be focused on the topic "${topic}" and should cover key concepts from the course material.

Course Content:
${JSON.stringify(courseContent, null, 2)}

Generate questions with the following format:
- Each question should have a question text and 4 options (A, B, C, D)
- One option should be the correct answer
- Questions should test understanding of key concepts
- Make sure questions are challenging but clear
- Format the response as a JSON array of objects with "question", "options", and "answer" fields

Example format:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "answer": "Paris"
  }
]`,
            },
          ],
        },
      ],
    });

    try {
      const result = await chat.sendMessage("");
      const response = await result.response;
      const text = response.text();

      // Parse the response and ensure it's valid JSON
      let quizQuestions;
      try {
        quizQuestions = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse AI response:", text);
        return new NextResponse("Failed to generate valid quiz questions. Please try again.", {
          status: 500,
        });
      }

      // Validate the quiz structure
      if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        return new NextResponse(
          "Generated quiz questions are not in the correct format. Please try again.",
          { status: 500 }
        );
      }

      // Save quiz questions to database
      const savedQuestions = await Promise.all(
        quizQuestions.map((question, index) =>
          db.aIGeneratedQuiz.create({
            data: {
              question: question.question,
              options: question.options,
              answer: question.answer,
              topic: topic,
              position: index,
              studyMaterialId: courseId,
            },
          })
        )
      );

      return NextResponse.json(savedQuestions);
    } catch (aiError) {
      console.error("[AI_ERROR]", aiError);
      return new NextResponse(
        "Failed to generate quiz questions. Please check your API key configuration.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[AI_QUIZ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const topic = searchParams.get("topic");

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const quizQuestions = await db.aIGeneratedQuiz.findMany({
      where: {
        studyMaterialId: courseId,
        ...(topic && { topic }),
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(quizQuestions);
  } catch (error) {
    console.error("[AI_QUIZ_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
