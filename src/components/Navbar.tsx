"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiMessageSquare } from "react-icons/fi";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar completely on all dashboard pages (handled by sidebar)
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-lg border-b border-white/10 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          {!pathname?.startsWith("/dashboard") && (
            <>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                Jenny<span className="text-pink-500">.AI</span>
              </span>
            </>
          )}
        </Link>


        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FiUser size={14} /></div>
                )}
                <span className="text-sm text-white font-medium">{session.user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white "
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 text-lg text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiMessageSquare /> Explore
              </Link>
              {session && (
                <Link 
                  href="/dashboard/my-chats" 
                  className="flex items-center gap-3 text-lg text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiMessageSquare /> My Chats
                </Link>
              )}
              <hr className="border-white/10" />
              {session ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 rounded-xl bg-red-600/20 text-red-400 font-bold border border-red-600/30"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    signIn("google");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
