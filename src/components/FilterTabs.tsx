"use client";

import { motion } from "framer-motion";

export type FilterType = "all" | "pending" | "completed";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Done" },
];

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-1 rounded-xl bg-border/50 p-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts[filter.value];

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            aria-pressed={isActive}
            aria-label={`Show ${filter.label.toLowerCase()} tasks (${count})`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
            <span
              className={`relative z-10 min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-xs ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "bg-border text-muted"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
