"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Importing menu icons

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState("explore");
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle

  return (
    <div className="flex h-[calc(100dvh-4rem)]">
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden p-4 text-white bg-gray-900    fixed top-1 left-1 z-50 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 md:relative h-full bg-gray-900 text-white p-4 w-64 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 md:w-1/5`}
      >
        <div className="md:hidden h-10"></div>
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/dashboard/">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "explore" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActive("explore");
                setSidebarOpen(false);
              }}
            >
              🔍 Explore
            </span>
          </Link>
          <Link href="/dashboard/create-character">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "create" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActive("create");
                setSidebarOpen(false);
              }}
            >
              ✨ Create Character
            </span>
          </Link>
          <Link href="/dashboard/my-chats">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "chats" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActive("chats");
                setSidebarOpen(false);
              }}
            >
              💬 My Chats
            </span>
          </Link>
          {/* <Link href="/dashboard/video">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "video" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActive("video");
                setSidebarOpen(false);
              }}
            >
              📽️ video gen
            </span>
          </Link> */}
          <Link href="/dashboard/about">
            <span
              className={`cursor-pointer p-2 rounded ${
                active === "about" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActive("about");
                setSidebarOpen(false);
              }}
            >
             🧑🏻‍💻 About Us
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
