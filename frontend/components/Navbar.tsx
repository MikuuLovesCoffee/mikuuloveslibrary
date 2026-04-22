"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 flex items-center justify-between">
            
            {/* LOGO */}
            <Link href="/" className="text-3xl font-bold text-black">
              BookSphere
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-12">
              <Link href="/" className="text-lg text-black hover:text-gray-600">
                Home
              </Link>
              <Link href="/upload" className="text-lg text-black hover:text-gray-600">
                Upload
              </Link>
              <Link href="/register" className="text-lg text-black hover:text-gray-600">
                Register
              </Link>
              <Link href="/login" className="text-lg bg-black text-white px-6 py-2 rounded">
                Login
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-3xl text-black"
            >
              ☰
            </button>
          </div>

          {/* MOBILE NAV */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-xl text-black hover:text-gray-600">
                  Home
                </Link>
                <Link href="/upload" className="text-xl text-black hover:text-gray-600">
                  Upload
                </Link>
                <Link href="/register" className="text-xl text-black hover:text-gray-600">
                  Register
                </Link>
                <Link href="/login" className="text-xl bg-black text-white px-6 py-3 rounded text-center">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}