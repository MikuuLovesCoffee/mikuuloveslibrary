/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, BookOpen, Download, Eye } from "lucide-react";
import { useState, useRef } from "react";

interface BookCardProps {
  book: any;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const rating = book.averageRating?.toFixed(1) || "0.0";
  const ratingCount = book.ratingsCount || 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] 
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      <div 
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{ 
          backgroundColor: "#12121a", 
          border: "1px solid rgba(255, 255, 255, 0.08)",
          transformStyle: "preserve-3d",
          boxShadow: isHovered ? "0 0 30px rgba(212, 165, 116, 0.15)" : "none"
        }}
      >
        {/* Book Cover Image */}
        <div 
          className="relative aspect-[3/4] overflow-hidden"
          style={{ backgroundColor: "#0a0a0f" }}
        >
          {book.imageUrl ? (
            <motion.img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(to bottom right, rgba(212, 165, 116, 0.1), rgba(212, 165, 116, 0.05))" }}
            >
              <BookOpen className="w-16 h-16" style={{ color: "rgba(212, 165, 116, 0.4)" }} />
            </div>
          )}

          {/* Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #0a0a0f, rgba(10, 10, 15, 0.5), transparent)" }}
          />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2"
          >
            <Link href={`/book/${book.id}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ backgroundColor: "#d4a574", color: "#0a0a0f" }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
            </Link>
            {book.fileUrl && (
              <motion.a
                href={book.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-10 flex items-center justify-center rounded-xl glass transition-colors"
                style={{ color: "#fafaf9" }}
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </motion.a>
            )}
          </motion.div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass">
              <Star className="w-3.5 h-3.5" style={{ color: "#d4a574", fill: "#d4a574" }} />
              <span className="text-sm font-semibold" style={{ color: "#fafaf9" }}>{rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4" style={{ transform: "translateZ(20px)" }}>
          <h3 
            className="text-lg font-semibold mb-1 transition-colors truncate"
            style={{ color: isHovered ? "#d4a574" : "#fafaf9" }}
          >
            {book.title}
          </h3>

          <p 
            className="text-sm mb-3 leading-relaxed line-clamp-2"
            style={{ color: "#a8a8a8" }}
          >
            {book.description || "No description available"}
          </p>

          <div 
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            <div className="flex items-center gap-1" style={{ color: "#a8a8a8" }}>
              <Star className="w-4 h-4" style={{ color: "#d4a574" }} />
              <span className="text-sm">{ratingCount} reviews</span>
            </div>
            <motion.div
              className="flex items-center gap-1 transition-opacity"
              style={{ color: "#d4a574", opacity: isHovered ? 1 : 0 }}
              initial={{ x: -10 }}
              animate={{ x: isHovered ? 0 : -10 }}
            >
              <span className="text-sm font-medium">Read more</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
            transform: "translateX(-100%)",
          }}
          animate={{
            transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
