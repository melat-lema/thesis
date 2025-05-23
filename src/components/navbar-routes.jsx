"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut, Search } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { Input } from "./ui/input";
import { useState } from "react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const [value, setValue] = useState("");
  // Determine the current page context
  const isTeacherPage = pathname?.startsWith("/dashboard");
  const isStudentPage = pathname?.includes("/courses");
  const isSearching = pathname === "/search";

  return (
    <>
      {/* Show search input only on the search page */}
      {/* {isSearching && ( */}
      <div className="hidden md:block w-full">
        {/* <SearchInput /> */}

        <div className="relative">
          <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
          <Input
            onChange={(e) => setValue(e.target.value)}
            value={value}
            className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-600"
            placeholder="search for a course"
          />
        </div>
      </div>
      {/* )} */}

      {/* Navigation buttons */}
      <div className="flex gap-x-2 ml-auto">
        {/* Exit Button */}
        {(isTeacherPage || isStudentPage) && (
          <Link href="/">
            <Button variant="secondary" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        )}

        {/* User Profile Dropdown */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
