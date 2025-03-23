
import React from 'react';
import { Sphere } from '@react-three/drei';
import { GameObject } from '@/types/project';
import * as THREE from 'three';

interface CircleProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const Circle = ({ obj, isSelected, onClick }: CircleProps) => {
  return (
    <Sphere 
      args={[(obj.radius || 1) / 50]} 
      position={[obj.x / 100, obj.y / 100, 0]} 
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={obj.color} 
        transparent 
        opacity={isSelected ? 0.8 : 1} 
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[
            new THREE.SphereGeometry((obj.radius || 1) / 50 + 0.02, 32, 16)
          ]} />
          <lineBasicMaterial attach="material" color="#ffffff" />
        </lineSegments>
      )}
    </Sphere>
  );
};

export default Circle;
