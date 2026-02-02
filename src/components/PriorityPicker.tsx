"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Check } from "lucide-react";
import { Priority } from "@/types/todo";

interface PriorityPickerProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const priorityOptions: { value: Priority; label: string; color: string; bgColor: string }[] = [
  { value: "none", label: "No priority", color: "text-muted", bgColor: "bg-border" },
  { value: "low", label: "Low", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { value: "medium", label: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  { value: "high", label: "High", color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/30" },
];

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-blue-500";
    default:
      return "text-muted";
  }
}

export function getPriorityBgColor(priority: Priority): string {
  switch (priority) {
    case "high":
      return "bg-red-100 dark:bg-red-900/30";
    case "medium":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "low":
      return "bg-blue-100 dark:bg-blue-900/30";
    default:
      return "";
  }
}

export function PriorityPicker({ value, onChange }: PriorityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentPriority = priorityOptions.find((p) => p.value === value) || priorityOptions[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          value !== "none"
            ? `${currentPriority.color} hover:${currentPriority.bgColor}`
            : "text-muted/50 hover:text-muted hover:bg-border group-hover:text-foreground"
        }`}
        aria-label="Set priority"
        title={`Priority: ${currentPriority.label}`}
      >
        <Flag size={16} className={value !== "none" ? "fill-current" : ""} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-1 shadow-lg"
          >
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-border ${
                  value === option.value ? "bg-border" : ""
                }`}
              >
                <Flag
                  size={14}
                  className={`${option.color} ${option.value !== "none" ? "fill-current" : ""}`}
                />
                <span className="flex-1 text-left text-foreground">{option.label}</span>
                {value === option.value && (
                  <Check size={14} className="text-accent" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
