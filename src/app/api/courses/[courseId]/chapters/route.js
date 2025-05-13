import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const {courseId}= await params

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
        if (!courseId) {
            return new NextResponse("Course ID is required", { status: 400 });
          }
          
        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        console.log("Creating chapter:", { title, courseId: courseId, newPosition });

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            },
        });

        console.log("Chapter created:", chapter);

        return NextResponse.json(chapter);
      
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
