"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check, X, ChevronDown, ChevronRight } from "lucide-react";

interface NoteEditorProps {
  value: string;
  onChange: (value: string) => void;
  isParentCompleted?: boolean;
}

export function NoteEditor({
  value,
  onChange,
  isParentCompleted = false,
}: NoteEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    }
  };

  const hasNote = value.trim().length > 0;

  // If no note and not editing, show add note button
  if (!hasNote && !isEditing) {
    if (isParentCompleted) return null;

    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors mt-1"
      >
        <FileText size={12} />
        <span>Add note</span>
      </button>
    );
  }

  return (
    <div className="mt-2">
      {/* Header with expand/collapse */}
      {hasNote && !isEditing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <FileText size={12} />
          <span className="font-medium">Note</span>
        </button>
      )}

      <AnimatePresence>
        {/* View mode - expanded */}
        {hasNote && isExpanded && !isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 pl-4 border-l-2 border-border"
          >
            <p
              onClick={() => !isParentCompleted && setIsEditing(true)}
              className={`text-xs whitespace-pre-wrap cursor-pointer hover:bg-border/50 rounded px-2 py-1 -ml-2 transition-colors ${
                isParentCompleted ? "text-muted cursor-default" : "text-foreground"
              }`}
            >
              {value}
            </p>
          </motion.div>
        )}

        {/* Edit mode */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              className="w-full rounded-lg bg-background border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted outline-none focus:border-accent resize-none min-h-[80px]"
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted">
                {editValue.length}/2000 • ⌘+Enter to save
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-border transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSave}
                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
