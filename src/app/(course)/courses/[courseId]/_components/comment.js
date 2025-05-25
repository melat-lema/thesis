"use client";

import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Comment = ({ comment }) => {
  const { user } = useUser();
  const isAuthor = user?.id === comment.userId;

  return (
    <div className="bg-slate-100 rounded-lg p-4 my-2">
      <div className="flex items-start justify-between">
        <div>
          {/* add shadcn avatar */}
          <div className="flex items-center gap-x-2">
            <Avatar>
              <AvatarImage src={comment.user.image} />
              <AvatarFallback className="bg-slate-400">
                {" "}
                {comment.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm font-semibold">{comment.user.name}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 p-4 my-2 text-sm text-gray-700">{comment.content}</p>
    </div>
  );
};
