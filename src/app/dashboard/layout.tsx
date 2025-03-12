"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState("explore");
  const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/dashboard/">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "explore" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("explore")}
            >
              🔍 Explore Characters
            </span>
          </Link>
          <Link href="/dashboard/create-character">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "create" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("create")}
            >
              ✨ Create Character
            </span>
          </Link>
          <Link href="/dashboard/my-chats">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "chats" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("chats")}
            >
              💬 My Chats
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
