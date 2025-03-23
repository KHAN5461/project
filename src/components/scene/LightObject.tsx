
import React from 'react';
import { Sphere } from '@react-three/drei';
import { GameObject } from '@/types/project';

interface LightObjectProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const LightObject = ({ obj, isSelected, onClick }: LightObjectProps) => {
  return (
    <group position={[obj.x / 100, obj.y / 100, 1]} onClick={onClick}>
      <pointLight 
        color={obj.color || '#ffffff'} 
        intensity={5} 
        distance={10} 
      />
      <Sphere args={[0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color={obj.color || '#ffffff'} />
      </Sphere>
      {isSelected && (
        <>
          <Sphere args={[0.5]} position={[0, 0, 0]}>
            <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.2} />
          </Sphere>
        </>
      )}
    </group>
  );
};

export default LightObject;
