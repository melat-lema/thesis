import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export const getDashboardCourses = async (userId) => {
  try {
    // You'll implement the logic here to fetch from the DB
    // Example:
    // const userCourses = await db.course.findMany(...)
    const purchasedCourses= await db.purchase.findMany({
        where:{
            userId: userId,
        },
        select:{
            course:{
                include:{
                    category: true,
                    chapters:{
                        where: {
                            ispublished: true,
                        }
                    }
                }
            }
        }
    })
    const courses= purchasedCourses.map((purchase)=>purchase.course)
    for(let course of courses){
        const progress= await getProgress(userId, course.id);
        course["progress"]=progress;
    }
    const completedCourses=courses.filter((course)=>course.progress==100)
    const coursesInProgress=courses.filter((course)=>(course.progress ?? 0)<100)
    return {


      completedCourses: [], // Replace with real data
      coursesInProgress: [] // Replace with real data
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: []
    };
  }
};
