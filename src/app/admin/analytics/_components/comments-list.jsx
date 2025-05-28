"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export function CommentsList({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No comments available</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.userImage} alt={comment.userName} />
            <AvatarFallback>
              {comment.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{comment.userName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Course: {comment.courseTitle}</p>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
