"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Menu, 
  X, 
  Home, 
  Upload, 
  UserPlus, 
  LogIn,
  Search
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/register", label: "Register", icon: UserPlus },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(212, 165, 116, 0.2)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5" style={{ color: "#d4a574" }} />
              </motion.div>
              <span className="text-xl font-bold hidden sm:block" style={{ color: "#fafaf9" }}>
                BookSphere
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg group"
                  >
                    <span 
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: isActive ? "#d4a574" : "#a8a8a8" }}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ backgroundColor: "rgba(212, 165, 116, 0.1)" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center transition-colors"
                style={{ color: "#a8a8a8" }}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Login Button - Desktop */}
              <Link href="/login" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-glow"
                  style={{ backgroundColor: "#d4a574", color: "#0a0a0f" }}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
                style={{ color: "#fafaf9" }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden glass"
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                        style={{ 
                          backgroundColor: isActive ? "rgba(212, 165, 116, 0.1)" : "transparent",
                          color: isActive ? "#d4a574" : "#a8a8a8"
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Login Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link href="/login">
                    <button 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl font-semibold transition-colors"
                      style={{ backgroundColor: "#d4a574", color: "#0a0a0f" }}
                    >
                      <LogIn className="w-5 h-5" />
                      Login
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(10, 10, 15, 0.8)" }}
            />
            
            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl glass rounded-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4">
                <Search className="w-5 h-5" style={{ color: "#a8a8a8" }} />
                <input
                  type="text"
                  placeholder="Search books, authors, categories..."
                  className="flex-1 bg-transparent py-4 text-lg outline-none"
                  style={{ color: "#fafaf9" }}
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#a8a8a8" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div 
                className="px-4 py-3"
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <p className="text-sm" style={{ color: "#a8a8a8" }}>
                  Press <kbd 
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "#12121a", color: "#fafaf9" }}
                  >ESC</kbd> to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
