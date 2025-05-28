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

    // Get payment analytics
    const payments = await db.chapaTransaction.findMany({
      where: {
        status: "completed",
      },
      include: {
        course: true,
        user: true,
      },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const platformRevenue = totalRevenue * 0.2; // 20% platform fee
    const teacherPayouts = totalRevenue * 0.8; // 80% teacher payout

    // Get revenue per course
    const revenuePerCourse = await db.chapaTransaction.groupBy({
      by: ["courseId"],
      _sum: {
        amount: true,
      },
      where: {
        status: "completed",
      },
    });

    // Get teacher earnings
    const teacherEarnings = await db.chapaTransaction.groupBy({
      by: ["userId"],
      _sum: {
        amount: true,
      },
      where: {
        status: "completed",
      },
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
        revenuePerCourse: revenuePerCourse.map((item) => ({
          courseId: item.courseId,
          revenue: item._sum.amount,
        })),
        teacherEarnings: teacherEarnings.map((item) => ({
          userId: item.userId,
          earnings: item._sum.amount,
        })),
        paymentHistory: payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          courseTitle: payment.course.title,
          userName: payment.user.name,
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
