import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({ value, variant, size, chapters = [] }) => {
  const progress = Math.round(value);

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "font-medium text-sky-700",
              colorByVariant[variant || "default"],
              sizeByVariant[size || "default"]
            )}
          >
            Course Progress
          </p>
          <span className={cn("font-semibold", colorByVariant[variant || "default"])}>
            {progress}%
          </span>
        </div>
        <Progress
          className={cn("h-2", variant === "success" ? "bg-emerald-100" : "bg-sky-100")}
          value={value}
          variant={variant}
        />
      </div>

      {/* Chapter Progress */}
      {chapters.length > 0 && (
        <div className="space-y-3">
          <p
            className={cn(
              "font-medium text-sky-700",
              colorByVariant[variant || "default"],
              sizeByVariant[size || "default"]
            )}
          >
            Chapter Progress
          </p>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center gap-2">
                {chapter.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
                <span className="text-sm text-gray-600">{chapter.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
