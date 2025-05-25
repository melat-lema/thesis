"use client";

import { Loader2, Lock } from "lucide-react";

export const VideoPlayer = ({ videoUrl, isLocked, title }) => {
  return (
    <div className="relative aspect-video">
      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      ) : videoUrl ? (
        <video controls className="w-full h-full" src={videoUrl} title={title} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <p className="text-sm text-white">No video available</p>
        </div>
      )}
    </div>
  );
};
