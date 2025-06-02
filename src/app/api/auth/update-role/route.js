import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { role, userId: userIdFromParams } = await req.json();

    console.log("userId", userId);
    console.log("userIdFromParams", userIdFromParams);
    console.log("role", role);

    if (!userIdFromParams) {
      console.log("userId is not found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate role
    if (!role || !["student", "teacher"].includes(role.toLowerCase())) {
      return new NextResponse("Invalid role specified", { status: 400 });
    }
    const roleFormatted = role === "teacher" ? "teacher" : "student";

    const client = await clerkClient();
    await client.users.updateUserMetadata(userIdFromParams, {
      publicMetadata: { role: roleFormatted },
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating metadata:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to update metadata" }), {
      status: 500,
    });
  }
}
