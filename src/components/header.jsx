"use client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function Header() {
  const [url, setUrl] = useState("/");
  const { isSignedIn, user } = useUser();
  const role = user?.publicMetadata?.role;

  console.log("role : ", role);

  useEffect(() => {
    if (role === "admin") {
      setUrl("/admin");
    } else if (role === "student") {
      setUrl("/student-dashboard");
    } else if (role === "teacher") {
      setUrl("/dashboard");
    }
  }, [role]);

  return (
    <nav className="bg-white shadow sticky top-0 p-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4 h-20">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center text-2xl font-extrabold cursor-pointer">
            <span className="text-black">
              Edu-<span className="text-[#fb873f]">Assist</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link href="/">
            <div className="text-black hover:text-[#fb873f] cursor-pointer">Home</div>
          </Link>
          <Link href="#about">
            <div className="text-black hover:text-[#fb873f] cursor-pointer">About</div>
          </Link>
          <Link href="/courses">
            <div className="text-black hover:text-[#fb873f] cursor-pointer">Courses</div>
          </Link>

          {/* Pages Dropdown */}
          <div className="relative group">
            <div className="flex items-center text-black hover:text-[#fb873f] cursor-pointer">
              Pages <FaChevronDown className="ml-1 text-sm" />
            </div>
            <div className="absolute hidden group-hover:block mt-2 bg-white shadow-lg rounded-md w-48 z-50 transition-all">
              <Link href="/team">
                <div className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                  Our Team
                </div>
              </Link>
              <Link href="/testimonial">
                <div className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                  Testimonial
                </div>
              </Link>
            </div>
          </div>

          <Link href="/contact">
            <div className="text-black hover:text-[#fb873f] cursor-pointer">Contact</div>
          </Link>

          {/* Conditional Rendering based on auth status */}
          {isSignedIn ? (
            <div className="flex items-center gap-x-2">
              <Link href="/chat">
                <Button variant="ghost" size="sm">
                  Chat
                </Button>
              </Link>
              <Link href={url}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/role">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
