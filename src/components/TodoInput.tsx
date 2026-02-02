"use client";

import { useState, useEffect, RefObject } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TodoInputProps {
  onAdd: (input: { text: string }) => boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function TodoInput({ onAdd, inputRef }: TodoInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isFocused && document.activeElement === document.body) {
        e.preventDefault();
        inputRef?.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const success = onAdd({ text: value });
    if (success) {
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-8">
      <motion.div
        initial={false}
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px var(--accent), 0 4px 20px rgba(99, 102, 241, 0.15)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        className="relative flex items-center rounded-2xl bg-card border border-border overflow-hidden"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent px-5 py-4 text-base outline-none placeholder:text-muted"
          autoComplete="off"
        />
        <AnimatePresence>
          {value.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="submit"
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Plus size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="mt-2 text-center text-xs text-muted">
        Press <kbd className="rounded bg-border px-1.5 py-0.5 font-mono text-foreground">/</kbd> to focus
      </div>
    </form>
  );
}
