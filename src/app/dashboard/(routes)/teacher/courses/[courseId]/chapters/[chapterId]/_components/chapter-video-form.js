"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";

export const ChapterVideoForm = ({ initialData, courseId, chapterId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localVideoUrl, setLocalVideoUrl] = useState(null);

  const videoUrl = localVideoUrl || initialData?.videoUrl;

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      const { chapter } = response.data;
      if (chapter?.videoUrl) setLocalVideoUrl(chapter.videoUrl);
      toast.success("Video updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("error in chapter video form", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost" disabled={isLoading}>
          {isEditing ? (
            "Cancel"
          ) : videoUrl ? (
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
        videoUrl ? (
          <div className="relative aspect-video mt-2">
            <video controls className="w-full h-full" src={videoUrl} />
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
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter's video (Max 512GB). Processing may take a few minutes.
          </div>
        </div>
      )}
    </div>
  );
};
