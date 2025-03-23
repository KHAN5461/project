import { useState, useCallback, useRef } from 'react';
import { GameObject } from '@/types/project';

type HistoryState = {
  objects: GameObject[];
  selectedObjects: string[];
};

const MAX_HISTORY_LENGTH = 50;

export const useHistory = (initialState: HistoryState) => {
  if (!initialState || !Array.isArray(initialState.objects) || !Array.isArray(initialState.selectedObjects)) {
    throw new Error('Invalid initial state provided to useHistory');
  }

  const [history, setHistory] = useState<HistoryState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUpdating = useRef(false);

  const validateState = (state: HistoryState): boolean => {
    if (!state || typeof state !== 'object') {
      console.warn('Invalid history state: must be a non-null object');
      return false;
    }
    if (!Array.isArray(state.objects)) {
      console.warn('Invalid history state: objects must be an array');
      return false;
    }
    if (!Array.isArray(state.selectedObjects)) {
      console.warn('Invalid history state: selectedObjects must be an array');
      return false;
    }
    if (!state.selectedObjects.every(id => typeof id === 'string' && id.trim())) {
      console.warn('Invalid history state: selectedObjects must contain non-empty string IDs');
      return false;
    }
    if (!state.objects.every(obj => obj && typeof obj === 'object' && typeof obj.id === 'string' && obj.id.trim())) {
      console.warn('Invalid history state: objects must contain valid game objects with non-empty string IDs');
      return false;
    }
    return true;
  };

  const pushState = useCallback((newState: HistoryState) => {
    if (isUpdating.current) {
      console.warn('State update in progress, try again later');
      return;
    }
    if (!validateState(newState)) {
      console.warn('Cannot push invalid state to history');
      return;
    }

    isUpdating.current = true;
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY_LENGTH - 1));
    isUpdating.current = false;
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (isUpdating.current) {
      console.warn('State update in progress, cannot undo');
      return history[currentIndex];
    }
    if (currentIndex <= 0) {
      console.warn('No more history states to undo');
      return history[0];
    }
    isUpdating.current = true;
    setCurrentIndex(prev => prev - 1);
    isUpdating.current = false;
    return history[currentIndex - 1];
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (isUpdating.current) {
      console.warn('State update in progress, cannot redo');
      return history[currentIndex];
    }
    if (currentIndex >= history.length - 1) {
      console.warn('No more history states to redo');
      return history[history.length - 1];
    }
    isUpdating.current = true;
    setCurrentIndex(prev => prev + 1);
    isUpdating.current = false;
    return history[currentIndex + 1];
  }, [history, currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentState: history[currentIndex],
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: history.length
  };
};