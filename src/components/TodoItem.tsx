"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Calendar, Repeat } from "lucide-react";
import { Todo, Recurrence } from "@/types/todo";
import { DueDatePicker, formatDueDate, isOverdue, isDueToday } from "./DueDatePicker";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate?: (id: string, dueDate: string | null, recurrence: Recurrence) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdateDueDate }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dueDateText = formatDueDate(todo.dueDate || null);
  const overdue = !todo.completed && isOverdue(todo.dueDate || null);
  const dueToday = !todo.completed && isDueToday(todo.dueDate || null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-4 rounded-xl bg-card border border-border p-4 transition-shadow hover:shadow-md"
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
          todo.completed
            ? "border-success bg-success"
            : "border-border hover:border-accent"
        }`}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.div
          initial={false}
          animate={{ scale: todo.completed ? 1 : 0 }}
        >
          <Check size={14} className="text-white" strokeWidth={3} />
        </motion.div>
      </button>

      <div className="flex flex-1 flex-col gap-1">
        <span
          className={`text-base transition-all ${
            todo.completed ? "text-muted line-through" : "text-foreground"
          }`}
        >
          {todo.text}
        </span>

        {(dueDateText || todo.recurrence !== "none") && (
          <div className="flex items-center gap-2">
            {dueDateText && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  overdue
                    ? "text-red-500"
                    : dueToday
                    ? "text-accent"
                    : "text-muted"
                }`}
              >
                <Calendar size={10} />
                {dueDateText}
              </span>
            )}
            {todo.recurrence && todo.recurrence !== "none" && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Repeat size={10} />
                {todo.recurrence}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative flex items-center gap-1">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered || showDatePicker ? 1 : 0,
            scale: isHovered || showDatePicker ? 1 : 0.8,
          }}
          onClick={() => setShowDatePicker(!showDatePicker)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            todo.dueDate
              ? "text-accent hover:bg-accent/10"
              : "text-muted hover:bg-border hover:text-foreground"
          }`}
          aria-label="Set due date"
        >
          <Calendar size={16} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          onClick={() => onDelete(todo.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </motion.button>

        <AnimatePresence>
          {showDatePicker && onUpdateDueDate && (
            <DueDatePicker
              value={todo.dueDate || null}
              recurrence={todo.recurrence || "none"}
              onChange={(date, rec) => onUpdateDueDate(todo.id, date, rec)}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
