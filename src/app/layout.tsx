import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/components/authComp/AuthProvider";
import Navbar from "@/components/authComp/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Companion Platform",
  description: "Professional AI Assistant Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="en"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-[100dvh] `}
      >
        <AuthProvider>
          <Navbar/> 
          <main>
          {children}
          </main>
        
        </AuthProvider>
      </body>
      
    </html>
    
  );
}
