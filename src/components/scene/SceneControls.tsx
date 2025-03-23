
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TransformModeControls from './TransformModeControls';

interface SceneControlsProps {
  isPreviewing: boolean;
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale') => void;
}

const SceneControls = ({ isPreviewing, onTransformModeChange }: SceneControlsProps) => {
  const controlsRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewing) return;
      
      switch (e.key.toLowerCase()) {
        case 'v':
          onTransformModeChange('translate');
          break;
        case 'r':
          onTransformModeChange('rotate');
          break;
        case 'k':
          onTransformModeChange('scale');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewing, onTransformModeChange]);

  useFrame(() => {
    if (controlsRef.current) {
      // Additional custom controls logic can go here
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        makeDefault 
        enabled={!isPreviewing} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={2} 
        maxDistance={20}
      />
      <TransformModeControls
        enabled={!isPreviewing}
        mode="translate"
        onModeChange={onTransformModeChange}
      />
    </>
  );
};

export default SceneControls;
