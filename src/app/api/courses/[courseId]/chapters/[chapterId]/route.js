import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const mux = require('@/lib/mux');


export async function DELETE(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
      include: { muxData: true }
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    if (chapter.videoUrl && chapter.muxData) {
      try {
        await mux.video.assets.delete(chapter.muxData.assetId); // Fixed variable name
        await db.muxData.delete({ where: { id: chapter.muxData.id } });
      } catch (muxError) {
        console.error("Mux deletion error:", muxError);
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId },
    });

    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (publishedChapters.length === 0) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check for existing Mux data
    const existingMuxData = await db.muxData.findFirst({
      where: { chapterId: chapterId }
    });

    // Clean up existing Mux data if it exists
    if (existingMuxData) {
      try {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({ 
          where: { id: existingMuxData.id } 
        });
      } catch (muxError) {
        console.error("Mux cleanup error:", muxError);
      }
    }

    // Update chapter with new values
    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { ...values },
    });

    // Process video if URL was provided
    if (values.videoUrl) {
      try {
        console.log('Creating Mux asset for:', values.videoUrl);
        
        const asset = await mux.video.assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });

        if (!asset?.playback_ids?.[0]?.id) {
          throw new Error('Mux asset creation failed - no playback ID');
        }

        const muxData = await db.muxData.create({
          data: {
            chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids[0].id,
          }
        });

        return NextResponse.json({ 
          chapter, 
          muxData,
          message: "Video updated successfully" 
        });

      } catch (muxError) {
        console.error("[MUX_ASSET_CREATION_ERROR]", muxError);
        // Continue with response even if Mux failed
        return NextResponse.json({ 
          chapter,
          error: "Video uploaded but Mux processing failed",
          muxError: muxError.message 
        }, { status: 207 }); // 207 = Multi-Status
      }
    }

    return NextResponse.json({ chapter });

  } catch (error) {
    console.error("[CHAPTER_VIDEO_UPDATE]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}