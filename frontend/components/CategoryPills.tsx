"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Rocket, 
  Palette, 
  Code, 
  Music,
  Dumbbell,
  Globe 
} from "lucide-react";

const categories = [
  { id: "all", label: "All Books", icon: BookOpen },
  { id: "fiction", label: "Fiction", icon: Heart },
  { id: "science", label: "Science", icon: Lightbulb },
  { id: "technology", label: "Technology", icon: Code },
  { id: "art", label: "Art & Design", icon: Palette },
  { id: "scifi", label: "Sci-Fi", icon: Rocket },
  { id: "music", label: "Music", icon: Music },
  { id: "health", label: "Health", icon: Dumbbell },
  { id: "travel", label: "Travel", icon: Globe },
];

interface CategoryPillsProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryPills({ onCategoryChange }: CategoryPillsProps) {
  const [selected, setSelected] = useState("all");

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-6"
    >
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(category.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? "text-background"
                  : "text-foreground-muted hover:text-foreground glass"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="category-pill-bg"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
