"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, CheckCircle, Clock, Calendar, Tag, Flame } from "lucide-react";
import { Todo, Tag as TagType } from "@/types/todo";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  tags: TagType[];
}

interface DayStats {
  date: string;
  completed: number;
  created: number;
}

export function StatsModal({ isOpen, onClose, todos, tags }: StatsModalProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completed = todos.filter((t) => t.completed);
    const pending = todos.filter((t) => !t.completed);

    // Completed today
    const completedToday = completed.filter((t) => {
      if (!t.completedAt) return false;
      const date = new Date(t.completedAt);
      return date >= today;
    }).length;

    // Completed this week
    const completedThisWeek = completed.filter((t) => {
      if (!t.completedAt) return false;
      const date = new Date(t.completedAt);
      return date >= weekAgo;
    }).length;

    // Created this week
    const createdThisWeek = todos.filter((t) => {
      const date = new Date(t.createdAt);
      return date >= weekAgo;
    }).length;

    // Overdue tasks
    const overdue = pending.filter((t) => {
      if (!t.dueDate) return false;
      const date = new Date(t.dueDate);
      return date < today;
    }).length;

    // Completion rate
    const completionRate = todos.length > 0
      ? Math.round((completed.length / todos.length) * 100)
      : 0;

    // Streak (consecutive days with at least 1 completion)
    let streak = 0;
    const checkDate = new Date(today);
    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
      const hasCompletion = completed.some((t) => {
        if (!t.completedAt) return false;
        const date = new Date(t.completedAt);
        return date >= dayStart && date < dayEnd;
      });
      if (hasCompletion) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Daily stats for chart (last 7 days)
    const dailyStats: DayStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const dayCompleted = completed.filter((t) => {
        if (!t.completedAt) return false;
        const d = new Date(t.completedAt);
        return d >= date && d < nextDate;
      }).length;

      const dayCreated = todos.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= date && d < nextDate;
      }).length;

      dailyStats.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: dayCompleted,
        created: dayCreated,
      });
    }

    // Tag distribution
    const tagCounts: { tag: TagType; count: number }[] = tags.map((tag) => ({
      tag,
      count: todos.filter((t) => t.tags?.includes(tag.id)).length,
    })).filter((t) => t.count > 0).sort((a, b) => b.count - a.count);

    return {
      total: todos.length,
      completed: completed.length,
      pending: pending.length,
      completedToday,
      completedThisWeek,
      createdThisWeek,
      overdue,
      completionRate,
      streak,
      dailyStats,
      tagCounts,
    };
  }, [todos, tags]);

  const maxDaily = Math.max(...stats.dailyStats.map((d) => Math.max(d.completed, d.created)), 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <TrendingUp size={24} className="text-accent" />
                Productivity Stats
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-border transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-background p-3 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.completedToday}</div>
                <div className="text-xs text-muted">Done today</div>
              </div>
              <div className="rounded-xl bg-background p-3 text-center">
                <div className="text-2xl font-bold text-accent">{stats.completionRate}%</div>
                <div className="text-xs text-muted">Completion</div>
              </div>
              <div className="rounded-xl bg-background p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
                  <Flame size={20} />
                  {stats.streak}
                </div>
                <div className="text-xs text-muted">Day streak</div>
              </div>
              <div className="rounded-xl bg-background p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                <div className="text-xs text-muted">Overdue</div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">Last 7 Days</h3>
              <div className="flex items-end justify-between gap-1 h-24">
                {stats.dailyStats.map((day, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className="relative flex w-full flex-col items-center gap-0.5" style={{ height: 80 }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.completed / maxDaily) * 100}%` }}
                        className="w-full max-w-[20px] rounded-t bg-success"
                        title={`${day.completed} completed`}
                      />
                    </div>
                    <span className="text-[10px] text-muted">{day.date}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-success" />
                  Completed
                </span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle size={14} className="text-success" />
                  This week
                </span>
                <span className="text-sm font-medium text-foreground">
                  {stats.completedThisWeek} completed
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Clock size={14} className="text-accent" />
                  Pending
                </span>
                <span className="text-sm font-medium text-foreground">
                  {stats.pending} tasks
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Calendar size={14} className="text-purple-500" />
                  Total tasks
                </span>
                <span className="text-sm font-medium text-foreground">
                  {stats.total}
                </span>
              </div>
            </div>

            {/* Tag Distribution */}
            {stats.tagCounts.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag size={14} />
                  Tags Usage
                </h3>
                <div className="space-y-2">
                  {stats.tagCounts.slice(0, 5).map(({ tag, count }) => (
                    <div key={tag.id} className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium bg-${tag.color}-100 text-${tag.color}-700 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`}
                        style={{
                          backgroundColor: `var(--${tag.color}-100, rgb(var(--${tag.color}-100)))`,
                        }}
                      >
                        {tag.name}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / stats.total) * 100}%` }}
                          className={`h-full rounded-full bg-${tag.color}-500`}
                          style={{
                            backgroundColor: tag.color === "gray" ? "#9ca3af" :
                              tag.color === "red" ? "#ef4444" :
                              tag.color === "orange" ? "#f97316" :
                              tag.color === "yellow" ? "#eab308" :
                              tag.color === "green" ? "#22c55e" :
                              tag.color === "blue" ? "#3b82f6" :
                              tag.color === "purple" ? "#a855f7" :
                              "#ec4899"
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
