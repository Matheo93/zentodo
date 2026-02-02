"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface TodoStatsProps {
  pendingCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TodoStats({ pendingCount, completedCount, onClearCompleted }: TodoStatsProps) {
  const total = pendingCount + completedCount;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div className="flex items-center gap-4 text-sm text-muted">
      <span>
        <strong className="text-foreground">{pendingCount}</strong> pending
      </span>
      <span>
        <strong className="text-foreground">{completedCount}</strong> done
      </span>
      {completedCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClearCompleted}
          className="flex items-center gap-1.5 text-muted hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
          Clear
        </motion.button>
      )}
    </div>
  );
}
