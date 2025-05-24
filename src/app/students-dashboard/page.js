import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "../../../actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./(root)/_components/info-card";
import GeneratedCourseLists from "./(root)/_components/generatedCourseLists";

export default async function StudentsDashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

  console.log(completedCourses, coursesInProgress, "completedCourses, coursesInProgress");

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={Clock} label="In Progress" numberofItems={coursesInProgress.length} />
          <InfoCard
            icon={CheckCircle}
            label="Complete"
            numberofItems={completedCourses.length}
            variant="success"
          />
        </div>
        <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      </div>
      <div>
        <GeneratedCourseLists />
      </div>
    </>
  );
}
