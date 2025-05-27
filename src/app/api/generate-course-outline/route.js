import { inngest } from "@/inngest/client";
import { courseOutline } from "@/lib/AiModel";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

    console.log(courseId, topic, courseType, difficultyLevel, createdBy);

    const PROMPT = `Generate a study material for ${topic} for an ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, list of Chapter along with summary for each chapter with black emojis as a field, Topic list in each chapter in All in JSON format`;

    const aiResp = await courseOutline.sendMessage(PROMPT);
    const aiResult = JSON.parse(aiResp.response.text());

    console.log(createdBy);

    const newMaterial = await db.studyMaterial.create({
      data: {
        cId: courseId,
        studyType: courseType,
        topic,
        difficultyLevel,
        courseLayout: aiResult,
        createdBy,
      },
    });

    const result = await inngest.send({
      name: "notes.generate",
      data: {
        course: newMaterial,
      },
    });

    console.log(result);
    console.log(newMaterial);

    return NextResponse.json({ result: newMaterial });
  } catch (error) {
    console.error("Error creating study material:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
