import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Log the incoming body for debugging purposes
        const body = await req.json();
        console.log("Request body:", body);

        // Extract the list from the body
        const { list } = body;

        // Check if list exists and is an array
        if (!Array.isArray(list)) {
            console.log("List is not an array or is undefined:", list);
            return new NextResponse("Invalid list format", { status: 400 });
        }

        // Check if the list is empty
        if (list.length === 0) {
            return new NextResponse("List is empty", { status: 400 });
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

        // Loop through the list and update the chapters
        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position },
            });
        }

        return new NextResponse("Success", { status: 200 });

    } catch (error) {
        console.log("[CHAPTERS] Error:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
