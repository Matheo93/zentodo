"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard size={20} className="text-accent" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-border hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                >
                  <span className="text-sm text-muted">{shortcut.description}</span>
                  <kbd className="rounded bg-border px-2 py-1 font-mono text-xs text-foreground">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Press <kbd className="rounded bg-border px-1.5 py-0.5 font-mono">Esc</kbd> to close
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
