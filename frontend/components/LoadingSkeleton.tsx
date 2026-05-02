"use client";

import { motion } from "framer-motion";

export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-background-secondary border border-glass-border">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] animate-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg animate-shimmer" />
          <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-glass-border">
          <div className="h-4 w-20 rounded-lg animate-shimmer" />
          <div className="h-4 w-16 rounded-lg animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <BookCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="py-12">
      {/* Header Skeleton */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-5 w-32 rounded-lg animate-shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl animate-shimmer" />
          <div className="w-10 h-10 rounded-xl animate-shimmer" />
        </div>
      </div>
      
      {/* Cards Skeleton */}
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex-none w-[300px]">
            <BookCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="h-10 w-48 mx-auto rounded-full animate-shimmer" />
        <div className="space-y-4">
          <div className="h-16 w-3/4 mx-auto rounded-lg animate-shimmer" />
          <div className="h-16 w-1/2 mx-auto rounded-lg animate-shimmer" />
        </div>
        <div className="h-6 w-2/3 mx-auto rounded-lg animate-shimmer" />
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="h-14 w-40 rounded-xl animate-shimmer" />
          <div className="h-14 w-40 rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CarouselSkeleton />
        <CarouselSkeleton />
      </div>
    </div>
  );
}
