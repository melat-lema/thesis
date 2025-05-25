"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Comment } from "./comment";
import { CommentForm } from "./comment-form";

export const CommentList = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("courseId", courseId);
  console.log("comments", comments);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/comments`);
        setComments(response.data);
        console.log("response.data", response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        toast.error("Failed to fetch comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [courseId]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  if (isLoading) {
    return <div className="text-center">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comments</h2>
      <CommentForm courseId={courseId} onCommentAdded={handleCommentAdded} />
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};
