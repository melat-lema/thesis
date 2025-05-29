"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export function SetupHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const role = searchParams.get("role") || "student";

  useEffect(() => {
    const registerUser = async () => {
      try {
        if (!user) {
          throw new Error("User not found");
        }

        if (!["student", "teacher"].includes(role.toLowerCase())) {
          throw new Error("Invalid role specified");
        }

        // Update Clerk role
        await axios.post("/api/auth/update-role", { role: role.toLowerCase() });

        // Register user in your database
        await axios.post("/api/auth/register", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          role: role.toUpperCase(),
        });

        // Redirect based on role
        const redirectPath =
          role.toLowerCase() === "teacher" ? "/dashboard" : "/students-dashboard";
        router.push(redirectPath);
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error("Failed to set up your account. Please try again.");
      }
    };

    if (user) {
      registerUser();
    }
  }, [user, role, router]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <div className="text-5xl font-bold my-6">Setting up your account...</div>
        <div className="text-2xl text-gray-500">Please wait while we set up your account...</div>
      </div>
    </div>
  );
}
