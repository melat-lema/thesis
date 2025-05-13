"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().min(1), // lowercase 'url' to match what you're sending
});

export const AttachmentForm = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeletingId] = useState(null);
  const [attachments, setAttachments] = useState(initialData.attachments); // <-- local state
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
      setAttachments((prev) => [...prev, response.data]); // update local state
      toast.success("Attachment added");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      setAttachments((prev) => prev.filter((a) => a.id !== id)); // remove from state
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? <>Cancel</> : <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add a file
          </>}
        </Button>
      </div>

      {!isEditing && (
        <>
          {attachments.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic">No attachment yet</p>
          ) : (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deleteId === attachment.id ? (
                    <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                  ) : (
                    <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
