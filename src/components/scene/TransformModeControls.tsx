import React from 'react';
import { Button } from '@/components/ui/button';
import { Move, RotateCw, Maximize2 } from 'lucide-react';

interface TransformModeControlsProps {
  mode: 'translate' | 'rotate' | 'scale';
  onModeChange: (mode: 'translate' | 'rotate' | 'scale') => void;
  enabled?: boolean;
}

const TransformModeControls: React.FC<TransformModeControlsProps> = ({
  mode,
  onModeChange,
  enabled = true
}) => {
  return (
    <div className="absolute top-4 left-4 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-sm">
      <Button
        size="icon"
        variant={mode === 'translate' ? 'default' : 'ghost'}
        onClick={() => onModeChange('translate')}
        disabled={!enabled}
        title="Move (V)"
      >
        <Move className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={mode === 'rotate' ? 'default' : 'ghost'}
        onClick={() => onModeChange('rotate')}
        disabled={!enabled}
        title="Rotate (R)"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={mode === 'scale' ? 'default' : 'ghost'}
        onClick={() => onModeChange('scale')}
        disabled={!enabled}
        title="Scale (K)"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TransformModeControls;