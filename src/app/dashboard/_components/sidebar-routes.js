"use client";

import { Compass, Layout, List, BarChart, PlusCircle } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter

// Define guest and teacher routes
const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/students-dashboard",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/students-dashboard/browse",
    },
];

const teacherRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        icon: List,
        label: "Courses",
        href: "/dashboard/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/dashboard/analytics",
    },
];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter(); // Initialize useRouter to programmatically navigate

    const isTeacherPage = pathname?.includes("/dashboard");
    const isGuestRoutes = pathname?.startsWith("/students-dashboard");

    // Use guestRoutes or teacherRoutes based on the current page
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {/* If in guest routes, display the 'Create New' button */}
            {isGuestRoutes && (
                <div className="flex items-center p-3">
                    <button
                        className="w-full text-left flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                        onClick={() => router.push("/students-dashboard/create")} // Use router.push to navigate
                    >
                        <PlusCircle className="text-gray-600" size={20} />
                        <span className="text-gray-600">Create New</span>
                    </button>
                </div>
            )}

            {/* Render the routes */}
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};
