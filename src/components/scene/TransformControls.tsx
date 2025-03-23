import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls as ThreeTransformControls } from '@react-three/drei';

interface TransformControlsProps {
  object: THREE.Object3D | null;
  mode: 'translate' | 'rotate' | 'scale';
  enabled: boolean;
  onObjectChange?: () => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({
  object,
  mode,
  enabled,
  onObjectChange
}) => {
  const { camera, gl } = useThree();
  const controls = useRef<THREE.TransformControls | null>(null);

  useEffect(() => {
    const currentControls = controls.current;
    if (currentControls && onObjectChange) {
      const callback = () => onObjectChange();
      currentControls.addEventListener('objectChange', callback);
      return () => currentControls.removeEventListener('objectChange', callback);
    }
  }, [onObjectChange]);

  return (
    <ThreeTransformControls
      ref={controls}
      args={[camera, gl.domElement]}
      mode={mode}
      object={object}
      enabled={enabled}
      size={1}
      showX={enabled}
      showY={enabled}
      showZ={enabled}
      space="world"
    />
  );
};

export default TransformControls;