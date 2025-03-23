import React from 'react';
import { GameObject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PlatformerControlsProps {
  object: GameObject;
  onUpdateObject: (object: GameObject) => void;
}

const PlatformerControls: React.FC<PlatformerControlsProps> = ({ object, onUpdateObject }) => {
  const platformerBehavior = object.behaviors?.find(b => b.type === 'platformer');
  const physics = object.physics || {};

  const handlePhysicsChange = (updates: Partial<typeof physics>) => {
    onUpdateObject({
      ...object,
      physics: { ...physics, ...updates }
    });
  };

  const handleBehaviorToggle = (enabled: boolean) => {
    if (enabled && !platformerBehavior) {
      onUpdateObject({
        ...object,
        behaviors: [...(object.behaviors || []), { id: crypto.randomUUID(), type: 'platformer', properties: {
          gravity: 0.5,
          jumpForce: -10,
          moveSpeed: 5,
          groundFriction: 0.8,
          airControl: 0.3,
          maxFallSpeed: 15
        }, enabled: true }]
      });
    } else if (!enabled && platformerBehavior) {
      onUpdateObject({
        ...object,
        behaviors: object.behaviors?.filter(b => b.type !== 'platformer') || []
      });
    }
  };

  const handlePropertyChange = (property: string, value: number) => {
    if (!platformerBehavior) return;

    onUpdateObject({
      ...object,
      behaviors: object.behaviors?.map(b =>
        b.type === 'platformer' ? {
          ...b,
          properties: { ...b.properties, [property]: value }
        } : b
      )
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="platformer-toggle">Platformer Behavior</Label>
        <Switch
          id="platformer-toggle"
          checked={!!platformerBehavior}
          onCheckedChange={handleBehaviorToggle}
        />
      </div>

      {platformerBehavior && (
        <>
          <div className="space-y-2">
            <Label>Gravity</Label>
            <Slider
              value={[platformerBehavior.properties.gravity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handlePropertyChange('gravity', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Jump Force</Label>
            <Slider
              value={[Math.abs(platformerBehavior.properties.jumpForce)]}
              min={0}
              max={20}
              step={0.5}
              onValueChange={([value]) => handlePropertyChange('jumpForce', -value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Move Speed</Label>
            <Slider
              value={[platformerBehavior.properties.moveSpeed]}
              min={0}
              max={10}
              step={0.5}
              onValueChange={([value]) => handlePropertyChange('moveSpeed', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ground Friction</Label>
            <Slider
              value={[platformerBehavior.properties.groundFriction]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([value]) => handlePropertyChange('groundFriction', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Air Control</Label>
            <Slider
              value={[platformerBehavior.properties.airControl]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([value]) => handlePropertyChange('airControl', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Fall Speed</Label>
            <Slider
              value={[platformerBehavior.properties.maxFallSpeed]}
              min={5}
              max={30}
              step={1}
              onValueChange={([value]) => handlePropertyChange('maxFallSpeed', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Static Object</Label>
            <Switch
              checked={physics.isStatic || false}
              onCheckedChange={(checked) => handlePhysicsChange({ isStatic: checked })}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformerControls;