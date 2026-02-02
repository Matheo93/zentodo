"use client";

import { useState, useCallback } from "react";

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoActions<T> {
  set: (newPresent: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newPresent: T) => void;
}

const MAX_HISTORY = 50;

export function useUndo<T>(initialPresent: T): [T, UndoActions<T>] {
  const [state, setState] = useState<UndoState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((newPresent: T | ((prev: T) => T)) => {
    setState((currentState) => {
      const resolvedPresent =
        typeof newPresent === "function"
          ? (newPresent as (prev: T) => T)(currentState.present)
          : newPresent;

      if (resolvedPresent === currentState.present) {
        return currentState;
      }

      const newPast = [...currentState.past, currentState.present].slice(
        -MAX_HISTORY
      );

      return {
        past: newPast,
        present: resolvedPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) {
        return currentState;
      }

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) {
        return currentState;
      }

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState({
      past: [],
      present: newPresent,
      future: [],
    });
  }, []);

  return [
    state.present,
    {
      set,
      undo,
      redo,
      canUndo,
      canRedo,
      reset,
    },
  ];
}
