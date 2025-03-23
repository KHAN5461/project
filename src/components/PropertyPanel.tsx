import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface PropertyPanelProps {
  selectedObject?: any;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedObject }) => {
  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No object selected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Transform</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="pos-x">X</Label>
            <Input
              id="pos-x"
              type="number"
              value={selectedObject.x}
              onChange={(e) => {}}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="pos-y">Y</Label>
            <Input
              id="pos-y"
              type="number"
              value={selectedObject.y}
              onChange={(e) => {}}
              className="h-8"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">Appearance</h4>
        <div className="space-y-2">
          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={selectedObject.width}
              onChange={(e) => {}}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={selectedObject.height}
              onChange={(e) => {}}
              className="h-8"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">Behaviors</h4>
        {/* Add behavior controls here */}
      </div>
    </div>
  );
};

export default PropertyPanel;