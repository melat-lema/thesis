import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { createdBy } = await req.json();

  const result = await db.studyMaterial.findMany({
    where: { createdBy },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ result });
}

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const courseId = searchParams?.get("courseId");

  const course = await db.studyMaterial.findFirst({
    where: { cId: courseId || "" },
  });

  return NextResponse.json({ result: course });
}
