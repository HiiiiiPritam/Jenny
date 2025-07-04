"use client";


import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BackgroundEffect } from "../BackgroundComponent";

export default function Navbar() {
  const { data: session } = useSession(); // Get user session

  return (
    <nav className="bg-gray-900 h-16 p-4 flex justify-between items-center w-full">
      {/* Left: Logo */}
      <div className="md:hidden">

      </div>
      <Link href="/" className="text-white text-lg text-right font-bold">
        Jenny AI
      </Link>
      <BackgroundEffect/>

      {/* Right: Authentication Section */}
      <div className="relative z-10">
        {session ? (
          <div className="flex items-center gap-4">
            {/* User Avatar & Name */}
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            {/* 
            <Link href="/dashboard">dashboard</Link> */}

            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          // Sign In Button
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}
