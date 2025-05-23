"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      console.log("Updating course image with values:", values);
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      console.log("Course update response:", response.data);
      toast.success("Course image updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating course image:", error);
      toast.error(error.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={toggleEdit} disabled={isLoading}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <img
              alt="Upload"
              className="object-cover rounded-md w-full"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div className="max-w-xs">
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              console.log("File upload completed, URL:", url);
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              toast.error("Failed to upload image");
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">16:9 aspect ratio recommended</div>
        </div>
      )}
    </div>
  );
};
