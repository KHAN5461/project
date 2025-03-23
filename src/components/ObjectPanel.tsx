
import React from 'react';
import { 
  ChevronRight, Layers, Eye, EyeOff, Lock, Unlock,
  Square, Circle, Triangle, Type, Box, CopyPlus, Trash 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ObjectProps {
  id: string;
  name: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'text' | 'box';
  visible: boolean;
  locked: boolean;
  selected: boolean;
}

interface ObjectPanelProps {
  objects: ObjectProps[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicateObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
  onUpdateProperty: (id: string, property: keyof ObjectProps, value: string | number | boolean) => void;
}

const ObjectPanel: React.FC<ObjectPanelProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onToggleVisibility,
  onToggleLock,
  onDuplicateObject,
  onDeleteObject,
  onUpdateProperty
}) => {
  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'rectangle':
        return <Square className="h-4 w-4" />;
      case 'circle':
        return <Circle className="h-4 w-4" />;
      case 'triangle':
        return <Triangle className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'box':
        return <Box className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);


  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Objects</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {objects.length} items
          </Badge>
        </div>
        
        <div className="relative">
          <Input 
            placeholder="Search objects..." 
            className="pl-8"
          />
          <div className="absolute left-2.5 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {objects.map(obj => (
            <div 
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              className={cn(
                "flex items-center p-2 rounded-md cursor-pointer group",
                obj.selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                <div className="mr-2">
                  {getObjectIcon(obj.type)}
                </div>
                <span className="truncate text-sm">{obj.name}</span>
              </div>
              
              <div className={cn(
                "flex space-x-1 opacity-0",
                obj.selected ? "opacity-100" : "group-hover:opacity-100"
              )}>
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(obj.id);
                  }}
                >
                  {obj.visible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(obj.id);
                  }}
                >
                  {obj.locked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedObject && (
        <div className="border-t p-4">
          <h4 className="text-sm font-medium mb-3">Properties</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="object-name" className="text-xs">Name</Label>
                <Input 
                  id="object-name" 
                  value={selectedObject.name}
                  onChange={(e) => onUpdateProperty(selectedObject.id, 'name', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="object-type" className="text-xs">Type</Label>
                <div className="flex items-center h-8 px-3 rounded-md border bg-muted text-sm">
                  {getObjectIcon(selectedObject.type)}
                  <span className="ml-2 capitalize">{selectedObject.type}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onDuplicateObject(selectedObject.id)}
              >
                <CopyPlus className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => onDeleteObject(selectedObject.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectPanel;
