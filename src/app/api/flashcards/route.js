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

    // Generate flashcards using AI
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Generate 15 flashcards based on the following course content. The flashcards should be focused on the topic "${topic}" and should cover key concepts from the course material.

Course Content:
${JSON.stringify(courseContent, null, 2)}

Generate flashcards with the following format:
- Each flashcard should have a question and answer pair
- Questions should test understanding of key concepts from the course material
- Answers should be concise but informative
- Focus on important details and concepts
- Make sure questions are challenging but clear
- Format the response as a JSON array of objects with "question" and "answer" fields

Example format:
[
  {
    "question": "What is the capital of France?",
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
      let flashcards;
      try {
        flashcards = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse AI response:", text);
        return new NextResponse("Failed to generate valid flashcards. Please try again.", {
          status: 500,
        });
      }

      // Validate the flashcards structure
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        return new NextResponse(
          "Generated flashcards are not in the correct format. Please try again.",
          { status: 500 }
        );
      }

      // Save flashcards to database
      const savedFlashcards = await Promise.all(
        flashcards.map((flashcard, index) =>
          db.flashcard.create({
            data: {
              question: flashcard.question,
              answer: flashcard.answer,
              topic: topic,
              position: index,
              studyMaterialId: courseId,
            },
          })
        )
      );

      return NextResponse.json(savedFlashcards);
    } catch (aiError) {
      console.error("[AI_ERROR]", aiError);
      return new NextResponse(
        "Failed to generate flashcards. Please check your API key configuration.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[FLASHCARDS_POST]", error);
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

    const flashcards = await db.flashcard.findMany({
      where: {
        studyMaterialId: courseId,
        ...(topic && { topic }),
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("[FLASHCARDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
