"use client";

import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { CategoryItem } from "./category-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

// A map of category names to icons (just use plain object in JS)
const iconMap = {
  "Engineering": FcEngineering,
  "Filming": FcFilmReel,
  "Computer Science": FcMultipleDevices,
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Accounting": FcSalesPerformance,
  "Fitness": FcSportsMode,
};

export const Categories = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => {
        const isSelected = currentCategoryId === item.id;

        const onClick = () => {
          const url = qs.stringifyUrl({
            url: pathname,
            query: {
              title: currentTitle,
              categoryId: isSelected ? null : item.id,
            },
          }, {
            skipNull: true,
            skipEmptyString: true,
          });

          router.push(url);
        };

        return (
          <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
};

