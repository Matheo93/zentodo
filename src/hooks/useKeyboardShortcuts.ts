"use client";

import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onFocusInput?: () => void;
  onToggleTheme?: () => void;
  onClearCompleted?: () => void;
  onShowHelp?: () => void;
  onFilterAll?: () => void;
  onFilterPending?: () => void;
  onFilterCompleted?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInputFocused) {
        if (event.key === "Escape") {
          (target as HTMLInputElement).blur();
        }
        // Don't return here, allow undo/redo to be handled below
      }

      // Handle Ctrl+Z and Ctrl+Y for undo/redo even when focused
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        if (event.shiftKey) {
          event.preventDefault();
          handlers.onRedo?.();
        } else {
          event.preventDefault();
          handlers.onUndo?.();
        }
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        event.preventDefault();
        handlers.onRedo?.();
        return;
      }

      if (isInputFocused) return;

      switch (event.key) {
        case "/":
          event.preventDefault();
          handlers.onFocusInput?.();
          break;
        case "?":
          event.preventDefault();
          handlers.onShowHelp?.();
          break;
        case "d":
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            handlers.onToggleTheme?.();
          }
          break;
        case "x":
          event.preventDefault();
          handlers.onClearCompleted?.();
          break;
        case "1":
          event.preventDefault();
          handlers.onFilterAll?.();
          break;
        case "2":
          event.preventDefault();
          handlers.onFilterPending?.();
          break;
        case "3":
          event.preventDefault();
          handlers.onFilterCompleted?.();
          break;
        case "u":
          event.preventDefault();
          handlers.onUndo?.();
          break;
        case "r":
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            handlers.onRedo?.();
          }
          break;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export const KEYBOARD_SHORTCUTS = [
  { key: "/", description: "Focus input" },
  { key: "Esc", description: "Blur input" },
  { key: "Ctrl+Z", description: "Undo" },
  { key: "Ctrl+Y", description: "Redo" },
  { key: "u", description: "Undo" },
  { key: "r", description: "Redo" },
  { key: "d", description: "Toggle dark mode" },
  { key: "1", description: "Show all tasks" },
  { key: "2", description: "Show pending" },
  { key: "3", description: "Show completed" },
  { key: "x", description: "Clear completed" },
  { key: "?", description: "Show shortcuts" },
];
