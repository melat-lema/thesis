import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all students
    const students = await db.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdAt: true,
        enrolledCourses: {
          select: { id: true },
        },
      },
    });

    // Map to required format
    const result = students.map((student) => ({
      id: student.id,
      name: student.name,
      image: student.image,
      email: student.email,
      createdAt: student.createdAt,
      totalCourses: student.enrolledCourses.length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_STUDENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
