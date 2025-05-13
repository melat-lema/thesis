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
    
        await prisma.course.update({
          where: { id: courseId },
          data: { isPublished: false },
        });
    
        return NextResponse.json({ message: "Course unpublished successfully" });
      } catch (error) {
        console.error("[COURSE_UNPUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    
    
}