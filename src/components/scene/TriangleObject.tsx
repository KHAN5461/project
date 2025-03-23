
import React from 'react';
import { GameObject } from '@/types/project';
import * as THREE from 'three';

interface TriangleObjectProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const TriangleObject = ({ obj, isSelected, onClick }: TriangleObjectProps) => {
  // Create a triangle geometry
  const triangleShape = new THREE.Shape();
  const width = (obj.width || 100) / 100;
  const height = (obj.height || 100) / 100;
  
  triangleShape.moveTo(0, height / 2);
  triangleShape.lineTo(-width / 2, -height / 2);
  triangleShape.lineTo(width / 2, -height / 2);
  triangleShape.lineTo(0, height / 2);
  
  const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
  
  return (
    <group
      position={[obj.x / 100, obj.y / 100, 0]} 
      rotation={obj.rotation ? [0, 0, obj.rotation * Math.PI / 180] : [0, 0, 0]}
      onClick={onClick}
    >
      <mesh geometry={triangleGeometry}>
        <meshStandardMaterial 
          color={obj.color} 
          transparent 
          opacity={isSelected ? 0.8 : 1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isSelected && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[triangleGeometry]} />
          <lineBasicMaterial attach="material" color="#ffffff" />
        </lineSegments>
      )}
    </group>
  );
};

export default TriangleObject;
