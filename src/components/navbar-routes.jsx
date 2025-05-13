"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  // Determine the current page context
  const isTeacherPage = pathname?.startsWith("/dashboard");
  const isStudentPage = pathname?.includes("/courses");
  const isSearching = pathname === "/search";

  return (
    <>
      {/* Show search input only on the search page */}
      {isSearching && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

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