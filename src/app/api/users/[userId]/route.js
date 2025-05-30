import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  const { userId: paramsUserId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: paramsUserId,
      },
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Map image to imageUrl for frontend
    const formattedUser = {
      ...user,
      imageUrl: user.image,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
