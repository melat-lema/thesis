import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [totalCourses, totalTeachers, totalStudents, allCourses, teachers] = await Promise.all([
      db.course.count(),
      db.user.count({ where: { role: "TEACHER" } }),
      db.user.count({ where: { role: "STUDENT" } }),
      db.course.findMany({
        select: {
          id: true,
          title: true,
          price: true,
          purchases: {
            select: {
              id: true,
              createdAt: true,
            },
          },
          teacherId: true,
        },
      }),
      db.user.findMany({
        where: { role: "TEACHER" },
        select: {
          id: true,
          name: true,
          courses: {
            select: {
              id: true,
              title: true,
              price: true,
              purchases: {
                select: {
                  id: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalIncome = allCourses.reduce((sum, course) => {
      const courseIncome = (course.price || 0) * course.purchases.length;
      return sum + courseIncome;
    }, 0);

    // Calculate earnings per teacher with detailed course information
    const earningsPerTeacher = teachers.map((teacher) => {
      const teacherEarnings = teacher.courses.reduce((total, course) => {
        const courseEarnings = (course.price || 0) * course.purchases.length;
        return total + courseEarnings;
      }, 0);

      return {
        name: teacher.name,
        earnings: teacherEarnings,
        courses: teacher.courses.map((course) => ({
          title: course.title,
          earnings: (course.price || 0) * course.purchases.length,
          purchases: course.purchases.length,
        })),
      };
    });

    return NextResponse.json({
      totalCourses,
      totalTeachers,
      totalStudents,
      totalIncome,
      earningsPerTeacher,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_ANALYTICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
