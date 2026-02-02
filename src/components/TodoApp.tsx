"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDebounce } from "@/hooks/useDebounce";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { TodoStats } from "./TodoStats";
import { ThemeToggle } from "./ThemeToggle";
import { FilterTabs, FilterType } from "./FilterTabs";
import { DataActions } from "./DataActions";
import { OfflineIndicator } from "./OfflineIndicator";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { FocusMode } from "./FocusMode";
import { SearchBar } from "./SearchBar";
import { SortOptions, SortOption, SortField } from "./SortOptions";
import { StatsModal } from "./StatsModal";
import { AdvancedFilters, FilterState, defaultFilters } from "./AdvancedFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, Keyboard, Focus, Search, BarChart2 } from "lucide-react";

export function TodoApp() {
  const {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    importTodos,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTodoDueDate,
    updateTodoTags,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateTodoDescription,
    updateTodoPriority,
    pendingCount,
    completedCount,
    totalCount,
  } = useTodos();

  const { tags, createTag } = useTags();
  const { isOffline } = useServiceWorker();
  const { setTheme, resolvedTheme } = useTheme();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(defaultFilters);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const focusTask = focusTaskId ? todos.find((t) => t.id === focusTaskId) || null : null;

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onToggleTheme: handleToggleTheme,
    onClearCompleted: clearCompleted,
    onShowHelp: () => setShowShortcuts(true),
    onFilterAll: () => setFilter("all"),
    onFilterPending: () => setFilter("pending"),
    onFilterCompleted: () => setFilter("completed"),
    onUndo: undo,
    onRedo: redo,
  });

  const filteredAndSortedTodos = useMemo(() => {
    let result = todos;

    // Filter by status
    switch (filter) {
      case "pending":
        result = result.filter((t) => !t.completed);
        break;
      case "completed":
        result = result.filter((t) => t.completed);
        break;
    }

    // Filter by search query
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((t) => t.text.toLowerCase().includes(query));
    }

    // Advanced filters - Priority
    if (advancedFilters.priorities.length > 0) {
      result = result.filter((t) =>
        advancedFilters.priorities.includes(t.priority || "none")
      );
    }

    // Advanced filters - Tags
    if (advancedFilters.tagIds.length > 0) {
      result = result.filter((t) =>
        advancedFilters.tagIds.some((tagId) => t.tags?.includes(tagId))
      );
    }

    // Advanced filters - Date
    if (advancedFilters.dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      result = result.filter((t) => {
        if (advancedFilters.dateFilter === "noDate") {
          return !t.dueDate;
        }
        if (!t.dueDate) return false;

        const dueDate = new Date(t.dueDate);
        const dueDateStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        switch (advancedFilters.dateFilter) {
          case "overdue":
            return dueDateStart < today && !t.completed;
          case "today":
            return dueDateStart.getTime() === today.getTime();
          case "week":
            return dueDateStart >= today && dueDateStart < weekFromNow;
          default:
            return true;
        }
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      const { field, direction } = sortOption;
      const multiplier = direction === "asc" ? 1 : -1;

      if (field === "text") {
        return multiplier * a.text.localeCompare(b.text);
      }

      if (field === "dueDate") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return multiplier * (aDate - bDate);
      }

      if (field === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
        const aPriority = priorityOrder[a.priority || "none"];
        const bPriority = priorityOrder[b.priority || "none"];
        return multiplier * (aPriority - bPriority);
      }

      // createdAt (default)
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return multiplier * (aDate - bDate);
    });

    return result;
  }, [todos, filter, debouncedSearch, sortOption, advancedFilters]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Circle className="text-accent" size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-16">
      <OfflineIndicator isOffline={isOffline} />
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        todos={todos}
        tags={tags}
      />
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => {
          setShowFocusMode(false);
          setFocusTaskId(null);
        }}
        currentTask={focusTask}
        onTaskComplete={toggleTodo}
      />

      <div className="mx-auto max-w-lg">
        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-8 sm:top-8">
          <UndoRedoButtons
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFocusMode(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors"
            aria-label="Enter focus mode"
            title="Focus Mode (Pomodoro)"
          >
            <Focus size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(!showSearch)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              showSearch
                ? "bg-accent text-white border-accent"
                : "bg-card border-border text-muted hover:text-foreground hover:border-accent"
            }`}
            aria-label="Toggle search"
            title="Search (Ctrl+F)"
          >
            <Search size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
            aria-label="Show statistics"
            title="Productivity Stats"
          >
            <BarChart2 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShortcuts(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard size={18} />
          </motion.button>
          <DataActions todos={todos} onImport={importTodos} />
          <ThemeToggle />
        </div>

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              zen
            </span>
            <span className="text-foreground">todo</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Minimal. Focused. Peaceful.
          </p>
        </motion.header>

        <TodoInput onAdd={addTodo} inputRef={inputRef} />

        {totalCount > 0 && (
          <>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search tasks..."
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FilterTabs
              activeFilter={filter}
              onFilterChange={setFilter}
              counts={{
                all: totalCount,
                pending: pendingCount,
                completed: completedCount,
              }}
            />

            <div className="mb-4 flex items-center justify-between gap-2">
              <TodoStats
                pendingCount={pendingCount}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
              />
              <div className="flex items-center gap-2">
                <AdvancedFilters
                  filters={advancedFilters}
                  onChange={setAdvancedFilters}
                  availableTags={tags}
                />
                <SortOptions value={sortOption} onChange={setSortOption} />
              </div>
            </div>
          </>
        )}

        <TodoList
          todos={filteredAndSortedTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
          onUpdateDueDate={updateTodoDueDate}
          onUpdateTags={updateTodoTags}
          availableTags={tags}
          onCreateTag={createTag}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
          onUpdateDescription={updateTodoDescription}
          onUpdatePriority={updateTodoPriority}
        />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-xs text-muted"
        >
          Press <kbd className="rounded bg-border px-1.5 py-0.5 font-mono">?</kbd> for shortcuts
        </motion.footer>
      </div>
    </div>
  );
}
