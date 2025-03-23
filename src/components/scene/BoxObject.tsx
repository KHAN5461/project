
import React from 'react';
import { Box } from '@react-three/drei';
import { GameObject } from '@/types/project';
import * as THREE from 'three';

interface BoxObjectProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const BoxObject = ({ obj, isSelected, onClick }: BoxObjectProps) => {
  return (
    <Box 
      args={[
        obj.width ? obj.width / 100 : 1, 
        obj.height ? obj.height / 100 : 1, 
        obj.width ? obj.width / 100 : 1
      ]} 
      position={[obj.x / 100, obj.y / 100, (obj.width || 100) / 200]} 
      rotation={obj.rotation ? [0, obj.rotation * Math.PI / 180, 0] : [0, 0, 0]}
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
            (obj.width ? obj.width / 100 : 1) + 0.05, 
            (obj.height ? obj.height / 100 : 1) + 0.05, 
            (obj.width ? obj.width / 100 : 1) + 0.05
          )]} />
          <lineBasicMaterial attach="material" color="#ffffff" />
        </lineSegments>
      )}
    </Box>
  );
};

export default BoxObject;
