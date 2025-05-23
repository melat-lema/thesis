import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRETE);

export async function DELETE(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First get the user from our database
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assdetId) {
        await Video.Assets.del(chapter.muxData.asssetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_CHAPTER_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();
    console.log("Received course update request:", { courseId, values });

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First get the user from our database
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (values.categoryId) {
      const categoryExists = await db.category.findUnique({
        where: { id: values.categoryId },
      });

      if (!categoryExists) {
        return new NextResponse("Invalid category ID", { status: 400 });
      }
    }

    // Convert price to float if it exists
    if (values.price !== undefined) {
      values.price = parseFloat(values.price);
    }

    // If this is an image update, log it
    if (values.imageUrl) {
      console.log("Updating course image:", { courseId, imageUrl: values.imageUrl });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      data: {
        ...values,
      },
    });

    console.log("Course updated successfully:", course);
    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID] Error updating course:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
