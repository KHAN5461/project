
import React from 'react';
import { GameObject } from '@/types/project';
import { useTexture } from '@react-three/drei';

interface ImageObjectProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const ImageObject: React.FC<ImageObjectProps> = ({ obj, isSelected, onClick }) => {
  // Default texture if none provided
  const texture = useTexture("/placeholder.svg");

  return (
    <mesh
      position={[obj.x / 100, obj.y / 100, 0]}
      rotation={obj.rotation ? [0, 0, obj.rotation * Math.PI / 180] : [0, 0, 0]}
      onClick={onClick}
      scale={[1, 1, 1]}
    >
      <planeGeometry args={[(obj.width || 100) / 100, (obj.height || 100) / 100]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true}
        opacity={0.9}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry((obj.width || 100) / 100, (obj.height || 100) / 100)]} />
          <lineBasicMaterial color="white" />
        </lineSegments>
      )}
    </mesh>
  );
};

export default ImageObject;
