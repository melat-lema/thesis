// "use client";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InfoCard } from "@/app/students-dashboard/(root)/_components/info-card";
import { BarChart, List, Users, MessageCircle, CalendarDays } from "lucide-react";
import { DataTable } from "./teacher/courses/_components/data-table";
import { columns } from "./teacher/courses/_components/columns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CoursesList } from "@/components/courses-list";
// import EarningsBarChart from "@/components/earnings-bar-chart";
import Link from "next/link";
import { UserIcon, PlusCircle, Layout } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { DollarSign, CreditCard, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import EarningsBarChart from "@/components/earnings-bar-chart";

const COMMENTS_PER_PAGE = 10;

async function getTeacherDashboardData(userId, page = 1) {
  // Get teacher user
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  // Courses
  const courses = await db.course.findMany({
    where: { teacherId: user.id },
    include: {
      students: true,
      comments: true,
      purchases: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Stats
  const totalCourses = courses.length;
  const totalEarnings = courses.reduce((sum, course) => {
    return sum + course.purchases.reduce((cSum, p) => cSum + (course.price || 0), 0);
  }, 0);
  const totalEnrolled = new Set(courses.flatMap((c) => c.purchases.map((p) => p.userId))).size;
  const totalComments = courses.reduce((sum, course) => sum + course.comments.length, 0);

  // Comments (latest, paginated)
  const allCourseIds = courses.map((c) => c.id);
  const comments = await db.comment.findMany({
    where: { courseId: { in: allCourseIds } },
    include: {
      user: { select: { name: true, image: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * COMMENTS_PER_PAGE,
    take: COMMENTS_PER_PAGE,
  });
  const commentsCount = await db.comment.count({ where: { courseId: { in: allCourseIds } } });

  // Courses for grid
  const coursesGrid = courses.map((course) => ({
    id: course.id,
    title: course.title,
    imageUrl: course.imageUrl,
    chaptersLength: course.chapters?.length ?? 0,
    price: course.price,
    progress: null, // No progress for teacher's own courses
    category: course.category?.name || "",
  }));

  // Earnings per course for chart
  const earningsPerCourse = courses.map((course) => ({
    title: course.title.length > 16 ? course.title.slice(0, 16) + "..." : course.title,
    earnings: course.purchases.reduce((sum, p) => sum + (course.price || 0), 0),
  }));

  return {
    totalCourses,
    totalEarnings,
    totalEnrolled,
    totalComments,
    coursesGrid,
    comments,
    commentsCount,
    earningsPerCourse,
    unpublishedCourses: courses.filter((c) => !c.isPublished),
    user,
  };
}

export default async function Dashboard({ searchParams }) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  // Pagination for comments
  const page = Number(searchParams?.commentsPage) || 1;
  const data = await getTeacherDashboardData(userId, page);
  if (!data) return redirect("/");

  const {
    totalCourses,
    totalEarnings,
    totalEnrolled,
    totalComments,
    coursesGrid,
    comments,
    commentsCount,
    earningsPerCourse,
    unpublishedCourses,
    user,
  } = data;
  const totalPages = Math.ceil(commentsCount / COMMENTS_PER_PAGE);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-4">
        {/* <Link
          href="/dashboard/(routes)/admin-dashboard"
          className="text-blue-600 underline font-semibold"
        >
          Go to Admin Dashboard
        </Link> */}
      </div>
      {/* {unpublishedCourses.length > 0 && ( */}
      <div className="md:col-span-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow p-4 flex items-center gap-3 mt-2">
        <span className="text-yellow-700 font-semibold">Attention:</span>
        <span className="text-yellow-700">
          You have {unpublishedCourses.length} unpublished course(s).{" "}
          <Link href="/dashboard/teacher/courses" className="underline">
            Review now
          </Link>
        </span>
      </div>
      {/* )} */}
      <div className="flex items-center justify-between mb-5 mt-5">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 border rounded-md px-4 py-2 text-sm text-muted-foreground bg-white dark:bg-background"
              )}
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Jan 20, 2023 - May 26, 2025</span>
            </div>

            <Button className="bg-black text-white hover:bg-zinc-800">Download</Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="overview" className="w-full mx-2 my-6">
        <TabsList className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">{/* Overview content here */}</TabsContent>
        <TabsContent value="analytics">{/* Analytics content here */}</TabsContent>
        <TabsContent value="reports">{/* Reports content here */}</TabsContent>
        <TabsContent value="notifications">{/* Notifications content here */}</TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-6 mb-5">
        <DashboardStatCard
          label="Total Revenue"
          value={`ETB ${totalEarnings.toLocaleString()}`}
          subLabel="+20.1% from last month"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Subscriptions"
          value={totalEnrolled}
          subLabel="+180.1% from last month"
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Courses"
          // total course - unpublished course
          value={totalCourses - unpublishedCourses.length}
          subLabel="+19% from last month"
          icon={<CreditCard className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Comments"
          value={`${totalComments} +`}
          subLabel="+201 since last hour"
          icon={<MessageCircle className="w-6 h-6" />}
        />
      </div>

      {/* Main Content: Chart + Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="col-span-2">
          <EarningsBarChart data={earningsPerCourse} />
        </div>
        {/* Recent Comments */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Recent Comments</h3>
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {comments.slice(0, 8).map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 border-b pb-2 last:border-b-0"
              >
                <img
                  src={comment.user.image || "/startup.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <div>
                  <div className="font-medium text-gray-800 text-sm">{comment.user.name}</div>
                  <div className="text-xs text-gray-500">{comment.course.title}</div>
                  <div className="text-gray-700 text-sm line-clamp-2">{comment.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-gray-500 text-sm">No comments found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <CoursesList items={coursesGrid} />
      </div>
    </div>
  );
}
