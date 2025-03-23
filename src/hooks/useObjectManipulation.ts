import { useState, useCallback, useRef } from 'react';
import { GameObject } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

const MAX_OBJECTS = 1000;
const DEFAULT_COLORS: Record<GameObject['type'], string> = {
  rectangle: '#4f46e5',
  circle: '#06b6d4',
  text: '#111827',
  triangle: '#10b981',
  box: '#8b5cf6',
  model: '#ffffff',
  light: '#ffffff',
  sound: '#ffffff',
  image: '#ffffff'
};

export const useObjectManipulation = (initialObjects: GameObject[] = []) => {
  if (!Array.isArray(initialObjects)) {
    throw new Error('Initial objects must be an array');
  }

  const [objects, setObjects] = useState<GameObject[]>(initialObjects);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const { toast } = useToast();
  const isUpdating = useRef(false);

  const validateObject = useCallback((obj: GameObject): boolean => {
    try {
      // Basic object validation
      if (!obj || typeof obj !== 'object') {
        throw new Error('Invalid object: must be a non-null object');
      }

      // Required properties validation
      const requiredProps = ['id', 'type', 'x', 'y', 'color', 'zIndex', 'locked', 'visible', 'rotation'] as const;
      for (const prop of requiredProps) {
        if (!(prop in obj)) {
          throw new Error(`Invalid object: missing required property '${prop}'`);
        }
      }

      // Type validations
      if (typeof obj.id !== 'string' || !obj.id.trim()) {
        throw new Error('Invalid object: id must be a non-empty string');
      }
      if (typeof obj.type !== 'string' || !obj.type.trim()) {
        throw new Error('Invalid object: type must be a non-empty string');
      }
      if (typeof obj.x !== 'number' || isNaN(obj.x)) {
        throw new Error('Invalid object: x must be a valid number');
      }
      if (typeof obj.y !== 'number' || isNaN(obj.y)) {
        throw new Error('Invalid object: y must be a valid number');
      }
      if (typeof obj.color !== 'string' || !obj.color.trim()) {
        throw new Error('Invalid object: color must be a non-empty string');
      }
      if (typeof obj.zIndex !== 'number' || isNaN(obj.zIndex)) {
        throw new Error('Invalid object: zIndex must be a valid number');
      }
      if (typeof obj.locked !== 'boolean') {
        throw new Error('Invalid object: locked must be a boolean');
      }
      if (typeof obj.visible !== 'boolean') {
        throw new Error('Invalid object: visible must be a boolean');
      }
      if (typeof obj.rotation !== 'number' || isNaN(obj.rotation)) {
        throw new Error('Invalid object: rotation must be a valid number');
      }
      
      // Type-specific validation
      switch (obj.type) {
        case 'rectangle':
        case 'box':
        case 'triangle':
          if (typeof obj.width !== 'number' || typeof obj.height !== 'number') {
            throw new Error(`Invalid ${obj.type}: width and height must be numbers`);
          }
          break;
        case 'circle':
          if (typeof obj.radius !== 'number') {
            throw new Error('Invalid circle: radius must be a number');
          }
          break;
        case 'text':
          if (typeof obj.text !== 'string') {
            throw new Error('Invalid text object: text property must be a string');
          }
          break;
        case 'model':
          if (!Array.isArray(obj.position) || obj.position.length !== 3 ||
              !Array.isArray(obj.scale) || obj.scale.length !== 3 ||
              !obj.position.every(n => typeof n === 'number') ||
              !obj.scale.every(n => typeof n === 'number')) {
            throw new Error('Invalid model: position and scale must be arrays of 3 numbers');
          }
          break;
        case 'light':
          if (typeof obj.intensity !== 'number' || isNaN(obj.intensity) ||
              typeof obj.width !== 'number' || typeof obj.height !== 'number') {
            throw new Error('Invalid light: intensity, width, and height must be valid numbers');
          }
          break;
        case 'sound':
          if (!obj.audioSettings ||
              typeof obj.audioSettings.volume !== 'number' || 
              isNaN(obj.audioSettings.volume) ||
              typeof obj.audioSettings.loop !== 'boolean' ||
              typeof obj.audioSettings.spatial !== 'boolean') {
            throw new Error('Invalid sound: audioSettings must include valid volume, loop, and spatial properties');
          }
          break;
        case 'image':
          if (typeof obj.width !== 'number' || typeof obj.height !== 'number') {
            throw new Error('Invalid image: width and height must be numbers');
          }
          break;
        default:
          throw new Error(`Unsupported object type: ${obj.type}`);
      }
      
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : 'Invalid object properties',
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const createObject = useCallback((type: GameObject['type'], x: number, y: number) => {
    if (isUpdating.current) {
      toast({
        title: "Error",
        description: "An operation is already in progress.",
        variant: "destructive"
      });
      return;
    }
    if (objects.length >= MAX_OBJECTS) {
      toast({
        title: "Error",
        description: "Maximum object limit reached.",
        variant: "destructive"
      });
      return;
    }

    const id = Date.now().toString();
    let newObject: GameObject;
    
    const baseObject = {
      id,
      type,
      x,
      y,
      zIndex: 0,
      locked: false,
      visible: true,
      rotation: 0,
      color: DEFAULT_COLORS[type] || '#ffffff'
    };

    switch (type) {
      case 'rectangle':
        newObject = { ...baseObject, width: 100, height: 80 };
        break;
      case 'circle':
        newObject = { ...baseObject, radius: 40, width: 80, height: 80 };
        break;
      case 'text':
        newObject = { ...baseObject, text: 'New Text', width: 100, height: 50 };
        break;
      case 'triangle':
        newObject = { ...baseObject, width: 100, height: 80 };
        break;
      case 'box':
        newObject = { ...baseObject, width: 100, height: 100 };
        break;
      case 'model':
        newObject = { 
          ...baseObject,
          position: [0, 0, 0],
          scale: [1, 1, 1],
          width: 100,
          height: 100
        };
        break;
      case 'light':
        newObject = { 
          ...baseObject,
          intensity: 1,
          width: 50,
          height: 50
        };
        break;
      case 'sound':
        newObject = { 
          ...baseObject,
          width: 50,
          height: 50,
          audioSettings: {
            volume: 1,
            loop: false,
            spatial: false
          }
        };
        break;
      case 'image':
        newObject = {
          ...baseObject,
          width: 100,
          height: 100
        };
        break;
      default:
        toast({
          title: "Error",
          description: `Unsupported object type: ${type}`,
          variant: "destructive"
        });
        return;
    }

    if (!validateObject(newObject)) {
      return;
    }

    setObjects(prev => [...prev, newObject]);
    setSelectedObject(id);

    toast({
      title: "Object Created",
      description: `A new ${type} was added to the scene.`,
    });

    return newObject;
  }, [objects, validateObject, toast]);

  const deleteObject = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedObject === id) {
      setSelectedObject(null);
    }
    
    toast({
      title: "Object Deleted",
      description: "The object has been removed from the scene.",
    });
  };

  const selectObject = (id: string) => {
    setSelectedObject(id);
  };

  const updateObject = useCallback((id: string, updates: Partial<GameObject>) => {
    if (isUpdating.current) {
      toast({
        title: "Operation in Progress",
        description: "Please wait for the current update to complete.",
        variant: "destructive"
      });
      return;
    }

    if (typeof id !== 'string' || !id.trim()) {
      toast({
        title: "Invalid Operation",
        description: "Invalid object ID provided for update.",
        variant: "destructive"
      });
      return;
    }

    if (!updates || typeof updates !== 'object') {
      toast({
        title: "Invalid Operation",
        description: "Invalid update properties provided.",
        variant: "destructive"
      });
      return;
    }

    isUpdating.current = true;
    setObjects(prev => {
      try {
        const targetObject = prev.find(obj => obj.id === id);
        if (!targetObject) {
          toast({
            title: "Update Failed",
            description: `Object with ID ${id} not found.`,
            variant: "destructive"
          });
          return prev;
        }

        const updatedObject = { ...targetObject, ...updates };
        if (!validateObject(updatedObject)) {
          return prev;
        }

        return prev.map(obj => obj.id === id ? updatedObject : obj);
      } catch (error) {
        console.error('Error updating object:', error);
        toast({
          title: "Update Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
        return prev;
      } finally {
        isUpdating.current = false; // Ensure this runs after the callback
      }
    });
  }, [validateObject, toast]);

  return {
    objects,
    setObjects,
    selectedObject,
    setSelectedObject,
    createObject,
    deleteObject,
    selectObject,
    updateObject
  };
};
