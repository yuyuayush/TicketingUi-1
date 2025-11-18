"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Film, MapPin, Calendar, User } from "lucide-react";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: <Building size={18} /> },
  { name: "Cities", path: "/admin/city", icon: <MapPin size={18} /> },
  { name: "Theaters", path: "/admin/theater", icon: <Building size={18} /> },
  { name: "Shows", path: "/admin/show", icon: <Calendar size={18} /> },
  { name: "Concerts", path: "/admin/concert", icon: <Film size={18} /> },
  { name: "Users", path: "/admin/user", icon: <User size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Admin Panel</h2>

        <nav className="flex flex-col space-y-2">
          {adminLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
