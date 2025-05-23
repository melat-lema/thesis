import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

export const CourseNavbar = ({ course, progressCount }) => (
  <div className="p-4 border-b h-full flex items-center shadow-sm">
    {/* <CourseMobileSidebar course={course} progressCount={progressCount} /> */}
    <NavbarRoutes />
  </div>
);
