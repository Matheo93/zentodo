"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Todo, CreateTodoInput, CreateTodoSchema, Recurrence, Priority } from "@/types/todo";
import { getTodos, saveTodos, generateId } from "@/lib/storage";
import { useUndo } from "./useUndo";

export function useTodos() {
  const [todos, { set: setTodos, undo, redo, canUndo, canRedo, reset }] =
    useUndo<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTodos = getTodos();
    reset(loadedTodos);
    setIsLoading(false);
  }, [reset]);

  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const addTodo = useCallback(
    (input: CreateTodoInput) => {
      const validated = CreateTodoSchema.safeParse(input);
      if (!validated.success) return false;

      const newTodo: Todo = {
        id: generateId(),
        text: validated.data.text.trim(),
        description: "",
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        dueDate: validated.data.dueDate || null,
        recurrence: validated.data.recurrence || "none",
        priority: "none",
        tags: validated.data.tags || [],
        subtasks: [],
      };

      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Task added");
      return true;
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date().toISOString() : null,
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success("Task deleted");
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    toast.success(`Cleared ${completedCount} completed task${completedCount > 1 ? "s" : ""}`);
  }, [setTodos, todos]);

  const reorderTodos = useCallback(
    (activeId: string, overId: string) => {
      setTodos((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === activeId);
        const newIndex = prev.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        const newTodos = [...prev];
        const [removed] = newTodos.splice(oldIndex, 1);
        newTodos.splice(newIndex, 0, removed);

        return newTodos;
      });
    },
    [setTodos]
  );

  const importTodos = useCallback(
    (importedTodos: Todo[]) => {
      setTodos(importedTodos);
      toast.success(`Imported ${importedTodos.length} tasks`);
    },
    [setTodos]
  );

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
      toast("Undone", { icon: "↩️" });
    }
  }, [undo, canUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
      toast("Redone", { icon: "↪️" });
    }
  }, [redo, canRedo]);

  const updateTodoDueDate = useCallback(
    (id: string, dueDate: string | null, recurrence: Recurrence) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, dueDate, recurrence } : todo
        )
      );
      if (dueDate) {
        toast.success("Due date set");
      }
    },
    [setTodos]
  );

  const updateTodoTags = useCallback(
    (id: string, tags: string[]) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, tags } : todo
        )
      );
    },
    [setTodos]
  );

  const addSubtask = useCallback(
    (todoId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 200) return;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subtasks: [
                  ...(todo.subtasks || []),
                  {
                    id: generateId(),
                    text: trimmed,
                    completed: false,
                  },
                ],
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  const toggleSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subtasks: (todo.subtasks || []).map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                ),
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  const deleteSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subtasks: (todo.subtasks || []).filter((st) => st.id !== subtaskId),
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  const updateTodoDescription = useCallback(
    (id: string, description: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, description } : todo
        )
      );
    },
    [setTodos]
  );

  const updateTodoPriority = useCallback(
    (id: string, priority: Priority) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, priority } : todo
        )
      );
    },
    [setTodos]
  );

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return {
    todos,
    pendingTodos,
    completedTodos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    importTodos,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    updateTodoDueDate,
    updateTodoTags,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateTodoDescription,
    updateTodoPriority,
    totalCount: todos.length,
    pendingCount: pendingTodos.length,
    completedCount: completedTodos.length,
  };
}
