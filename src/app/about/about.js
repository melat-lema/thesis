"use client"
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

export default function About() {
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

        {/* Nav */}
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

          <Link href="/login">
            <div className="text-black hover:text-[#fb873f] cursor-pointer">
              <i className="fa fa-user"></i>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
