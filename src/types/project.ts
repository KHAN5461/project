
export type GameObject = {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'triangle' | 'box' | 'model' | 'light' | 'sound';
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  radius?: number;
  text?: string;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  // 3D properties
  position?: [number, number, number];
  scale?: [number, number, number];
  physics?: {
    mass?: number;
    restitution?: number;
    friction?: number;
    isStatic?: boolean;
  };
  scriptId?: string; // Reference to visual script
  assetId?: string; // Reference to asset (model, texture, etc.)
  audioSettings?: {
    volume?: number;
    loop?: boolean;
    spatial?: boolean;
  };
  behaviors?: GameObjectBehavior[]; // Added behaviors for visual programming
};

// New types for visual programming
export type GameObjectBehavior = {
  id: string;
  type: BehaviorType;
  properties: Record<string, string | number | boolean | null>;
  enabled: boolean;
};

export type BehaviorType = 
  | 'platformer' 
  | 'physics' 
  | 'draggable' 
  | 'tween' 
  | 'pathfinding'
  | 'timer'
  | 'state'
  | 'custom';

export type VisualBlock = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  inputs: Record<string, string | number | boolean | null>;
  outputConnections: string[]; // IDs of connected blocks
  category: BlockCategory;
};

export type BlockType = 
  | 'event' | 'action' | 'condition' 
  | 'variable' | 'operator' | 'loop' 
  | 'function' | 'list' | 'text' | 'motion' | 'looks' | 'sound';

export type BlockCategory = 
  | 'events' | 'control' | 'operators' 
  | 'variables' | 'motion' | 'looks' 
  | 'sound' | 'sensing' | 'custom';

export type Project = {
  userId?: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  objects: GameObject[];
  settings: {
    resolution: {
      width: number;
      height: number;
    };
    showGrid: boolean;
    physics: boolean;
    backgroundColor: string;
    viewMode?: '2d' | '3d'; // Added view mode toggle
    renderQuality?: 'low' | 'medium' | 'high';
  };
  assets?: {
    id: string;
    name: string;
    type: 'image' | 'model' | 'audio' | 'script';
    url: string;
  }[];
  scripts?: {
    id: string;
    name: string;
    nodes: {
      id: string;
      type: string;
      position: { x: number; y: number };
      data: Record<string, string | number | boolean | null>;
    }[];
    connections: {
      id: string;
      sourceId: string;
      targetId: string;
      sourceHandle: string;
      targetHandle: string;
      type: string;
    }[];
  }[];
  visualScripts?: {
    id: string;
    name: string;
    blocks: VisualBlock[];
    objectId?: string; // Associated object or null for global scripts
  }[];
  variables?: {
    id: string;
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array';
    value: string | number | boolean | null;
    scope: 'global' | 'object';
    objectId?: string; // Only set if scope is 'object'
  }[];
};
