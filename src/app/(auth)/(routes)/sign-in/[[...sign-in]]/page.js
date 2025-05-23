"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to continue your learning journey</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              footerActionLink: "text-blue-600 hover:text-blue-800",
            },
          }}
          routing="path"
          path="/sign-in"
          afterSignInUrl="/auth-redirect" // Let middleware handle the redirect
          signUpUrl="/sign-up" // Your automatic role-assignment sign-up
        />
      </div>
    </div>
  );
}
