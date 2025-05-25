import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  try {
    const { courseId } = await params;
    // Fetch comments for the course, including user info
    const comments = await db.comment.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true, // avatar
          },
        },
      },
    });
    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { content } = await req.json();
    const { courseId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    // Find the user for avatar/name
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    const comment = await db.comment.create({
      data: {
        content,
        userId: user.id,
        courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
