import { useState, useCallback } from 'react';
import { GameObject } from '@/types/project';

type SnapSettings = {
  enabled: boolean;
  gridSize: number;
  snapToObjects: boolean;
  snapThreshold: number;
};

type SnapGuide = {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
};

export const useSnap = () => {
  const [settings, setSettings] = useState<SnapSettings>({
    enabled: true,
    gridSize: 10,
    snapToObjects: true,
    snapThreshold: 5
  });

  const [guides, setGuides] = useState<SnapGuide[]>([]);

  const calculateSnapPosition = useCallback((objects: GameObject[], activeObjects: string[], position: { x: number; y: number }): { x: number; y: number } => {
    if (!settings.enabled || !Array.isArray(objects) || !Array.isArray(activeObjects) || !position) return position;
    if (!objects.length || !activeObjects.length) return position;
    if (activeObjects.some(id => typeof id !== 'string')) return position;

    let snappedPosition = { ...position };
    const newGuides: SnapGuide[] = [];

    // Grid snapping
    if (settings.gridSize > 0) {
      snappedPosition.x = Math.round(position.x / settings.gridSize) * settings.gridSize;
      snappedPosition.y = Math.round(position.y / settings.gridSize) * settings.gridSize;
    }

    // Object snapping
    if (settings.snapToObjects) {
      const otherObjects = objects.filter(obj => !activeObjects.includes(obj.id));
      const activeObjectsBounds = objects
        .filter(obj => activeObjects.includes(obj.id))
        .map(obj => ({
          left: obj.x,
          right: obj.x + (obj.width || 0),
          top: obj.y,
          bottom: obj.y + (obj.height || 0),
          centerX: obj.x + (obj.width || 0) / 2,
          centerY: obj.y + (obj.height || 0) / 2
        }));

      otherObjects.forEach(obj => {
        const bounds = {
          left: obj.x,
          right: obj.x + (obj.width || 0),
          top: obj.y,
          bottom: obj.y + (obj.height || 0),
          centerX: obj.x + (obj.width || 0) / 2,
          centerY: obj.y + (obj.height || 0) / 2
        };

        activeObjectsBounds.forEach(activeBounds => {
          // Horizontal alignment
          if (Math.abs(activeBounds.left - bounds.left) < settings.snapThreshold) {
            snappedPosition.x = bounds.left;
            newGuides.push({
              type: 'vertical',
              position: bounds.left,
              start: Math.min(activeBounds.top, bounds.top),
              end: Math.max(activeBounds.bottom, bounds.bottom)
            });
          }
          if (Math.abs(activeBounds.centerX - bounds.centerX) < settings.snapThreshold) {
            snappedPosition.x = bounds.centerX - (activeBounds.right - activeBounds.left) / 2;
            newGuides.push({
              type: 'vertical',
              position: bounds.centerX,
              start: Math.min(activeBounds.top, bounds.top),
              end: Math.max(activeBounds.bottom, bounds.bottom)
            });
          }

          // Vertical alignment
          if (Math.abs(activeBounds.top - bounds.top) < settings.snapThreshold) {
            snappedPosition.y = bounds.top;
            newGuides.push({
              type: 'horizontal',
              position: bounds.top,
              start: Math.min(activeBounds.left, bounds.left),
              end: Math.max(activeBounds.right, bounds.right)
            });
          }
          if (Math.abs(activeBounds.centerY - bounds.centerY) < settings.snapThreshold) {
            snappedPosition.y = bounds.centerY - (activeBounds.bottom - activeBounds.top) / 2;
            newGuides.push({
              type: 'horizontal',
              position: bounds.centerY,
              start: Math.min(activeBounds.left, bounds.left),
              end: Math.max(activeBounds.right, bounds.right)
            });
          }
        });
      });
    }

    setGuides(newGuides);
    return snappedPosition;
  }, [settings]);

  return {
    settings,
    setSettings,
    guides,
    calculateSnapPosition
  };
};