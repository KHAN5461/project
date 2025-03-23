
import React from 'react';
import { Box } from '@react-three/drei';
import { GameObject } from '@/types/project';
import * as THREE from 'three';

interface RectangleProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const Rectangle = ({ obj, isSelected, onClick }: RectangleProps) => {
  return (
    <Box 
      args={[obj.width || 1, obj.height || 1, 0.1]} 
      position={[obj.x / 100, obj.y / 100, 0]} 
      rotation={obj.rotation ? [0, 0, obj.rotation * Math.PI / 180] : [0, 0, 0]}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={obj.color} 
        transparent 
        opacity={isSelected ? 0.8 : 1} 
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(
            (obj.width || 1) + 0.05, 
            (obj.height || 1) + 0.05, 
            0.15
          )]} />
          <lineBasicMaterial attach="material" color="#ffffff" />
        </lineSegments>
      )}
    </Box>
  );
};

export default Rectangle;
