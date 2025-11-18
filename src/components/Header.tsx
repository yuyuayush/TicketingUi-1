"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Ticket, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuth";
import { removeToken } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, currentUser, resetAuth } = useAuthStore();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = async () => {
    try {
      resetAuth();
      removeToken();
      toast({
        title: "Successfully logout"
      })
    }
    catch (e) {
      toast({
        title: "Having issue in logout"
      })
    }

  };

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={45}
              height={45}
              className="rounded-md"
            />
            <p className="text-2xl font-extrabold uppercase bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent tracking-wide">
              Ticketing
            </p>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Sell Tickets */}
          <Link href="/seller">
            <button className="hidden lg:inline-flex items-center gap-1 bg-gradient-to-r from-pink-600 to-red-500 text-white px-4 py-2 text-sm rounded-lg font-medium hover:opacity-90 transition">
              <Ticket size={16} /> Sell Tickets
            </button>
          </Link>

          {/* My Tickets */}
          <Link
            href="/tickets"
            className="hidden lg:inline-flex items-center gap-1 text-gray-700 hover:text-pink-600 font-medium transition"
          >
            <Ticket size={16} /> My Tickets
          </Link>

          {/* Profile / Sign In */}
          {currentUser ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-red-500 text-white font-semibold uppercase hover:opacity-90 transition"
              >
                {currentUser?.name?.charAt(0) ?? <User size={20} />}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-fadeIn">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold uppercase">
                      {currentUser?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-2">
                    {/* <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block text-sm text-gray-700 hover:text-pink-600 transition"
                    >
                      View Profile
                    </Link> */}

                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 bg-gradient-to-r from-pink-600 to-red-500 text-white text-sm py-2 rounded-lg hover:opacity-90 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="rounded-full bg-pink-600 px-5 py-2 text-white font-medium hover:bg-pink-700 transition">
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700 hover:text-pink-600 transition"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t animate-slideDown">
          <nav className="flex flex-col p-4 space-y-3 text-gray-700">
            <Link href="/tickets" className="hover:text-pink-600 flex items-center gap-1">
              <Ticket size={16} /> My Tickets
            </Link>
            <Link href="/seller" className="hover:text-pink-600 flex items-center gap-1">
              <Ticket size={16} /> Sell Tickets
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
