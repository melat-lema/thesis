import { auth } from "@clerk/nextjs/server";

export async function DELETE(req, params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        clerkId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment); // ✅ Correct usage in JS
  } catch (error) {
    console.error("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
