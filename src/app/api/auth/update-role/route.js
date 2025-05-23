import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { role } = await req.json();

    console.log("userId", userId);
    console.log("role", role);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate role
    if (!role || !["student", "teacher"].includes(role.toLowerCase())) {
      return new NextResponse("Invalid role specified", { status: 400 });
    }
    const roleFormatted = role === "teacher" ? "teacher" : "member";

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
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
