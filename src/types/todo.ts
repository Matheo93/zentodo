import { z } from "zod";

export const RecurrenceSchema = z.enum(["none", "daily", "weekly", "monthly"]);
export type Recurrence = z.infer<typeof RecurrenceSchema>;

export const PrioritySchema = z.enum(["none", "low", "medium", "high"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const TagColorSchema = z.enum([
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
]);
export type TagColor = z.infer<typeof TagColorSchema>;

export const TagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(20),
  color: TagColorSchema,
});
export type Tag = z.infer<typeof TagSchema>;

export const SubtaskSchema = z.object({
  id: z.string(),
  text: z.string().min(1).max(200),
  completed: z.boolean(),
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TodoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  description: z.string().max(2000).optional().default(""),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  dueDate: z.string().datetime().nullable().optional(),
  recurrence: RecurrenceSchema.optional().default("none"),
  priority: PrioritySchema.optional().default("none"),
  tags: z.array(z.string()).optional().default([]),
  subtasks: z.array(SubtaskSchema).optional().default([]),
});

export type Todo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = z.object({
  text: z.string().min(1, "Task cannot be empty").max(500, "Task too long"),
  dueDate: z.string().datetime().nullable().optional(),
  recurrence: RecurrenceSchema.optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
