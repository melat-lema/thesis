
"use client"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react";
import CourseCardItem from "./courseCardItem";

export default function GeneratedCourseLists(){

    const {user}=useUser();
    const [courseList, setCourseList]=useState([])
    useEffect(()=>{
        user &&GetCourseList();
    }, [user])

    const GetCourseList=async()=>{
        const result= await axios.post("/api/course-outline",
            {createdBy:user?.primaryEmailAddress?.emailAddress}
        )
        console.log(result)
        setCourseList(result.data.result)
    }
    return(
        <div>
            <h2 className="font-bold text-2xl">Your AI generated course List</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2 gap--5">
                {courseList?.map((course,index)=>(
                    <CourseCardItem course={course} key={index}/>
                    
                ))}
            </div>
        </div>
    )
}