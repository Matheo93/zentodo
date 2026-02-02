"use client";

import { motion } from "framer-motion";
import { Undo2, Redo2 } from "lucide-react";

interface UndoRedoButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function UndoRedoButtons({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: UndoRedoButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={canUndo ? { scale: 1.05 } : undefined}
        whileTap={canUndo ? { scale: 0.95 } : undefined}
        onClick={onUndo}
        disabled={!canUndo}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted"
        aria-label="Undo (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </motion.button>
      <motion.button
        whileHover={canRedo ? { scale: 1.05 } : undefined}
        whileTap={canRedo ? { scale: 0.95 } : undefined}
        onClick={onRedo}
        disabled={!canRedo}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted"
        aria-label="Redo (Ctrl+Y)"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={18} />
      </motion.button>
    </div>
  );
}
