"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Tag, TagColor } from "@/types/todo";

const colorClasses: Record<TagColor, { bg: string; text: string; border: string }> = {
  gray: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-300 dark:border-gray-600" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-700" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-700" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-300 dark:border-yellow-700" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-300 dark:border-green-700" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-700" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-300 dark:border-purple-700" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-300 dark:border-pink-700" },
};

interface TagBadgeProps {
  tag: Tag;
  size?: "sm" | "md";
  onRemove?: () => void;
}

export function TagBadge({ tag, size = "sm", onRemove }: TagBadgeProps) {
  const colors = colorClasses[tag.color];
  const sizeClasses = size === "sm"
    ? "px-1.5 py-0.5 text-[10px]"
    : "px-2 py-1 text-xs";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses} font-medium`}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X size={8} />
        </button>
      )}
    </motion.span>
  );
}
