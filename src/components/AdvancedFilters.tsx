"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Flag, Tag as TagIcon, Calendar, ChevronDown } from "lucide-react";
import { Priority, Tag } from "@/types/todo";

export interface FilterState {
  priorities: Priority[];
  tagIds: string[];
  dateFilter: "all" | "overdue" | "today" | "week" | "noDate";
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableTags: Tag[];
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "high", label: "High", color: "text-red-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "low", label: "Low", color: "text-blue-500" },
  { value: "none", label: "No priority", color: "text-muted" },
];

const dateOptions: { value: FilterState["dateFilter"]; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "noDate", label: "No due date" },
];

export function AdvancedFilters({ filters, onChange, availableTags }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeFilterCount =
    filters.priorities.length +
    filters.tagIds.length +
    (filters.dateFilter !== "all" ? 1 : 0);

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

  const togglePriority = (priority: Priority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    onChange({ ...filters, priorities: newPriorities });
  };

  const toggleTag = (tagId: string) => {
    const newTagIds = filters.tagIds.includes(tagId)
      ? filters.tagIds.filter((t) => t !== tagId)
      : [...filters.tagIds, tagId];
    onChange({ ...filters, tagIds: newTagIds });
  };

  const setDateFilter = (dateFilter: FilterState["dateFilter"]) => {
    onChange({ ...filters, dateFilter });
  };

  const clearAllFilters = () => {
    onChange({ priorities: [], tagIds: [], dateFilter: "all" });
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
          activeFilterCount > 0
            ? "bg-accent text-white"
            : "bg-card border border-border text-muted hover:text-foreground hover:border-accent"
        }`}
      >
        <Filter size={14} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-medium">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-xl"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted hover:text-accent transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                <Flag size={12} />
                <span>Priority</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => togglePriority(option.value)}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
                      filters.priorities.includes(option.value)
                        ? "bg-accent text-white"
                        : "bg-background text-foreground hover:bg-border"
                    }`}
                  >
                    <Flag
                      size={10}
                      className={filters.priorities.includes(option.value) ? "" : option.color}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                <Calendar size={12} />
                <span>Due date</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateFilter(option.value)}
                    className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                      filters.dateFilter === option.value
                        ? "bg-accent text-white"
                        : "bg-background text-foreground hover:bg-border"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                  <TagIcon size={12} />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                        filters.tagIds.includes(tag.id)
                          ? "bg-accent text-white"
                          : "bg-background text-foreground hover:bg-border"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="absolute left-0 top-full mt-1 flex flex-wrap gap-1">
          {filters.priorities.map((priority) => {
            const option = priorityOptions.find((p) => p.value === priority);
            return (
              <span
                key={priority}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent"
              >
                <Flag size={8} />
                {option?.label}
                <button
                  onClick={() => togglePriority(priority)}
                  className="hover:text-accent-hover"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
          {filters.dateFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
              <Calendar size={8} />
              {dateOptions.find((d) => d.value === filters.dateFilter)?.label}
              <button
                onClick={() => setDateFilter("all")}
                className="hover:text-accent-hover"
              >
                <X size={10} />
              </button>
            </span>
          )}
          {filters.tagIds.map((tagId) => {
            const tag = availableTags.find((t) => t.id === tagId);
            return tag ? (
              <span
                key={tagId}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent"
              >
                <TagIcon size={8} />
                {tag.name}
                <button
                  onClick={() => toggleTag(tagId)}
                  className="hover:text-accent-hover"
                >
                  <X size={10} />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export const defaultFilters: FilterState = {
  priorities: [],
  tagIds: [],
  dateFilter: "all",
};
