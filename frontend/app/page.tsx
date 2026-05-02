/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Hero from "@/components/Hero";
import BookCarousel from "@/components/BookCarousel";
import BookGrid from "@/components/BookGrid";
import CategoryPills from "@/components/CategoryPills";
import { CarouselSkeleton, HeroSkeleton } from "@/components/LoadingSkeleton";
import { TrendingUp, Clock, Star, Library } from "lucide-react";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch {
        // Handle error silently or set empty array
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const featuredBooks = books.slice(0, 6);
  const recentBooks = [...books].reverse().slice(0, 6);
  const topRatedBooks = [...books]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 6);

  const filteredBooks = selectedCategory === "all" 
    ? books 
    : books.filter(book => 
        book.category?.toLowerCase() === selectedCategory || 
        book.title?.toLowerCase().includes(selectedCategory)
      );

  const stats = [
    { icon: Library, value: books.length, label: "Total Books" },
    { icon: TrendingUp, value: featuredBooks.length, label: "Featured" },
    { icon: Star, value: topRatedBooks.filter(b => b.averageRating >= 4).length, label: "Top Rated" },
    { icon: Clock, value: recentBooks.length, label: "Recent" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {loading ? <HeroSkeleton /> : <Hero />}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CategoryPills onCategoryChange={setSelectedCategory} />
        </motion.div>

        {loading ? (
          <>
            <CarouselSkeleton />
            <CarouselSkeleton />
          </>
        ) : (
          <>
            {/* Featured Books Carousel */}
            {featuredBooks.length > 0 && (
              <BookCarousel
                books={featuredBooks}
                title="Featured Books"
                subtitle="Handpicked selections for you"
                autoplay={true}
              />
            )}

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="py-12"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card rounded-2xl p-6 text-center hover-lift cursor-default"
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "rgba(212, 165, 116, 0.1)" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: "#d4a574" }} />
                      </div>
                      <div className="text-3xl font-bold" style={{ color: "#fafaf9" }}>{stat.value}</div>
                      <div className="text-sm mt-1" style={{ color: "#a8a8a8" }}>{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Top Rated Carousel */}
            {topRatedBooks.length > 0 && (
              <BookCarousel
                books={topRatedBooks}
                title="Top Rated"
                subtitle="Highest rated by the community"
                autoplay={false}
              />
            )}

            {/* Recently Added Carousel */}
            {recentBooks.length > 0 && (
              <BookCarousel
                books={recentBooks}
                title="Recently Added"
                subtitle="Fresh additions to our library"
                autoplay={false}
              />
            )}

            {/* All Books Grid */}
            <BookGrid
              books={filteredBooks}
              title="Browse All Books"
              subtitle={`${filteredBooks.length} books available`}
            />
          </>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20"
        >
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(212, 165, 116, 0.1) 0%, transparent 70%)",
                }}
              />
              <div 
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%)",
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: "#fafaf9" }}
              >
                Share Your Knowledge
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg max-w-2xl mx-auto mb-8"
                style={{ color: "#a8a8a8" }}
              >
                Have a book you think others would love? Upload it to our library and help spread knowledge to readers worldwide.
              </motion.p>
              <motion.a
                href="/upload"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-glow"
                style={{ backgroundColor: "#d4a574", color: "#0a0a0f" }}
              >
                Upload a Book
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
