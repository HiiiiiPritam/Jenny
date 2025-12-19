"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, 
  FiX, 
  FiCompass, 
  FiPlusCircle, 
  FiMessageSquare, 
  FiInfo,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "Explore", href: "/dashboard", icon: <FiCompass size={20} />, active: pathname === "/dashboard" },
    { label: "Create Character", href: "/dashboard/create-character", icon: <FiPlusCircle size={20} />, active: pathname === "/dashboard/create-character" },
    { label: "My Chats", href: "/dashboard/my-chats", icon: <FiMessageSquare size={20} />, active: pathname.startsWith("/dashboard/my-chats") },
    { label: "About", href: "/dashboard/about", icon: <FiInfo size={20} />, active: pathname === "/dashboard/about" },
  ];

  return (
    <div className="flex h-screen md:h-[calc(100vh-4rem)] bg-[#050505] text-white overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full bg-[#0a0a0a] border-r border-white/5 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "w-20" : "w-72"} flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-tighter"
            >
              Dashboard
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
          
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-gray-400"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                  item.active 
                    ? "bg-gradient-to-r from-pink-600/20 to-purple-600/20 text-white border border-pink-500/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`${item.active ? "text-pink-500" : "group-hover:text-white"} transition-colors`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                )}
                {item.active && !isCollapsed && (
                  <motion.div 
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500"
                  />
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile & Sign Out */}
        {session && (
          <div className="p-4 mx-2 mt-auto mb-2 bg-white/5 rounded-xl border border-white/5">
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FiUser size={14} /></div>
              )}
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">Free Plan</p>
                </div>
              )}

              {!isCollapsed && (
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <FiLogOut size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5">
          <Link href="/">
            <div className={`flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer ${isCollapsed ? "justify-center" : ""}`}>
              <FiHome size={20} />
              {!isCollapsed && <span className="text-sm font-medium">Back to Home</span>}
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Header Toggle */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-2 left-2 z-[100] p-3 rounded-full bg-pink-600 text-white shadow-lg shadow-pink-600/20 border border-pink-500/50 cursor-pointer hover:bg-pink-700 active:scale-95 transition-all"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={20} />
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Glow effect for main content */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
