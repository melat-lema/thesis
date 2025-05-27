"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { db } from "@/lib/db";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && CheckIsNewUser();
  }, [user]);

  const CheckIsNewUser = async () => {
    const existingUser = await db.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress,
      },
    });

    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
      });

      console.log(newUser);
    } else {
      console.log("User already exists:", existingUser);
    }
  };

  return <div>{children}</div>;
}

export default Provider;
