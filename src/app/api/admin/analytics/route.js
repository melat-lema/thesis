import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get active users count
    const activeStudents = await db.user.count({
      where: { role: "STUDENT" },
    });

    const activeTeachers = await db.user.count({
      where: { role: "TEACHER" },
    });

    // Get course creation trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const courseTrend = await db.course.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get signup trend
    const signupTrend = await db.user.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get top courses by engagement
    const topCourses = await db.course.findMany({
      include: {
        students: true,
        comments: true,
      },
      orderBy: {
        students: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Get recent comments
    const recentComments = await db.comment.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Get payment analytics with enhanced teacher and course information
    const payments = await db.chapaTransaction.findMany({
      where: {
        status: "completed",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const platformRevenue = totalRevenue * 0.2; // 20% platform fee
    const teacherPayouts = totalRevenue * 0.8; // 80% teacher payout

    // Get detailed teacher earnings with course breakdown
    const teacherEarnings = await db.user.findMany({
      where: {
        role: "TEACHER",
      },
      select: {
        id: true,
        name: true,
        courses: {
          select: {
            id: true,
            title: true,
            price: true,
            chapaTransactions: {
              where: {
                status: "completed",
              },
              select: {
                amount: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // Transform teacher earnings data
    const detailedTeacherEarnings = teacherEarnings.map((teacher) => {
      const teacherTotalEarnings = teacher.courses.reduce((total, course) => {
        const courseEarnings = course.chapaTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        return total + courseEarnings;
      }, 0);

      return {
        userId: teacher.id,
        name: teacher.name,
        earnings: teacherTotalEarnings,
        platformFee: teacherTotalEarnings * 0.2,
        teacherPayout: teacherTotalEarnings * 0.8,
        courses: teacher.courses.map((course) => ({
          id: course.id,
          title: course.title,
          earnings: course.chapaTransactions.reduce((sum, tx) => sum + tx.amount, 0),
          platformFee: course.chapaTransactions.reduce((sum, tx) => sum + tx.amount, 0) * 0.2,
          teacherPayout: course.chapaTransactions.reduce((sum, tx) => sum + tx.amount, 0) * 0.8,
        })),
      };
    });

    // Get revenue per course with course titles
    const revenuePerCourse = await db.chapaTransaction.groupBy({
      by: ["courseId"],
      _sum: {
        amount: true,
      },
      where: {
        status: "completed",
      },
    });

    // Get course titles for the revenue data
    const courseIds = revenuePerCourse.map((item) => item.courseId);
    const courses = await db.course.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    // Combine revenue data with course titles
    const revenuePerCourseWithTitles = revenuePerCourse.map((item) => {
      const course = courses.find((c) => c.id === item.courseId);
      return {
        courseId: item.courseId,
        courseTitle: course?.title || "Unknown Course",
        revenue: item._sum.amount,
      };
    });

    return NextResponse.json({
      platform: {
        activeStudents,
        activeTeachers,
        totalComments: recentComments.length,
        courseTrend: courseTrend.map((item) => ({
          date: item.createdAt.toISOString().split("T")[0],
          courses: item._count,
        })),
        signupTrend: signupTrend.map((item) => ({
          date: item.createdAt.toISOString().split("T")[0],
          users: item._count,
        })),
        topCourses: topCourses.map((course) => ({
          id: course.id,
          title: course.title,
          students: course.students.length,
          comments: course.comments.length,
        })),
        recentComments: recentComments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          userName: comment.user.name,
          userImage: comment.user.image,
          courseTitle: comment.course.title,
          createdAt: comment.createdAt,
        })),
      },
      payments: {
        totalRevenue,
        platformRevenue,
        teacherPayouts,
        totalRefunds: 0, // Implement refund tracking if needed
        revenuePerCourse: revenuePerCourseWithTitles,
        teacherEarnings: detailedTeacherEarnings,
        paymentHistory: payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          courseTitle: payment.course.title,
          courseId: payment.course.id,
          userName: payment.user.name,
          userId: payment.user.id,
          createdAt: payment.createdAt,
        })),
        refunds: [], // Implement refund tracking if needed
      },
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
