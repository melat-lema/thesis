"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

export const CommentForm = ({ courseId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log("Submitting comment:", content);
      const response = await axios.post(`/api/courses/${courseId}/comments`, {
        content,
      });

      setContent("");
      toast.success("Comment added successfully");
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        disabled={isSubmitting}
        className="w-full resize-none"
      />
      <Button type="submit" disabled={!content.trim() || isSubmitting} className="ml-auto">
        Submit
      </Button>
    </form>
  );
};
