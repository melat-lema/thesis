"use client";

import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, DollarSign, Users, CreditCard } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import EarningsBarChart from "@/components/earnings-bar-chart";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
export default function AdminDashboard() {
  // get role from clerk
  const { user } = useUser();
  const role = user?.publicMetadata;
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState({});
  const [chartMode, setChartMode] = useState("teacher"); // 'teacher' or 'course'

  // if (role !== "admin") {
  //   toast.error("You are not authorized to access this page");
  //   redirect("/");
  // }

  console.log(role);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teachersRes, studentsRes, analyticsRes] = await Promise.all([
          fetch("/api/admin-dashboard-teachers"),
          fetch("/api/admin-dashboard-students"),
          fetch("/api/admin-dashboard-analytics"),
        ]);
        if (!teachersRes.ok || !studentsRes.ok || !analyticsRes.ok) {
          throw new Error("Failed to fetch data");
        }
        const [teachersData, studentsData, analyticsData] = await Promise.all([
          teachersRes.json(),
          studentsRes.json(),
          analyticsRes.json(),
        ]);
        setTeachers(teachersData);
        setStudents(studentsData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToggleVerify = async (teacherId, current) => {
    setVerifying((v) => ({ ...v, [teacherId]: true }));
    try {
      const res = await fetch("/api/admin-dashboard-teachers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, isVerified: !current }),
      });
      if (!res.ok) throw new Error("Failed to update verification");
      const data = await res.json();
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, isVerified: data.isVerified } : t))
      );
    } catch (err) {
      alert(err.message || "Failed to update verification");
    } finally {
      setVerifying((v) => ({ ...v, [teacherId]: false }));
    }
  };

  // Aggregate all courses for the course chart, with unique key per course (title + teacher)
  const courseEarningsData = useMemo(() => {
    if (!analytics?.earningsPerTeacher) return [];
    return analytics.earningsPerTeacher.flatMap((teacher) =>
      teacher.courses.map((course) => ({
        // Combine title and teacher for uniqueness
        title: `${course.title} (${teacher.name})`,
        earnings: course.earnings,
      }))
    );
  }, [analytics]);

  // Chart data and title based on toggle
  const chartData =
    chartMode === "teacher" ? analytics?.earningsPerTeacher || [] : courseEarningsData;
  const chartTitle = chartMode === "teacher" ? "Earnings per Teacher" : "Earnings per Course";

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      {/* Stat Cards */}
      <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-6 mb-8">
        <DashboardStatCard
          label="Total Revenue"
          value={`ETB ${analytics?.totalIncome?.toLocaleString() ?? "-"}`}
          subLabel="All time revenue"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Teachers"
          value={analytics?.totalTeachers ?? "-"}
          subLabel="All time"
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Courses"
          value={analytics?.totalCourses ?? "-"}
          subLabel="All time"
          icon={<CreditCard className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Students"
          value={analytics?.totalStudents ?? "-"}
          subLabel="All time"
          icon={<Users className="w-6 h-6" />}
        />
      </div>
      {/* Earnings Chart with Toggle */}
      <div className="mb-10 bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded font-semibold border ${
              chartMode === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600"
            }`}
            onClick={() => setChartMode("teacher")}
          >
            Earnings per Teacher
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold border ${
              chartMode === "course"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600"
            }`}
            onClick={() => setChartMode("course")}
          >
            Earnings per Course
          </button>
        </div>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <EarningsBarChart data={chartData} title={chartTitle} />
        )}
      </div>
      {/* Tabs for Teachers/Students */}
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Total Courses</TableHead>
                  <TableHead>Total Income</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={teacher.image || "/startup.png"} alt={teacher.name} />
                        <AvatarFallback>{teacher.name?.[0] || "T"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={teacher.isVerified ? "success" : "outline"}
                        disabled={verifying[teacher.id]}
                        onClick={() => handleToggleVerify(teacher.id, teacher.isVerified)}
                      >
                        {teacher.isVerified ? "Verified" : "Unverified"}
                      </Button>
                    </TableCell>
                    <TableCell>{teacher.totalCourses}</TableCell>
                    <TableCell>ETB {teacher.totalIncome?.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400">
                      No teachers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="students">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Total Courses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={student.image || "/startup.png"} alt={student.name} />
                        <AvatarFallback>{student.name?.[0] || "S"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{student.totalCourses}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
