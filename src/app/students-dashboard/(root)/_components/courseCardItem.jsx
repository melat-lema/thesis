import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideRefreshCw, RefreshCcw, RefreshCw, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CourseCardItem({ course }) {
  console.log("COURSES : ", course);

  return (
    <div className="border rounded-lg shadow-md p-5 ">
      <div>
        <div className="flex justify-between items-center mt-7">
          <Image src={"/other.png"} alt="other" width={100} height={100} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-blue-600 text-white">
            20th Dec 2025
          </h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">{course?.courseLayout.course_name}</h2>
        <p className="text-sm line-clamp-2 text-gray-500 mt-2">
          {" "}
          {course?.courseLayout.course_summary}
        </p>

        <div></div>
        <div className="mt-3">
          <Progress value={0} />
        </div>
        <div className="mt-3 flex justify-end">
          {course?.status == "Generating" ? (
            <h2 className="text-sm flex gap-2 item-center p-2 px-3 bg-blue-300 text-white">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Generating...
            </h2>
          ) : (
            <Link href={"/students-dashboard/course/" + course?.cId}>
              <Button className="cursor-pointer bg-blue-600">View</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
