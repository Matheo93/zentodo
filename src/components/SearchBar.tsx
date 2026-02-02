"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search tasks...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center rounded-xl bg-card border transition-all ${
        isFocused ? "border-accent shadow-sm" : "border-border"
      }`}
    >
      <Search
        size={18}
        className={`ml-4 transition-colors ${
          isFocused ? "text-accent" : "text-muted"
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted outline-none"
        aria-label="Search tasks"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange("")}
          className="mr-3 flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-border transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
