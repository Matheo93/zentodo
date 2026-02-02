import { Todo, TodoSchema } from "@/types/todo";
import { z } from "zod";

const STORAGE_KEY = "zen-todo-tasks";

export function getTodos(): Todo[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    const result = z.array(TodoSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function generateId(): string {
  return crypto.randomUUID();
}
