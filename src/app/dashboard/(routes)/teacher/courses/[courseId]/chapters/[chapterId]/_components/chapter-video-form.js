"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";

export const ChapterVideoForm = ({ initialData, courseId, chapterId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localPlaybackId, setLocalPlaybackId] = useState(null);
  const [localVideoUrl, setLocalVideoUrl] = useState(null);

  const playbackId = localPlaybackId || initialData?.muxData?.playbackId;
  const videoUrl = localVideoUrl || initialData?.videoUrl;

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      const { muxData, chapter } = response.data;

      if (muxData?.playbackId) setLocalPlaybackId(muxData.playbackId);
      if (chapter?.videoUrl) setLocalVideoUrl(chapter.videoUrl);

      toast.success("Video updated");
      toggleEdit();
      router.refresh();
      console.log("Passing chapterId:", chapterId);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (file) => {
    if (!file?.ufsUrl) {
      toast.error("Upload failed. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      
      // First update with the video URL
      await onSubmit({ videoUrl: file.ufsUrl });
      
      // Then trigger Mux processing
      const processingResponse = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/process-video`,
        { videoUrl: file.ufsUrl }
      );

      if (processingResponse.data.success) {
        setLocalPlaybackId(processingResponse.data.playbackId);
        toast.success("Video processing started!");
      } else {
        throw new Error(processingResponse.data.error || "Processing failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost" disabled={isLoading}>
          {isEditing ? (
            "Cancel"
          ) : playbackId ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Video
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        playbackId ? (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={playbackId} streamType="on-demand" controls />
          </div>
        ) : videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <VideoIcon className="h-10 w-10 text-slate-500 animate-pulse" />
                <p className="mt-2 text-sm">Processing video...</p>
              </div>
            ) : (
              <p className="text-center text-sm">
                Video uploaded. Waiting for processing...
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        
        <div>
   <FileUpload
  endpoint="chapterVideo"
  onChange={handleFileChange}
  // options={{
  //   metadata: { chapterId: chapterId } // Ensure chapterId is included
  // }}
  // disabled={isLoading}
/>




          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter's video (Max 512GB). Processing may take a few minutes.
          </div>
        </div>
      )}

      {playbackId && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video processing complete. Refresh if playback doesn't start.
        </div>
      )}
    </div>
  );
};