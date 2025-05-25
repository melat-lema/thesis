"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "hooks/use-confetti-store";
import { Badge } from "@/components/ui/badge";

export const CourseProgressButton = ({ chapterId, courseId, isCompleted, nextChapterId }) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted,
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return isCompleted ? (
    <Badge variant="success" className="w-full md:w-auto flex items-center gap-2">
      <CheckCircle className="h-4 w-4" /> Completed
    </Badge>
  ) : (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant="success"
      className="w-full md:w-auto"
    >
      Mark as complete
      <CheckCircle className="h-4 w-4 ml-2" />
    </Button>
  );
};
