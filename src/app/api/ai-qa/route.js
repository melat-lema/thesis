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

    // Generate Q&A pairs using AI
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Generate 10 common questions and detailed answers based on the following course content. The Q&A pairs should be focused on the topic "${topic}" and should cover key concepts from the course material.

Course Content:
${JSON.stringify(courseContent, null, 2)}

Generate Q&A pairs with the following format:
- Each pair should have a clear question and a detailed answer
- Questions should be common queries students might have
- Answers should be comprehensive and easy to understand
- Focus on important concepts and practical applications
- Format the response as a JSON array of objects with "question" and "answer" fields

Example format:
[
  {
    "question": "What is the main purpose of this concept?",
    "answer": "The main purpose is to help students understand the fundamental principles and apply them in real-world scenarios. It provides a framework for analyzing and solving problems in this field."
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
      let qaPairs;
      try {
        qaPairs = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse AI response:", text);
        return new NextResponse("Failed to generate valid Q&A pairs. Please try again.", {
          status: 500,
        });
      }

      // Validate the Q&A structure
      if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
        return new NextResponse(
          "Generated Q&A pairs are not in the correct format. Please try again.",
          { status: 500 }
        );
      }

      // Save Q&A pairs to database
      const savedQAPairs = await Promise.all(
        qaPairs.map((qa, index) =>
          db.aIGeneratedQA.create({
            data: {
              question: qa.question,
              answer: qa.answer,
              topic: topic,
              position: index,
              studyMaterialId: courseId,
            },
          })
        )
      );

      return NextResponse.json(savedQAPairs);
    } catch (aiError) {
      console.error("[AI_ERROR]", aiError);
      return new NextResponse(
        "Failed to generate Q&A pairs. Please check your API key configuration.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[AI_QA_POST]", error);
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

    const qaPairs = await db.aIGeneratedQA.findMany({
      where: {
        studyMaterialId: courseId,
        ...(topic && { topic }),
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(qaPairs);
  } catch (error) {
    console.error("[AI_QA_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
