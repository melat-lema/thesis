import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req, {params}) {
    try {
        const {userId}= await auth()
        const {courseId, chapterId} =await params

        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
          const courseOwner = await db.course.findUnique({
            where: {
              id: courseId,
              userId: userId,
            },
          });
      if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
          const chapter= await db.chapter.findUnique({
            where: {
              id: courseId,
                courseId: courseId,
                
            },
            
        });
        const muxData= await db.muxData.findUnique({
            where: {
                chapterId: chapterId,
            }
        })

        
          const publishedChapter= await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
                
            },
            data:{
                isPublished: true,
            }
           });
           
       return NextResponse.json(publishedChapter)

    } catch (error) {
         console.log("[CHAPTER_PUBLISH", error)
         return new NextResponse("Internal error", {status: 500})
                    
    }
}