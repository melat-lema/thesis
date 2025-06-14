"use client";

import { useEffect } from "react";
import { Navbar } from "../dashboard/_components/navbar";
import Image from "next/image";
import { SidebarRoutes } from "../dashboard/_components/sidebar-routes";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// import { Sidebar } from "../dashboard/_components/sidebar";
// import { Navbar } from "./_components/navbar";
const AdminDashboardLayout = ({ children }) => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (role !== "admin") {
      toast.error("You are not authorized to access this page");
      redirect("/");
    }
  }, [role]);

  useEffect(() => {
    fetch("/api/auth/status").then((res) => res.json());
  }, []);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 ">
        <div className="h-full border-r flex-col overflow-y-auto bg-white shadow-sm">
          <div className="p-6">
            <Image height={130} width={130} alt="logo" src="/logo.svg" />
          </div>
          <div className="flex flex-col w-full">
            <SidebarRoutes />
          </div>
        </div>
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default AdminDashboardLayout;
