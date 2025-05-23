"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import queryString from "query-string";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringify(
      {
        categoryId: currentCategoryId,
        title: debouncedValue,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(`${pathname}?${url}`);
  }, [debouncedValue, currentCategoryId, router, pathname]);
  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="search for a course"
      />
    </div>
  );
};
