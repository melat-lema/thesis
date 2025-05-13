"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRoleSelection = (event) => {
    setRole(event.target.value);
    setError("");
  };

  const handleCreateAccount = () => {
    if (role === "student" || role === "teacher") {
      router.push(`/sign-up?role=${role}`); // Pass role in URL query
    } else {
      setError("Please select an option!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          Join as a Student or Teacher
        </h1>

        {/* Role Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 mb-8">
          {/* Student Option */}
          <label
            className={`flex flex-col items-center cursor-pointer p-4 border-2 rounded-lg transition-colors duration-300 ${
              role === "student" ? "border-blue-500" : "border-transparent"
            } hover:border-blue-500`}
          >
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={handleRoleSelection}
              className="mb-2"
            />
            <img src="/startup.png" alt="Student Icon" className="w-16 h-16 mb-2" />
            <p className="text-lg text-center">I'm a student, looking for courses to learn.</p>
          </label>

          {/* Teacher Option */}
          <label
            className={`flex flex-col items-center cursor-pointer p-4 border-2 rounded-lg transition-colors duration-300 ${
              role === "teacher" ? "border-blue-500" : "border-transparent"
            } hover:border-blue-500`}
          >
            <input
              type="radio"
              value="teacher"
              checked={role === "teacher"}
              onChange={handleRoleSelection}
              className="mb-2"
            />
            <img src="/investor.png" alt="Teacher Icon" className="w-16 h-16 mb-2" />
            <p className="text-lg text-center">I'm a teacher, looking to teach students.</p>
          </label>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Create Account Button */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-8 rounded-md text-lg cursor-pointer hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;