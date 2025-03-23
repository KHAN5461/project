import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GameObject } from '@/types/project';
import FloatingToolbar from './toolbar/FloatingToolbar';
import { useFloatingToolbar } from '@/hooks/useFloatingToolbar';
import { 
  Rectangle, 
  Circle, 
  TextObject, 
  BoxObject, 
  TriangleObject, 
  LightObject,
  SceneControls,
  GridSystem
} from './scene';
import { TransformControls } from '@react-three/drei';

interface SceneProps {
  objects: GameObject[];
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
  showGrid: boolean;
  isPreviewing: boolean;
  onObjectChange?: () => void;
  selectedTool: string;
  onSelectTool: (tool: string) => void;
}

// Main scene component
const Scene: React.FC<SceneProps> = ({ 
  objects, 
  selectedObject, 
  onSelectObject, 
  showGrid, 
  isPreviewing,
  onObjectChange,
  selectedTool,
  onSelectTool
}) => {
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [error, setError] = useState<string | null>(null);
  const selectedObjectRef = useRef<THREE.Object3D>();
  const selectedElements = selectedObject && selectedObjectRef.current ? [selectedObjectRef.current] : [];
  
  // Validate transform mode changes with enhanced error handling
  useEffect(() => {
    try {
      if (!['translate', 'rotate', 'scale'].includes(transformMode)) {
        throw new Error(`Invalid transform mode: ${transformMode}`);
      }
      if (selectedObject && !selectedObjectRef.current) {
        throw new Error('Selected object reference is not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setTransformMode('translate'); // Reset to default mode
    }
  }, [transformMode, selectedObject]);

  // Update selected object reference when selection changes
  useEffect(() => {
    if (selectedObject && selectedObjectRef.current) {
      selectedObjectRef.current.userData.id = selectedObject;
    }
  }, [selectedObject]);

  // Initialize floating toolbar
  const { isVisible } = useFloatingToolbar({
    selectedElements,
    toolbarWidth: 320,
    toolbarHeight: 40
  });

  // Clear error state when selection changes
  useEffect(() => {
    setError(null);
  }, [selectedObject]);

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
      {isVisible && (
        <FloatingToolbar
          selectedElements={selectedElements}
          onSelectTool={onSelectTool}
          selectedTool={selectedTool}
        />
      )}
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: '#1a2035' }}
        gl={{ preserveDrawingBuffer: true }}
      >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      <SceneControls 
        isPreviewing={isPreviewing} 
        onTransformModeChange={setTransformMode}
      />
      <GridSystem 
        visible={showGrid}
        size={100}
        divisions={100}
        cellColor="#444444"
        sectionColor="#888888"
        fadeDistance={30}
        fadeStrength={1}
        snapThreshold={5}
        showAxes={true}
      />
      
      <Environment preset="city" />
      
      {selectedObject && selectedObjectRef.current && !error && (
        <TransformControls
          object={selectedObjectRef.current as THREE.Object3D}
          mode={transformMode}
          enabled={!isPreviewing}
          onObjectChange={() => {
            try {
              onObjectChange?.();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Transform operation failed');
              setTransformMode('translate');
            }
          }}
        />
      )}
      
      {/* Game objects */}
      {objects.map((obj) => {
        const isSelected = obj.id === selectedObject;
        
        switch (obj.type) {
          case 'rectangle':
            return (
              <Rectangle 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          case 'circle':
            return (
              <Circle 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          case 'text':
            return (
              <TextObject 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          case 'triangle':
            return (
              <TriangleObject 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          case 'box':
            return (
              <BoxObject 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          case 'light':
            return (
              <LightObject 
                key={obj.id} 
                obj={obj} 
                isSelected={isSelected} 
                onClick={() => onSelectObject(obj.id)} 
              />
            );
          default:
            return null;
        }
      })}
    </Canvas>
    </>
  );
};

export default Scene;

