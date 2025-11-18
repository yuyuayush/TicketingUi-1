"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/store/useAuth";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();
  const {currentUser,isAuthenticated}=useAuthStore();

  // Set active tab based on URL
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    pathname === "/register" ? "register" : "login"
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,_#FFFFFF_0%,_#8A50D899_60%)] p-4">
      {/* Modal Container */}
      <div className="relative z-20 w-full max-w-[80vw]  bg-white rounded-3xl shadow-2xl overflow-visible flex flex-col lg:flex-row">

        {/* Left Side - Image with Gradient */}
        <div className=" hidden lg:flex lg:w-1/2 relative">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/20" /> */}
          <img
            src="/auth/oval.png"
            alt="Learning Illustration"
            className="absolute object-cover  left-48 h-48 "
          />

          <img
            src="/auth/group.png"
            alt="Learning group"
            className="
    absolute object-contain 
    lg:w-[702.29px] lg:h-[393px] lg:bottom-32 lg:-left-24 
  "
          />
          <img
            src="/auth/half-circle.svg"
            alt="Learning group"
            className="
    absolute object-contain 
    lg:w-52 lg:h-52 lg:-bottom-[8%] lg:left-80 
  "
          />

          <div className="relative z-10 flex flex-col  items-center w-full h-full p-12 text-gray-900 text-center">
            <Link
              href="/"
              className="flex items-center gap-4 mb-8 hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src="/logo/logo.png"
                alt="AiQ Learning"
                className="h-20 w-auto object-contain drop-shadow-lg"
              />
            </Link>



          </div>
        </div>

        {/* Right Side - Dynamic Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src="/logo/logo.png"
                alt="AiQ Learning"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="relative flex mb-8 bg-gray-100 rounded-full p-1 shadow-inner w-fit mx-auto">
            {/* Sliding Circle / Background */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-1/2 bg-purple-600/70 rounded-full shadow-md transition-all duration-300 ease-in-out ${activeTab === "register" ? "translate-x-full" : "translate-x-0"
                }`}
            />

            {/* Buttons */}
            <button
              onClick={() => setActiveTab("login")}
              className={`relative z-10 w-32 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "login"
                ? "text-white"
                : "text-gray-600 opacity-80 hover:opacity-100"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`relative z-10 w-32 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "register"
                ? "text-white"
                : "text-gray-600 opacity-80 hover:opacity-100"
                }`}
            >
              Sign Up
            </button>
          </div>


          {/* Dynamic Form Content */}
          <div className="w-full max-w-md space-y-6">
            {activeTab === "login" ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 ">
                    Welcome Back!!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Please sign in to your student account
                  </p>
                </div>
                <LoginForm allowedRole="learner" />
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Are you an instructor?{" "}
                    <Link
                      href="/login/instructor"
                      className="font-semibold text-purple-600 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="font-semibold text-purple-600 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 ">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-lg">Join us to start learning</p>
                </div>
                <RegisterForm />
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="font-semibold text-purple-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                  <p className="text-sm text-gray-600">
                    Are you an instructor?{" "}
                    <Link
                      href="/login/instructor"
                      className="font-semibold text-purple-600 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
