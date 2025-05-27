import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";

function CourseIntroCard({ course }) {
  return (
    <div className="flex gap-5 items-start p-10 border shadow-md rounded-lg flex-col">
      <Image
        src={"/knowledge.png"}
        alt="knowledge"
        width={70}
        height={70}
        className="rounded-full"
      />
      <div>
        <h2 className="font-bold text-2xl"> {course?.courseLayout.course_name}</h2>
        <p> {course?.courseLayout.course_summary}</p>
        <Progress className="mt-3" />
        <h2 className="mt-3 text-sm text-black">
          {" "}
          Number of Chapters: {course?.courseLayout?.chapters?.length}
        </h2>
      </div>
    </div>
  );
}

export default CourseIntroCard;
