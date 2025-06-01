import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const studyMaterial = await db.studyMaterial.findUnique({
      where: { cId: courseId },
      include: {
        chapters: true,
      },
    });

    if (!studyMaterial) {
      return new NextResponse("Study material not found", { status: 404 });
    }

    return NextResponse.json(studyMaterial);
  } catch (error) {
    console.error("[STUDY_TYPE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const studyMaterial = await db.studyMaterial.findUnique({
      where: { cId: courseId },
      include: {
        chapters: true,
      },
    });

    if (!studyMaterial) {
      return new NextResponse("Study material not found", { status: 404 });
    }

    return NextResponse.json(studyMaterial);
  } catch (error) {
    console.error("[STUDY_TYPE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
