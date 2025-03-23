import { useState, useCallback, useRef } from 'react';
import { GameObject } from '@/types/project';

type TransformState = {
  position: { x: number; y: number };
  rotation: number;
  scale: { x: number; y: number };
};

type TransformMode = 'move' | 'rotate' | 'scale';
type Alignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

const MAX_SELECTED_OBJECTS = 100;

export const useTransform = () => {
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [transformMode, setTransformMode] = useState<TransformMode>('move');
  const [transformState, setTransformState] = useState<TransformState>({
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1 }
  });

  const isUpdating = useRef(false);

  const validateIds = useCallback((ids: string[]): boolean => {
    return Array.isArray(ids) && 
           ids.every(id => typeof id === 'string' && id.trim().length > 0) &&
           ids.length <= MAX_SELECTED_OBJECTS;
  }, []);

  const selectObjects = useCallback((ids: string[]) => {
    if (isUpdating.current) return;
    if (!validateIds(ids)) {
      console.warn('Invalid selection parameters');
      return;
    }
    isUpdating.current = true;
    setSelectedObjects([...new Set(ids)]);
    isUpdating.current = false;
  }, [validateIds]);

  const addToSelection = useCallback((id: string) => {
    if (isUpdating.current) return;
    if (typeof id !== 'string' || !id.trim()) {
      console.warn('Invalid object id for selection');
      return;
    }
    if (selectedObjects.length >= MAX_SELECTED_OBJECTS) {
      console.warn('Maximum selection limit reached');
      return;
    }
    isUpdating.current = true;
    setSelectedObjects(prev => [...new Set([...prev, id])]);
    isUpdating.current = false;
  }, [selectedObjects]);

  const removeFromSelection = useCallback((id: string) => {
    if (isUpdating.current || typeof id !== 'string' || !id.trim()) return;
    isUpdating.current = true;
    setSelectedObjects(prev => prev.filter(objId => objId !== id));
    isUpdating.current = false;
  }, []);

  const clearSelection = useCallback(() => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    setSelectedObjects([]);
    isUpdating.current = false;
  }, []);

  const validateTransformUpdates = useCallback((updates: Partial<TransformState>): boolean => {
    if (!updates || typeof updates !== 'object') return false;
    if (updates.position && (typeof updates.position.x !== 'number' || typeof updates.position.y !== 'number')) return false;
    if (updates.rotation !== undefined && typeof updates.rotation !== 'number') return false;
    if (updates.scale && (typeof updates.scale.x !== 'number' || typeof updates.scale.y !== 'number')) return false;
    return true;
  }, []);

  const updateTransform = useCallback((objects: GameObject[], updates: Partial<TransformState>) => {
    if (isUpdating.current) return objects;
    if (!Array.isArray(objects)) {
      console.warn('Invalid objects array provided');
      return objects;
    }
    if (!validateTransformUpdates(updates)) {
      console.warn('Invalid transform parameters: updates must contain valid position, rotation, or scale values');
      return objects;
    }
    if (selectedObjects.length === 0) {
      console.warn('No objects selected for transformation');
      return objects;
    }
    if (!objects.length) {
      console.warn('Empty objects array provided');
      return objects;
    }

    isUpdating.current = true;
    const result = objects.map(obj => {
      if (selectedObjects.includes(obj.id)) {
        return {
          ...obj,
          x: updates.position?.x ?? obj.x,
          y: updates.position?.y ?? obj.y,
          rotation: updates.rotation ?? obj.rotation,
          width: Math.max(1, obj.width * (updates.scale?.x ?? 1)),
          height: Math.max(1, obj.height * (updates.scale?.y ?? 1))
        };
      }
      return obj;
    });
    isUpdating.current = false;
    return result;
  }, [selectedObjects, validateTransformUpdates]);

  const validateAlignment = useCallback((alignment: Alignment): boolean => {
    return ['left', 'center', 'right', 'top', 'middle', 'bottom'].includes(alignment);
  }, []);

  const alignObjects = useCallback((objects: GameObject[], alignment: Alignment) => {
    if (isUpdating.current) return objects;
    if (!Array.isArray(objects)) {
      console.warn('Invalid objects array: expected array but got ' + typeof objects);
      return objects;
    }
    if (objects.length === 0) {
      console.warn('Empty objects array provided for alignment');
      return objects;
    }
    if (!validateAlignment(alignment)) {
      console.warn(`Invalid alignment type: ${alignment}. Expected one of: left, center, right, top, middle, bottom`);
      return objects;
    }
    if (selectedObjects.length < 2) {
      console.warn('At least two objects must be selected for alignment');
      return objects;
    }
    if (!objects.some(obj => selectedObjects.includes(obj.id))) {
      console.warn('None of the selected objects found in the provided objects array');
      return objects;
    }

    isUpdating.current = true;
    const selectedObjs = objects.filter(obj => selectedObjects.includes(obj.id));
    const bounds = selectedObjs.reduce((acc, obj) => {
      return {
        left: Math.min(acc.left, obj.x),
        right: Math.max(acc.right, obj.x + (obj.width || 0)),
        top: Math.min(acc.top, obj.y),
        bottom: Math.max(acc.bottom, obj.y + (obj.height || 0))
      };
    }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

    return objects.map(obj => {
      if (selectedObjects.includes(obj.id)) {
        let newX = obj.x;
        let newY = obj.y;

        switch (alignment) {
          case 'left':
            newX = bounds.left;
            break;
          case 'center':
            newX = bounds.left + (bounds.right - bounds.left) / 2 - (obj.width || 0) / 2;
            break;
          case 'right':
            newX = bounds.right - (obj.width || 0);
            break;
          case 'top':
            newY = bounds.top;
            break;
          case 'middle':
            newY = bounds.top + (bounds.bottom - bounds.top) / 2 - (obj.height || 0) / 2;
            break;
          case 'bottom':
            newY = bounds.bottom - (obj.height || 0);
            break;
        }

        return { ...obj, x: newX, y: newY };
      }
      return obj;
    });
  }, [selectedObjects]);

  return {
    selectedObjects,
    transformMode,
    transformState,
    selectObjects,
    addToSelection,
    removeFromSelection,
    clearSelection,
    setTransformMode,
    setTransformState,
    updateTransform,
    alignObjects
  };
};