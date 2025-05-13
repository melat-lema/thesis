import { courseOutlineAIModel } from "@/lib/AiModel";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const schema = z.object({
  cId: z.string(),
  createdBy: z.string(),
  topic: z.string().default("General"), // Default value
  difficultyLevel: z.string().default("Beginner"), // Default value
  studyType: z.string().default("DefaultStudyType"), // Default value
});

export async function POST(req) {
  try {
    // Parse and validate input data
    const body = await req.json();
    const validatedData = schema.parse(body);
    const { cId, createdBy, topic, difficultyLevel, studyType } = validatedData;

    // Prepare the AI prompt
    const PROMPT = `Generate a study material for ${topic} for ${studyType} and level of difficulty will be ${difficultyLevel} with summary of course, list of chapters along with summary for each chapter, topic list in each chapter in JSON format`;

    // Send the prompt to AI and await the response
    const aiResponse = await courseOutlineAIModel.sendMessage(PROMPT);

    if (!aiResponse || !aiResponse.response || !aiResponse.response.text) {
      console.error('Invalid AI response structure:', aiResponse);
      return new Response("Internal Server Error: Invalid AI Response", { status: 500 });
    }

    // Parse the AI response
    const aiText = await aiResponse.response.text();
    let aiResult;
    try {
      aiResult = JSON.parse(aiText);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI response text:', aiText);
      return new Response("Internal Server Error: Failed to Parse AI Response", { status: 500 });
    }

    // Insert the result into the database
    const data = {
      cId,
      createdBy,
      topic,
      difficultyLevel,
      studyType,
      courseLayout: aiResult,
    };

    const dbResult = await db.studyMaterial.create({ data });

    // Return the database result as a JSON response
    return NextResponse.json({ result: dbResult });

  } catch (error) {
    console.error('Error generating course outline:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.issues,
        }),
        { status: 400 }
      );
    }

    // Handle other errors
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}