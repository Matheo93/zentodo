"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, GripVertical, Calendar, Repeat } from "lucide-react";
import { Todo, Recurrence, Tag, TagColor, Priority } from "@/types/todo";
import { DueDatePicker, formatDueDate, isOverdue, isDueToday } from "./DueDatePicker";
import { TagBadge } from "./TagBadge";
import { TagPicker } from "./TagPicker";
import { SubtaskList } from "./SubtaskList";
import { NoteEditor } from "./NoteEditor";
import { PriorityPicker } from "./PriorityPicker";

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
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

export function SortableTodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateDueDate,
  onUpdateTags,
  availableTags = [],
  onCreateTag,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateDescription,
  onUpdatePriority,
}: SortableTodoItemProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const todoTags = availableTags.filter((t) => todo.tags?.includes(t.id));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const dueDateText = formatDueDate(todo.dueDate || null);
  const overdue = !todo.completed && isOverdue(todo.dueDate || null);
  const dueToday = !todo.completed && isDueToday(todo.dueDate || null);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className={`group relative rounded-xl bg-card border border-border p-4 transition-shadow ${
        isDragging ? "shadow-lg ring-2 ring-accent" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded text-muted hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        <button
          onClick={() => onToggle(todo.id)}
          className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
            todo.completed
              ? "border-success bg-success"
              : "border-border hover:border-accent"
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <motion.div
            initial={false}
            animate={{ scale: todo.completed ? 1 : 0 }}
          >
            <Check size={14} className="text-white" strokeWidth={3} />
          </motion.div>
        </button>

        <div className="flex flex-1 flex-col gap-1">
          <span
            className={`text-base transition-all ${
              todo.completed ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {todo.text}
          </span>

          {(dueDateText || (todo.recurrence && todo.recurrence !== "none") || todoTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {todoTags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}
              {dueDateText && (
                <span
                  className={`flex items-center gap-1 text-xs ${
                    overdue
                      ? "text-red-500"
                      : dueToday
                      ? "text-accent"
                      : "text-muted"
                  }`}
                >
                  <Calendar size={10} />
                  {dueDateText}
                </span>
              )}
              {todo.recurrence && todo.recurrence !== "none" && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Repeat size={10} />
                  {todo.recurrence}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-1">
          {onUpdatePriority && (
            <PriorityPicker
              value={todo.priority || "none"}
              onChange={(priority) => onUpdatePriority(todo.id, priority)}
            />
          )}

          {onUpdateTags && onCreateTag && (
            <TagPicker
              availableTags={availableTags}
              selectedTagIds={todo.tags || []}
              onTagsChange={(tagIds) => onUpdateTags(todo.id, tagIds)}
              onCreateTag={onCreateTag}
            />
          )}

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              todo.dueDate
                ? "text-accent hover:bg-accent/10"
                : "text-muted/50 hover:text-muted hover:bg-border group-hover:text-foreground"
            }`}
            aria-label="Set due date"
          >
            <Calendar size={16} />
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted/50 transition-all hover:bg-red-100 hover:text-red-500 group-hover:text-muted dark:hover:bg-red-900/30"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>

          <AnimatePresence>
            {showDatePicker && onUpdateDueDate && (
              <DueDatePicker
                value={todo.dueDate || null}
                recurrence={todo.recurrence || "none"}
                onChange={(date, rec) => onUpdateDueDate(todo.id, date, rec)}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Note section */}
      {onUpdateDescription && (
        <div className="ml-9">
          <NoteEditor
            value={todo.description || ""}
            onChange={(desc) => onUpdateDescription(todo.id, desc)}
            isParentCompleted={todo.completed}
          />
        </div>
      )}

      {/* Subtasks section */}
      {onAddSubtask && onToggleSubtask && onDeleteSubtask && (
        <div className="ml-9">
          <SubtaskList
            subtasks={todo.subtasks || []}
            onAddSubtask={(text) => onAddSubtask(todo.id, text)}
            onToggleSubtask={(subtaskId) => onToggleSubtask(todo.id, subtaskId)}
            onDeleteSubtask={(subtaskId) => onDeleteSubtask(todo.id, subtaskId)}
            isParentCompleted={todo.completed}
          />
        </div>
      )}
    </motion.div>
  );
}
