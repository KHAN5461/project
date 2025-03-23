import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp, Box, Move } from 'lucide-react';

interface PlatformerProperties {
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
  hasCollision: boolean;
  isKinematic: boolean;
  mass: number;
}

interface PlatformerToolsProps {
  onPropertiesChange: (properties: PlatformerProperties) => void;
  initialProperties?: Partial<PlatformerProperties>;
}

const defaultProperties: PlatformerProperties = {
  gravity: 9.81,
  jumpForce: 5,
  moveSpeed: 5,
  hasCollision: true,
  isKinematic: false,
  mass: 1
};

const PlatformerTools: React.FC<PlatformerToolsProps> = ({
  onPropertiesChange,
  initialProperties = {}
}) => {
  const [properties, setProperties] = useState<PlatformerProperties>({
    ...defaultProperties,
    ...initialProperties
  });

  const handlePropertyChange = <K extends keyof PlatformerProperties>(
    key: K,
    value: PlatformerProperties[K]
  ) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onPropertiesChange(newProperties);
  };

  return (
    <div className="p-4 border rounded-lg bg-card space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="hasCollision">Enable Collision</Label>
        <Switch
          id="hasCollision"
          checked={properties.hasCollision}
          onCheckedChange={(checked) => handlePropertyChange('hasCollision', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isKinematic">Kinematic Object</Label>
        <Switch
          id="isKinematic"
          checked={properties.isKinematic}
          onCheckedChange={(checked) => handlePropertyChange('isKinematic', checked)}
        />
      </div>

      <div className="space-y-2">
        <Label>Gravity</Label>
        <div className="flex items-center gap-2">
          <ArrowDown className="h-4 w-4" />
          <Slider
            value={[properties.gravity]}
            onValueChange={(value) => handlePropertyChange('gravity', value[0])}
            min={0}
            max={20}
            step={0.1}
            className="flex-1"
          />
          <Input
            type="number"
            value={properties.gravity}
            onChange={(e) => handlePropertyChange('gravity', parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Jump Force</Label>
        <div className="flex items-center gap-2">
          <ArrowUp className="h-4 w-4" />
          <Slider
            value={[properties.jumpForce]}
            onValueChange={(value) => handlePropertyChange('jumpForce', value[0])}
            min={0}
            max={20}
            step={0.1}
            className="flex-1"
          />
          <Input
            type="number"
            value={properties.jumpForce}
            onChange={(e) => handlePropertyChange('jumpForce', parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Move Speed</Label>
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <Slider
            value={[properties.moveSpeed]}
            onValueChange={(value) => handlePropertyChange('moveSpeed', value[0])}
            min={0}
            max={20}
            step={0.1}
            className="flex-1"
          />
          <Input
            type="number"
            value={properties.moveSpeed}
            onChange={(e) => handlePropertyChange('moveSpeed', parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mass</Label>
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4" />
          <Slider
            value={[properties.mass]}
            onValueChange={(value) => handlePropertyChange('mass', value[0])}
            min={0.1}
            max={10}
            step={0.1}
            className="flex-1"
          />
          <Input
            type="number"
            value={properties.mass}
            onChange={(e) => handlePropertyChange('mass', parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformerTools;