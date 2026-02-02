"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, TagColor } from "@/types/todo";

const STORAGE_KEY = "zen-todo-tags";

function generateTagId(): string {
  return `tag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function loadTags(): Tag[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTags(tags: Tag[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTags(loadTags());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTags(tags);
    }
  }, [tags, isLoaded]);

  const createTag = useCallback((name: string, color: TagColor): Tag => {
    const newTag: Tag = {
      id: generateTagId(),
      name,
      color,
    };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Omit<Tag, "id">>) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const getTag = useCallback((id: string): Tag | undefined => {
    return tags.find((t) => t.id === id);
  }, [tags]);

  const getTagsByIds = useCallback((ids: string[]): Tag[] => {
    return tags.filter((t) => ids.includes(t.id));
  }, [tags]);

  return {
    tags,
    createTag,
    deleteTag,
    updateTag,
    getTag,
    getTagsByIds,
    isLoaded,
  };
}
