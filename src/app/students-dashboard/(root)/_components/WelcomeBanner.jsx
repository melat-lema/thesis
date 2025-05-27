"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div className="p-6 py-10 bg-blue-600 text-white rounded-lg flex items-center gap-6 w-11/12 mx-auto my-6">
      {/* <Image src={"/book2.jpg"} alt="book" width={80} height={80} /> */}
      <div>
        <h2 className="font-bold text-3xl"> Hello, {user?.fullName}</h2>
        <p>
          {" "}
          Welcome back, It's a beautiful day to learn. Start a new course or continue your journey
          with an existing course!
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
