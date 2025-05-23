import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import mux from "@/lib/mux";
import { db } from "@/lib/db";
// Assuming you've set up Mux as described

const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      // Get the user from our database
      const user = await db.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      if (!user) throw new UploadThingError("User not found");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { url: file.url };
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Uploaded attachment:", file.url);
    }),

  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })

    .onUploadComplete(async ({ file }) => {
      try {
        if (!mux?.video?.assets?.create) {
          throw new Error("Mux client not properly initialized");
        }

        const asset = await mux.video.assets.create({
          input: file.ufsUrl, // ufsUrl is correct
          playback_policy: "public",
          test: false,
        });

        if (!asset?.playback_ids?.[0]?.id) {
          throw new Error("Mux processing failed - no playback ID");
        }

        // await db.chapter.update({

        //   data: {
        //     videoUrl: file.ufsUrl,
        //     muxData: {
        //       upsert: {
        //         create: {
        //           assetId: asset.id,
        //           playbackId: asset.playback_ids[0].id,
        //         },
        //         update: {
        //           assetId: asset.id,
        //           playbackId: asset.playback_ids[0].id,
        //         },
        //       },
        //     },
        //   },
        // });

        return {
          success: true,
          assetId: asset.id,
          playbackId: asset.playback_ids[0].id,
        };
      } catch (error) {
        console.error("Video processing error:", error);
        return {
          success: false,
          error: error.message,
          videoUrl: file.ufsUrl,
        };
      }
    }),
};
