import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({ value, variant, size }) => (
  <div>
    <Progress className="h-2" value={value} variant={variant} />
    <p
      className={cn(
        "font-medium mt-2 text-sky-700",
        colorByVariant[variant || "default"],
        sizeByVariant[size || "default"]
      )}
    >
      {Math.round(value)}% Complete
    </p>
  </div>
);
