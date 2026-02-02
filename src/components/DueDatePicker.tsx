"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, X, Repeat, Sun, Clock } from "lucide-react";
import { Recurrence } from "@/types/todo";

interface DueDatePickerProps {
  value: string | null;
  recurrence: Recurrence;
  onChange: (date: string | null, recurrence: Recurrence) => void;
  onClose: () => void;
}

const quickDates = [
  { label: "Today", icon: Sun, getValue: () => new Date().toISOString() },
  {
    label: "Tomorrow",
    icon: Clock,
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString();
    },
  },
  {
    label: "Next Week",
    icon: Calendar,
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString();
    },
  },
];

const recurrenceOptions: { value: Recurrence; label: string }[] = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function DueDatePicker({
  value,
  recurrence,
  onChange,
  onClose,
}: DueDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(value);
  const [selectedRecurrence, setSelectedRecurrence] =
    useState<Recurrence>(recurrence);

  const handleQuickDate = (getValue: () => string) => {
    const date = getValue();
    setSelectedDate(date);
    onChange(date, selectedRecurrence);
  };

  const handleRecurrenceChange = (rec: Recurrence) => {
    setSelectedRecurrence(rec);
    onChange(selectedDate, rec);
  };

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedRecurrence("none");
    onChange(null, "none");
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
    setSelectedDate(date);
    onChange(date, selectedRecurrence);
  };

  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split("T")[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl bg-card border border-border p-4 shadow-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Due Date</h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-border transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {quickDates.map(({ label, icon: Icon, getValue }) => (
          <button
            key={label}
            onClick={() => handleQuickDate(getValue)}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-background px-2 py-2 text-xs text-muted hover:text-foreground hover:bg-border transition-colors"
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs text-muted">Custom date</label>
        <input
          type="date"
          value={formatDateForInput(selectedDate)}
          onChange={handleDateInput}
          className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs text-muted">
          <Repeat size={12} />
          Repeat
        </label>
        <div className="grid grid-cols-2 gap-2">
          {recurrenceOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleRecurrenceChange(value)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedRecurrence === value
                  ? "bg-accent text-white"
                  : "bg-background text-muted hover:text-foreground hover:bg-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(selectedDate || selectedRecurrence !== "none") && (
        <button
          onClick={handleClear}
          className="w-full rounded-lg bg-background px-3 py-2 text-xs text-muted hover:text-foreground hover:bg-border transition-colors"
        >
          Clear due date
        </button>
      )}
    </motion.div>
  );
}

export function formatDueDate(isoString: string | null): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === tomorrow.getTime()) return "Tomorrow";

  const diff = dateOnly.getTime() - today.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days < 7) return `In ${days}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isDueToday(isoString: string | null): boolean {
  if (!isoString) return false;
  const date = new Date(isoString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isOverdue(isoString: string | null): boolean {
  if (!isoString) return false;
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return dateOnly < today;
}
