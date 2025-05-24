// app/api/courses/[courseId]/chapters/[chapterId]/process-video/route.js
import { NextResponse } from "next/server";
import mux from "@/lib/mux";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    const { videoUrl } = await req.json();
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        teacherId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Process with Mux
    const asset = await mux.video.assets.create({
      input: videoUrl,
      playback_policy: "public",
      test: false,
    });

    if (!asset?.playback_ids?.[0]?.id) {
      throw new Error("Mux processing failed - no playback ID");
    }

    // Update database
    await db.muxData.upsert({
      where: { chapterId },
      create: {
        chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids[0].id,
      },
      update: {
        assetId: asset.id,
        playbackId: asset.playback_ids[0].id,
      },
    });

    return NextResponse.json({
      success: true,
      playbackId: asset.playback_ids[0].id,
    });
  } catch (error) {
    console.error("[VIDEO_PROCESSING_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function unauthorizedResponse() {
  return new NextResponse("Unauthorized", { status: 401 });
}
