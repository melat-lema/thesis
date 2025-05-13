import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        console.log(userId)
        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });

        return new NextResponse(JSON.stringify(course), { status: 201 });
    } catch (error) {
        console.log("[COURSE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
