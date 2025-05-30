import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return new NextResponse("Missing search query", { status: 400 });
    }

    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            NOT: {
              id: userId,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
      },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_SEARCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
