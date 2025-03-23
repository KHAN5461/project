import { useEffect, useCallback } from 'react';
import { useTransform } from './useTransform';
import { useHistory } from './useHistory';
import { GameObject } from '@/types/project';

type TransformMode = 'translate' | 'rotate' | 'scale';
type Position = { x: number; y: number };
type TransformUpdate = {
  position?: Position;
  rotation?: number;
  scale?: Position;
};

type HotkeyAction = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
};

export const useHotkeys = () => {
  const {
    selectedObjects,
    clearSelection,
    updateTransform,
    transformState,
    objects
  } = useTransform();

  const {
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory({ objects: objects || [], selectedObjects });

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    const hotkeys: HotkeyAction[] = [
      // Undo/Redo
      {
        key: 'z',
        ctrl: true,
        action: () => canUndo && undo()
      },
      {
        key: 'y',
        ctrl: true,
        action: () => canRedo && redo()
      },
      // Selection
      {
        key: 'a',
        ctrl: true,
        action: () => clearSelection()
      },
      // Delete
      {
        key: 'Delete',
        action: () => selectedObjects.length > 0 && clearSelection()
      },
      // Nudge selected objects
      {
        key: 'ArrowLeft',
        action: () => {
          if (!objects || !transformState.position) return;
          const update: TransformUpdate = {
            position: { ...transformState.position, x: transformState.position.x - 1 }
          };
          updateTransform(objects, update);
        }
      },
      {
        key: 'ArrowRight',
        action: () => {
          if (!objects || !transformState.position) return;
          const update: TransformUpdate = {
            position: { ...transformState.position, x: transformState.position.x + 1 }
          };
          updateTransform(objects, update);
        }
      },
      {
        key: 'ArrowUp',
        action: () => {
          if (!objects || !transformState.position) return;
          const update: TransformUpdate = {
            position: { ...transformState.position, y: transformState.position.y - 1 }
          };
          updateTransform(objects, update);
        }
      },
      {
        key: 'ArrowDown',
        action: () => {
          if (!objects || !transformState.position) return;
          const update: TransformUpdate = {
            position: { ...transformState.position, x: transformState.position.x + 1 }
          };
          updateTransform(objects, update);
        }
      },
      // Fine control with shift
      {
        key: 'ArrowLeft',
        shift: true,
        action: () => updateTransform(objects, { position: { ...transformState.position, x: transformState.position.x - 10 } })
      },
      {
        key: 'ArrowRight',
        shift: true,
        action: () => updateTransform(objects, { position: { ...transformState.position, x: transformState.position.x + 10 } })
      },
      {
        key: 'ArrowUp',
        shift: true,
        action: () => updateTransform(objects, { position: { ...transformState.position, y: transformState.position.y - 10 } })
      },
      {
        key: 'ArrowDown',
        shift: true,
        action: () => updateTransform(objects, { position: { ...transformState.position, y: transformState.position.y + 10 } })
      }
    ];

    const matchingHotkey = hotkeys.find(hotkey => {
      const keyMatch = e.key === hotkey.key;
      const ctrlMatch = hotkey.ctrl ? e.ctrlKey : !e.ctrlKey;
      const shiftMatch = hotkey.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = hotkey.alt ? e.altKey : !e.altKey;
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingHotkey) {
      e.preventDefault();
      matchingHotkey.action();
    }
  }, [selectedObjects, clearSelection, updateTransform, transformState, undo, redo, canUndo, canRedo, objects]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};