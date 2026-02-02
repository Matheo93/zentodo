"use client";

import { motion } from "framer-motion";
import { ArrowUpDown, Calendar, Clock, Type, ArrowUp, ArrowDown, Flag } from "lucide-react";

export type SortField = "createdAt" | "text" | "dueDate" | "priority";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

interface SortOptionsProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const sortFields: { field: SortField; label: string; icon: typeof Calendar }[] = [
  { field: "createdAt", label: "Created", icon: Clock },
  { field: "text", label: "Name", icon: Type },
  { field: "dueDate", label: "Due", icon: Calendar },
  { field: "priority", label: "Priority", icon: Flag },
];

export function SortOptions({ value, onChange }: SortOptionsProps) {
  const handleFieldChange = (field: SortField) => {
    if (value.field === field) {
      onChange({
        field,
        direction: value.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onChange({ field, direction: "desc" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1"
    >
      <ArrowUpDown size={14} className="mr-1 text-muted" />
      {sortFields.map(({ field, label, icon: Icon }) => {
        const isActive = value.field === field;
        return (
          <button
            key={field}
            onClick={() => handleFieldChange(field)}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
              isActive
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-border"
            }`}
            aria-label={`Sort by ${label}`}
          >
            <Icon size={12} />
            <span>{label}</span>
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-0.5"
              >
                {value.direction === "asc" ? (
                  <ArrowUp size={10} />
                ) : (
                  <ArrowDown size={10} />
                )}
              </motion.span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
