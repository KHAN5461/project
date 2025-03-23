import React from 'react';
import { useTransform } from '@/hooks/useTransform';
import { useObjectGroup } from '@/hooks/useObjectGroup';
import { useSnap } from '@/hooks/useSnap';
import { useHistory } from '@/hooks/useHistory';
import { GameObject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { AlignLeft, AlignCenter, AlignRight, AlignTop, AlignMiddle, AlignBottom, Grid, Lock, Unlock } from 'lucide-react';

interface ObjectControlsProps {
  objects: GameObject[];
  onUpdateObjects: (objects: GameObject[]) => void;
}

const ObjectControls: React.FC<ObjectControlsProps> = ({ objects, onUpdateObjects }) => {
  const {
    selectedObjects,
    transformMode,
    transformState,
    selectObjects,
    addToSelection,
    removeFromSelection,
    clearSelection,
    setTransformMode,
    setTransformState,
    updateTransform,
    alignObjects
  } = useTransform();

  const {
    groupedObjects,
    createGroup,
    removeGroup,
    distributeObjects
  } = useObjectGroup();

  const {
    settings: snapSettings,
    setSettings: setSnapSettings,
    guides,
    calculateSnapPosition
  } = useSnap();

  const {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory({ objects, selectedObjects });

  const handleTransform = (updates: Partial<typeof transformState>) => {
    const updatedObjects = updateTransform(objects, updates);
    onUpdateObjects(updatedObjects);
    pushState({ objects: updatedObjects, selectedObjects });
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const alignedObjects = alignObjects(objects, alignment);
    onUpdateObjects(alignedObjects);
    pushState({ objects: alignedObjects, selectedObjects });
  };

  const handleDistribute = (type: 'horizontal' | 'vertical' | 'grid') => {
    const distributedObjects = distributeObjects(objects, selectedObjects, type, { x: 20, y: 20 });
    onUpdateObjects(distributedObjects);
    pushState({ objects: distributedObjects, selectedObjects });
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTransformMode('move')}
          className={transformMode === 'move' ? 'bg-primary/20' : ''}
        >
          Move
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTransformMode('rotate')}
          className={transformMode === 'rotate' ? 'bg-primary/20' : ''}
        >
          Rotate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTransformMode('scale')}
          className={transformMode === 'scale' ? 'bg-primary/20' : ''}
        >
          Scale
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Position X</label>
          <Input
            type="number"
            value={transformState.position.x}
            onChange={(e) => handleTransform({ position: { ...transformState.position, x: parseFloat(e.target.value) } })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Position Y</label>
          <Input
            type="number"
            value={transformState.position.y}
            onChange={(e) => handleTransform({ position: { ...transformState.position, y: parseFloat(e.target.value) } })}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Rotation</label>
        <Slider
          value={[transformState.rotation]}
          min={0}
          max={360}
          step={1}
          onValueChange={([value]) => handleTransform({ rotation: value })}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => handleAlign('left')}>
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAlign('center')}>
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAlign('right')}>
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAlign('top')}>
          <AlignTop className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAlign('middle')}>
          <AlignMiddle className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAlign('bottom')}>
          <AlignBottom className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => handleDistribute('horizontal')}>
          Distribute H
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDistribute('vertical')}>
          Distribute V
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDistribute('grid')}>
          <Grid className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
          Redo
        </Button>
      </div>
    </div>
  );
};

export default ObjectControls;