import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Route handler for POST /api/...
export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    const { url } = await req.json();
    const {courseId}= await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: courseId,
      },
    });

    return NextResponse.json(attachment); // ✅ Correct usage in JS
  } catch (error) {
    console.error("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
