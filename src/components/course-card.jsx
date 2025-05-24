import { BookOpen } from "lucide-react";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./course-progress";
import Image from "next/image";

export const CourseCard = ({ id, title, imageUrl, chaptersLength, price, progress, category }) => {
  console.log("Progress : ", progress);

  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100">
          <img className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength}
                {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress variant={progress === 100 ? "success" : "default"} value={progress} />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">{formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
