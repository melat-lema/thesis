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

    // First get the user from our database
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const course = await db.course.create({
      data: {
        title,
        teacherId: user.id,
      },
    });

    return new NextResponse(JSON.stringify(course), { status: 201 });
  } catch (error) {
    console.log("[COURSE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
