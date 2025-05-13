import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req, {params}){
    try {
      
          const { userId } = await auth();
          const {courseId}= await params
         
      
          if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
      
          // Optional: Add validation logic here (e.g. all chapters have videos/quizzes)
      
          await prisma.course.update({
            where: { id: courseId },
            data: { isPublished: true },
          });
      
          return NextResponse.json({ message: "Course published successfully" });
        } catch (error) {
          console.error("[COURSE_PUBLISH]", error);
          return new NextResponse("Internal Server Error", { status: 500 });
        }
      }