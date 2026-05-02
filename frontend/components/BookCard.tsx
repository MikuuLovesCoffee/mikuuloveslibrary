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

  // 3D tilt effect
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
        className="relative rounded-2xl overflow-hidden bg-background-secondary border border-glass-border transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-glow"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Book Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-background">
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <BookOpen className="w-16 h-16 text-primary/40" />
            </div>
          )}

          {/* Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
            </Link>
            <motion.a
              href={book.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-10 flex items-center justify-center rounded-xl glass text-foreground hover:text-primary transition-colors"
              aria-label="Download"
            >
              <Download className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-sm font-semibold text-foreground">{rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4" style={{ transform: "translateZ(20px)" }}>
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-foreground-muted line-clamp-2 mb-3 leading-relaxed">
            {book.description || "No description available"}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-glass-border">
            <div className="flex items-center gap-1 text-foreground-muted">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm">{ratingCount} reviews</span>
            </div>
            <motion.div
              className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
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
