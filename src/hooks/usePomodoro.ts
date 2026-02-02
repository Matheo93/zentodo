"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type PomodoroPhase = "focus" | "shortBreak" | "longBreak" | "idle";

interface PomodoroState {
  phase: PomodoroPhase;
  timeLeft: number;
  isRunning: boolean;
  completedPomodoros: number;
  currentTaskId: string | null;
}

interface PomodoroConfig {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  pomodorosUntilLongBreak: 4,
};

export function usePomodoro(onComplete?: () => void) {
  const [state, setState] = useState<PomodoroState>({
    phase: "idle",
    timeLeft: DEFAULT_CONFIG.focusDuration,
    isRunning: false,
    completedPomodoros: 0,
    currentTaskId: null,
  });

  const [config] = useState<PomodoroConfig>(DEFAULT_CONFIG);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/bell.mp3");
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (state.isRunning && state.timeLeft === 0) {
      audioRef.current?.play().catch(() => {});

      if (state.phase === "focus") {
        const newCompleted = state.completedPomodoros + 1;
        const isLongBreak = newCompleted % config.pomodorosUntilLongBreak === 0;

        setState((prev) => ({
          ...prev,
          phase: isLongBreak ? "longBreak" : "shortBreak",
          timeLeft: isLongBreak ? config.longBreakDuration : config.shortBreakDuration,
          completedPomodoros: newCompleted,
          isRunning: false,
        }));

        onComplete?.();
      } else {
        setState((prev) => ({
          ...prev,
          phase: "focus",
          timeLeft: config.focusDuration,
          isRunning: false,
        }));
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft, state.phase, state.completedPomodoros, config, onComplete]);

  const startFocus = useCallback((taskId?: string) => {
    setState((prev) => ({
      ...prev,
      phase: "focus",
      timeLeft: config.focusDuration,
      isRunning: true,
      currentTaskId: taskId || null,
    }));
  }, [config.focusDuration]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const stop = useCallback(() => {
    setState({
      phase: "idle",
      timeLeft: config.focusDuration,
      isRunning: false,
      completedPomodoros: state.completedPomodoros,
      currentTaskId: null,
    });
  }, [config.focusDuration, state.completedPomodoros]);

  const skip = useCallback(() => {
    if (state.phase === "focus") {
      const isLongBreak = (state.completedPomodoros + 1) % config.pomodorosUntilLongBreak === 0;
      setState((prev) => ({
        ...prev,
        phase: isLongBreak ? "longBreak" : "shortBreak",
        timeLeft: isLongBreak ? config.longBreakDuration : config.shortBreakDuration,
        isRunning: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        phase: "focus",
        timeLeft: config.focusDuration,
        isRunning: false,
      }));
    }
  }, [state.phase, state.completedPomodoros, config]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const progress = state.phase === "idle"
    ? 0
    : state.phase === "focus"
      ? 1 - (state.timeLeft / config.focusDuration)
      : state.phase === "shortBreak"
        ? 1 - (state.timeLeft / config.shortBreakDuration)
        : 1 - (state.timeLeft / config.longBreakDuration);

  return {
    ...state,
    progress,
    formattedTime: formatTime(state.timeLeft),
    startFocus,
    pause,
    resume,
    stop,
    skip,
  };
}
