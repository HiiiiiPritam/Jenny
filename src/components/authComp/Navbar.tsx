"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession(); // Get user session

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      {/* Left: Logo */}
      <Link href="/" className="text-white text-lg font-bold">
        AI Girlfriend
      </Link>

      {/* Right: Authentication Section */}
      <div>
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
            <span className="text-white">{session.user?.name}</span>

            <Link href="/dashboard">dashboard</Link>

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
