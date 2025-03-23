import { useState, useCallback, useRef } from 'react';
import { GameObject } from '@/types/project';

type Distribution = 'horizontal' | 'vertical' | 'grid';
type Spacing = { x: number; y: number };

const MAX_GROUP_SIZE = 100;

export const useObjectGroup = () => {
  const [groupedObjects, setGroupedObjects] = useState<Map<string, string[]>>(new Map());
  const isUpdating = useRef(false);

  const validateGroupId = (groupId: string): boolean => {
    return typeof groupId === 'string' && groupId.trim().length > 0;
  };

  const validateObjectIds = (objectIds: string[]): boolean => {
    return Array.isArray(objectIds) && 
           objectIds.length > 0 && 
           objectIds.length <= MAX_GROUP_SIZE && 
           objectIds.every(id => typeof id === 'string' && id.trim().length > 0);
  };

  const createGroup = useCallback((groupId: string, objectIds: string[]) => {
    if (isUpdating.current) return;
    if (!validateGroupId(groupId) || !validateObjectIds(objectIds)) {
      console.warn('Invalid group creation parameters');
      return;
    }

    isUpdating.current = true;
    setGroupedObjects(prev => {
      if (prev.has(groupId)) {
        console.warn(`Group with id ${groupId} already exists`);
        return prev;
      }
      const newGroups = new Map(prev);
      newGroups.set(groupId, [...new Set(objectIds)]);
      return newGroups;
    });
    isUpdating.current = false;
  }, []);

  const removeGroup = useCallback((groupId: string) => {
    if (isUpdating.current || !validateGroupId(groupId)) return;
    
    isUpdating.current = true;
    setGroupedObjects(prev => {
      if (!prev.has(groupId)) {
        console.warn(`Group with id ${groupId} does not exist`);
        return prev;
      }
      const newGroups = new Map(prev);
      newGroups.delete(groupId);
      return newGroups;
    });
    isUpdating.current = false;
  }, []);

  const addToGroup = useCallback((groupId: string, objectId: string) => {
    if (isUpdating.current || !validateGroupId(groupId) || !validateObjectIds([objectId])) return;
    
    isUpdating.current = true;
    setGroupedObjects(prev => {
      if (!prev.has(groupId)) {
        console.warn(`Group with id ${groupId} does not exist`);
        return prev;
      }
      const newGroups = new Map(prev);
      const group = newGroups.get(groupId) || [];
      if (group.length >= MAX_GROUP_SIZE) {
        console.warn(`Group ${groupId} has reached maximum size`);
        return prev;
      }
      if (group.includes(objectId)) {
        console.warn(`Object ${objectId} already exists in group ${groupId}`);
        return prev;
      }
      newGroups.set(groupId, [...group, objectId]);
      return newGroups;
    });
    isUpdating.current = false;
  }, []);

  const removeFromGroup = useCallback((groupId: string, objectId: string) => {
    if (isUpdating.current || !validateGroupId(groupId) || !validateObjectIds([objectId])) return;
    
    isUpdating.current = true;
    setGroupedObjects(prev => {
      if (!prev.has(groupId)) {
        console.warn(`Group with id ${groupId} does not exist`);
        return prev;
      }
      const newGroups = new Map(prev);
      const group = newGroups.get(groupId) || [];
      if (!group.includes(objectId)) {
        console.warn(`Object ${objectId} does not exist in group ${groupId}`);
        return prev;
      }
      newGroups.set(groupId, group.filter(id => id !== objectId));
      return newGroups;
    });
    isUpdating.current = false;
  }, []);

  const distributeObjects = useCallback((objects: GameObject[], selectedIds: string[], type: Distribution, spacing: Spacing) => {
    if (!Array.isArray(objects) || !Array.isArray(selectedIds) || !type || !spacing) return objects;
    if (selectedIds.length < 2 || !objects.length) return objects;
    if (!['horizontal', 'vertical', 'grid'].includes(type)) return objects;
    if (typeof spacing.x !== 'number' || typeof spacing.y !== 'number') return objects;

    const selectedObjs = objects.filter(obj => selectedIds.includes(obj.id));
    const bounds = selectedObjs.reduce((acc, obj) => ({
      left: Math.min(acc.left, obj.x),
      right: Math.max(acc.right, obj.x + (obj.width || 0)),
      top: Math.min(acc.top, obj.y),
      bottom: Math.max(acc.bottom, obj.y + (obj.height || 0))
    }), { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

    const totalWidth = bounds.right - bounds.left;
    const totalHeight = bounds.bottom - bounds.top;

    return objects.map(obj => {
      if (!selectedIds.includes(obj.id)) return obj;

      const index = selectedIds.indexOf(obj.id);
      let newX = obj.x;
      let newY = obj.y;

      switch (type) {
        case 'horizontal':
          newX = bounds.left + (totalWidth / (selectedIds.length - 1)) * index;
          break;
        case 'vertical':
          newY = bounds.top + (totalHeight / (selectedIds.length - 1)) * index;
          break;
        case 'grid':
          const cols = Math.ceil(Math.sqrt(selectedIds.length));
          const row = Math.floor(index / cols);
          const col = index % cols;
          newX = bounds.left + col * (spacing.x + (obj.width || 0));
          newY = bounds.top + row * (spacing.y + (obj.height || 0));
          break;
      }

      return { ...obj, x: newX, y: newY };
    });
  }, []);

  return {
    groupedObjects,
    createGroup,
    removeGroup,
    addToGroup,
    removeFromGroup,
    distributeObjects
  };
};