import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const {Video}= new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRETE,
)

export async function DELETE(req, {params}) {
    try {
        const {userId}= await auth()
        const {courseId}= await params 
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
          const course = await db.course.findUnique({
            where: {
              id: courseId,
              userId: userId,
            },
            include:{
              chapters: {
                include:{
                  muxData: true,
                }
              }
            }
          });
      if (!course) {
            return new NextResponse("Not found", { status: 404 });
          }
      for (const chapter of course.chapters){
        if(chapter.muxData?.assdetId){
          await Video.Assets.del(chapter.muxData.asssetId)
        }
      }
      const deletedCourse= await db.course.delete({
        where: {
          id: courseId,
        },
      });
        
           return NextResponse.json(deletedCourse)
    } catch (error) {
        console.log("[COURSE_CHAPTER_ID]", error)
                return new NextResponse("Internal error", {status: 500})
            
    }
}
export async function PATCH(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    const values = await req.json();
values.price = parseFloat(values.price);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (values.categoryId) {
      const categoryExists = await db.category.findUnique({
        where: { id: values.categoryId }
      });
      
      if (!categoryExists) {
        return new NextResponse("Invalid category ID", { status: 400 });
      }
    }

  const course= await db.course.update({
    where:{
        id: courseId,
        userId
    },
    data: {
        ...values,
    }
  });
  console.log("PATCH values received:", values); 
  return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
