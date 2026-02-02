"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
import { Subtask } from "@/types/todo";

interface SubtaskListProps {
  subtasks: Subtask[];
  onAddSubtask: (text: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  isParentCompleted?: boolean;
}

export function SubtaskList({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isParentCompleted = false,
}: SubtaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      onAddSubtask(newSubtaskText.trim());
      setNewSubtaskText("");
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-2">
      {/* Header with progress */}
      <div className="flex items-center gap-2">
        {subtasks.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <span className="font-medium">
              {completedCount}/{totalCount}
            </span>
          </button>
        )}

        {subtasks.length > 0 && (
          <div className="flex-1 h-1 max-w-[60px] rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-success rounded-full"
            />
          </div>
        )}

        {!isAdding && !isParentCompleted && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
          >
            <Plus size={12} />
            <span>Add subtask</span>
          </button>
        )}
      </div>

      {/* Add subtask input */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSubtask();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewSubtaskText("");
                }
              }}
              placeholder="Subtask name..."
              className="flex-1 rounded-lg bg-background border border-border px-2 py-1 text-xs text-foreground placeholder:text-muted outline-none focus:border-accent"
              autoFocus
              maxLength={200}
            />
            <button
              onClick={handleAddSubtask}
              disabled={!newSubtaskText.trim()}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewSubtaskText("");
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-border transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtask list */}
      <AnimatePresence>
        {isExpanded && subtasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1 pl-2 border-l-2 border-border"
          >
            {subtasks.map((subtask) => (
              <motion.div
                key={subtask.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="group flex items-center gap-2 py-1"
              >
                <button
                  onClick={() => onToggleSubtask(subtask.id)}
                  disabled={isParentCompleted}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    subtask.completed || isParentCompleted
                      ? "border-success bg-success"
                      : "border-border hover:border-accent"
                  } ${isParentCompleted ? "opacity-50" : ""}`}
                >
                  {(subtask.completed || isParentCompleted) && (
                    <Check size={10} className="text-white" strokeWidth={3} />
                  )}
                </button>
                <span
                  className={`flex-1 text-xs transition-all ${
                    subtask.completed || isParentCompleted
                      ? "text-muted line-through"
                      : "text-foreground"
                  }`}
                >
                  {subtask.text}
                </span>
                {!isParentCompleted && (
                  <button
                    onClick={() => onDeleteSubtask(subtask.id)}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted opacity-0 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 group-hover:opacity-100 transition-all"
                  >
                    <X size={12} />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
