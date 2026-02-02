"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { usePomodoro, PomodoroPhase } from "@/hooks/usePomodoro";
import { Todo } from "@/types/todo";

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  currentTask: Todo | null;
  onTaskComplete: (id: string) => void;
}

const phaseLabels: Record<PomodoroPhase, string> = {
  idle: "Ready to focus",
  focus: "Focus time",
  shortBreak: "Short break",
  longBreak: "Long break",
};

const phaseColors: Record<PomodoroPhase, string> = {
  idle: "var(--muted)",
  focus: "var(--accent)",
  shortBreak: "var(--success)",
  longBreak: "var(--success)",
};

export function FocusMode({ isOpen, onClose, currentTask, onTaskComplete }: FocusModeProps) {
  const {
    phase,
    isRunning,
    formattedTime,
    progress,
    completedPomodoros,
    startFocus,
    pause,
    resume,
    stop,
    skip,
  } = usePomodoro(() => {
    if (currentTask) {
      onTaskComplete(currentTask.id);
    }
  });

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-muted hover:text-foreground transition-colors"
            aria-label="Close focus mode"
          >
            <X size={20} />
          </motion.button>

          <div className="flex flex-col items-center gap-8 px-4">
            {currentTask && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-sm text-muted mb-1">Focusing on</p>
                <h2 className="text-xl font-medium text-foreground max-w-md truncate">
                  {currentTask.text}
                </h2>
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <svg width="280" height="280" className="transform -rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke={phaseColors[phase]}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={formattedTime}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold tracking-tight text-foreground font-mono"
                >
                  {formattedTime}
                </motion.span>
                <span
                  className="mt-2 text-sm font-medium"
                  style={{ color: phaseColors[phase] }}
                >
                  {phaseLabels[phase]}
                </span>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {phase === "idle" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startFocus(currentTask?.id)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                  aria-label="Start focus"
                >
                  <Play size={24} fill="currentColor" />
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stop}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
                    aria-label="Stop"
                  >
                    <RotateCcw size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isRunning ? pause : resume}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                    aria-label={isRunning ? "Pause" : "Resume"}
                  >
                    {isRunning ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={skip}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
                    aria-label="Skip"
                  >
                    <SkipForward size={20} />
                  </motion.button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`h-3 w-3 rounded-full ${
                    i < completedPomodoros % 4
                      ? "bg-accent"
                      : "bg-border"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted">
                {completedPomodoros} pomodoro{completedPomodoros !== 1 ? "s" : ""} today
              </span>
            </div>

            <p className="text-xs text-muted text-center max-w-xs">
              Stay focused for 25 minutes. Take a 5 minute break after each session.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
