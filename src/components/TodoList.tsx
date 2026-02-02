"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Todo, Recurrence, Tag, TagColor, Priority } from "@/types/todo";
import { SortableTodoItem } from "./SortableTodoItem";
import { Sparkles } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
  onUpdateDueDate?: (id: string, dueDate: string | null, recurrence: Recurrence) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
  availableTags?: Tag[];
  onCreateTag?: (name: string, color: TagColor) => Tag;
  onAddSubtask?: (todoId: string, text: string) => void;
  onToggleSubtask?: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask?: (todoId: string, subtaskId: string) => void;
  onUpdateDescription?: (todoId: string, description: string) => void;
  onUpdatePriority?: (todoId: string, priority: Priority) => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onReorder,
  onUpdateDueDate,
  onUpdateTags,
  availableTags = [],
  onCreateTag,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateDescription,
  onUpdatePriority,
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      onReorder(active.id as string, over.id as string);
    }
  };

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-muted"
      >
        <Sparkles size={48} className="mb-4 text-accent/40" />
        <p className="text-lg font-medium">All clear!</p>
        <p className="text-sm">Add a task to get started</p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdateDueDate={onUpdateDueDate}
                onUpdateTags={onUpdateTags}
                availableTags={availableTags}
                onCreateTag={onCreateTag}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={onDeleteSubtask}
                onUpdateDescription={onUpdateDescription}
                onUpdatePriority={onUpdatePriority}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
