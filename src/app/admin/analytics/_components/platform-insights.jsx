"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { CourseTrendChart } from "./course-trend-chart";
import { SignupTrendChart } from "./signup-trend-chart";
import { TopCoursesTable } from "./top-courses-table";
import { CommentsList } from "./comments-list";

export function PlatformInsights({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Active Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStatCard
          label="Active Students"
          value={data.activeStudents}
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Active Teachers"
          value={data.activeTeachers}
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Total Comments"
          value={data.totalComments}
          icon={<MessageSquare className="w-6 h-6" />}
        />
      </div>

      {/* Course Creation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Course Creation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTrendChart data={data.courseTrend} />
        </CardContent>
      </Card>

      {/* Signups Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Signups Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupTrendChart data={data.signupTrend} />
        </CardContent>
      </Card>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <TopCoursesTable data={data.topCourses} />
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentsList data={data.recentComments} />
        </CardContent>
      </Card>
    </div>
  );
}
