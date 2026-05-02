"use client";

import Link from "next/link";
import { BookOpen, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-glass-border bg-background-secondary/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">BookSphere</span>
            </Link>
            <p className="text-foreground-muted max-w-sm leading-relaxed">
              Discover, share, and explore a world of books. Join our community of passionate readers and find your next great read.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-foreground-muted hover:text-primary transition-colors duration-200"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link 
                  href="/upload" 
                  className="text-foreground-muted hover:text-primary transition-colors duration-200"
                >
                  Upload a Book
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="text-foreground-muted hover:text-primary transition-colors duration-200"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary/30 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary/30 transition-all duration-200"
                aria-label="GitHub"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary/30 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground-muted text-sm">
            &copy; {currentYear} BookSphere. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-foreground-muted hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-foreground-muted hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
