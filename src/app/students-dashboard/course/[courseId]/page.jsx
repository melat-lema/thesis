"use client";

// import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseIntroCard from "./_components/courseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  useEffect(() => {
    GetCourse();
  }, []);
  const GetCourse = async () => {
    const result = await axios.get("/api/ai-courses?courseId=" + courseId);
    console.log(result);
    setCourse(result.data.result);
  };
  return (
    <div>
      <div className="">
        <CourseIntroCard course={course} />
        <StudyMaterialSection courseId={courseId} />
        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
