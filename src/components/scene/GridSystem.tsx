import React, { useEffect, useMemo } from 'react';
import { Grid, Line } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridSystemProps {
  visible: boolean;
  size?: number;
  divisions?: number;
  cellColor?: string;
  sectionColor?: string;
  fadeDistance?: number;
  fadeStrength?: number;
  snapThreshold?: number;
  showAxes?: boolean;
  onSnap?: (position: THREE.Vector3) => void;
}

const GridSystem: React.FC<GridSystemProps> = ({
  visible,
  size = 100,
  divisions = 100,
  cellColor = '#444444',
  sectionColor = '#888888',
  fadeDistance = 30,
  fadeStrength = 1,
  snapThreshold = 5,
  showAxes = true,
  onSnap
}) => {
  const { camera, scene, raycaster } = useThree();
  const gridSize = size / divisions;
  
  const gridHelper = useMemo(() => new THREE.GridHelper(size, divisions), [size, divisions]);
  
  useEffect(() => {
    if (visible) {
      scene.add(gridHelper);
    }
    return () => {
      if (visible) {
        scene.remove(gridHelper);
      }
    };
  }, [visible, scene, gridHelper]);

  useFrame(() => {
    if (!visible || !onSnap) return;
    
    const intersects = raycaster.intersectObject(gridHelper);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const snappedPosition = new THREE.Vector3(
        Math.round(point.x / gridSize) * gridSize,
        Math.round(point.y / gridSize) * gridSize,
        Math.round(point.z / gridSize) * gridSize
      );
      onSnap(snappedPosition);
    }
  });

  if (!visible) return null;

  return (
    <group>
      <Grid
        args={[size, size, divisions, divisions]}
        cellColor={cellColor}
        sectionColor={sectionColor}
        fadeDistance={fadeDistance}
        fadeStrength={fadeStrength}
        infiniteGrid
        position={[0, 0, 0]}
      />
      {showAxes && (
        <>
          {/* X-axis */}
          <Line
            points={[[-size/2, 0, 0], [size/2, 0, 0]]}
            color="red"
            lineWidth={2}
          />
          {/* Y-axis */}
          <Line
            points={[[0, -size/2, 0], [0, size/2, 0]]}
            color="green"
            lineWidth={2}
          />
          {/* Z-axis */}
          <Line
            points={[[0, 0, -size/2], [0, 0, size/2]]}
            color="blue"
            lineWidth={2}
          />
        </>
      )}
    </group>
  );
};

export default GridSystem;
