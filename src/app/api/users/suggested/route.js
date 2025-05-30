import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get current user's role and ID
    const currentUser = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    let suggestedUsers = [];

    switch (currentUser.role) {
      case "TEACHER":
        // Get all students
        suggestedUsers = await db.user.findMany({
          where: {
            role: "STUDENT",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
          orderBy: {
            name: "asc",
          },
        });
        break;

      case "STUDENT":
        // Get all teachers
        suggestedUsers = await db.user.findMany({
          where: {
            role: "TEACHER",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
          orderBy: {
            name: "asc",
          },
        });
        break;

      case "ADMIN":
        // Get all teachers and students
        suggestedUsers = await db.user.findMany({
          where: {
            role: {
              in: ["TEACHER", "STUDENT"],
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
          orderBy: {
            name: "asc",
          },
        });
        break;

      default:
        return new NextResponse("Invalid user role", { status: 400 });
    }

    // Map image to imageUrl for frontend and add additional info
    const formattedUsers = suggestedUsers.map((user) => ({
      ...user,
      imageUrl: user.image,
      displayName: user.name || user.email.split("@")[0], // Fallback to email username if no name
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("[USERS_SUGGESTED_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
