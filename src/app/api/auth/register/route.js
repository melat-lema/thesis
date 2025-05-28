import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { clerkId, email, name, role } = await req.json();

    if (!clerkId || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await db.user.update({
        where: { clerkId },
        data: {
          email,
          name,
          role: role || "STUDENT",
        },
      });
      return NextResponse.json(updatedUser);
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        clerkId,
        email,
        name,
        role: role || "STUDENT",
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("[REGISTER_USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
