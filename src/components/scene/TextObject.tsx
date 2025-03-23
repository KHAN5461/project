
import React from 'react';
import { Text, Billboard } from '@react-three/drei';
import { GameObject } from '@/types/project';

interface TextObjectProps {
  obj: GameObject;
  isSelected: boolean;
  onClick: () => void;
}

const TextObject = ({ obj, isSelected, onClick }: TextObjectProps) => {
  return (
    <group 
      position={[obj.x / 100, obj.y / 100, 0]} 
      rotation={obj.rotation ? [0, 0, obj.rotation * Math.PI / 180] : [0, 0, 0]}
      onClick={onClick}
    >
      <Billboard>
        <Text
          color={obj.color}
          fontSize={0.2}
          maxWidth={2}
          lineHeight={1}
          textAlign="center"
          outlineWidth={isSelected ? 0.01 : 0}
          outlineColor="white"
        >
          {obj.text || 'Text'}
        </Text>
      </Billboard>
    </group>
  );
};

export default TextObject;
