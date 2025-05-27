"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseCardItem from "./CourseCardItem";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function GeneratedCourseList() {
  const { user } = useUser();
  const [CourseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetCourseList = async () => {
    setLoading(true);
    const result = await axios.post("/api/course-outline", {
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    setCourseList(result.data.result);
    setLoading(false);
  };

  useEffect(() => {
    if (user) GetCourseList();
  }, [user]);

  return (
    <div className="mt-10 w-11/12 mx-auto">
      <h2 className="font-bold text-2xl flex justify-between items-center ">
        {" "}
        Your Study Material
        <Button variant="outline" onClick={GetCourseList} className="border-black">
          <RefreshCw />
          Refresh
        </Button>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"></div>
            ))
          : CourseList?.map((course, index) => <CourseCardItem course={course} key={index} />)}
      </div>
    </div>
  );
}

export default GeneratedCourseList;
