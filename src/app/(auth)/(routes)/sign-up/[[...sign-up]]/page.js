"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          },
        }}
        afterSignUpUrl={`/after-sign-up?role=${role}`}
      />
    </div>
  );
}
