import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all teachers
    const teachers = await db.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdAt: true,
        emailVerified: true,
        courses: {
          select: {
            id: true,
            price: true,
            purchases: true,
          },
        },
      },
    });

    // Map to required format
    const result = teachers.map((teacher) => {
      const totalCourses = teacher.courses.length;
      const totalIncome = teacher.courses.reduce((sum, course) => {
        const courseIncome = (course.price || 0) * course.purchases.length;
        return sum + courseIncome;
      }, 0);
      return {
        id: teacher.id,
        name: teacher.name,
        image: teacher.image,
        email: teacher.email,
        createdAt: teacher.createdAt,
        isVerified: !!teacher.emailVerified,
        totalCourses,
        totalIncome,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_TEACHERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
