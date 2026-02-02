"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";
import { Todo, TodoSchema } from "@/types/todo";
import { z } from "zod";

interface DataActionsProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export function DataActions({ todos, onImport }: DataActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `zentodo-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        const validated = z.array(TodoSchema).safeParse(parsed);

        if (validated.success) {
          onImport(validated.data);
        } else {
          alert("Invalid file format. Please select a valid ZenTodo backup file.");
        }
      } catch {
        alert("Failed to parse file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
        disabled={todos.length === 0}
        className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-sm text-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Export tasks as JSON"
      >
        <Download size={16} />
        Export
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
        aria-label="Import tasks from JSON"
      >
        <Upload size={16} />
        Import
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
