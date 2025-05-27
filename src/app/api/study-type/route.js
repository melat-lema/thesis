import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();

    const notes = await db.chapterNote.findMany({
      where: { courseId },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching chapter notes:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
