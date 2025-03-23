
import React, { useState } from 'react';
import { GameObjectBehavior, BehaviorType } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, Trash, Settings, Gamepad, Layers, 
  ArrowBigDown, Users, Clock, Send, Move
} from 'lucide-react';

interface BehaviorEditorProps {
  objectId: string;
  behaviors: GameObjectBehavior[];
  onSaveBehaviors: (behaviors: GameObjectBehavior[]) => void;
}

const BehaviorEditor: React.FC<BehaviorEditorProps> = ({
  objectId,
  behaviors,
  onSaveBehaviors
}) => {
  const { toast } = useToast();
  const [objectBehaviors, setObjectBehaviors] = useState<GameObjectBehavior[]>(behaviors);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const behaviorTemplates: Record<BehaviorType, Partial<GameObjectBehavior>> = {
    platformer: {
      type: 'platformer',
      properties: {
        gravity: 980,
        jumpForce: 500,
        maxSpeed: 300,
        acceleration: 1500,
        friction: 0.1
      },
      enabled: true
    },
    physics: {
      type: 'physics',
      properties: {
        dynamic: true,
        density: 1,
        friction: 0.5,
        restitution: 0.2,
        fixedRotation: false
      },
      enabled: true
    },
    draggable: {
      type: 'draggable',
      properties: {
        constrainToParent: true,
        dampingFactor: 0.85,
        snapToGrid: false,
        gridSize: 10
      },
      enabled: true
    },
    tween: {
      type: 'tween',
      properties: {
        property: 'position',
        duration: 1000,
        easing: 'linear',
        autoStart: false,
        repeat: 0,
        yoyo: false
      },
      enabled: true
    },
    pathfinding: {
      type: 'pathfinding',
      properties: {
        speed: 200,
        algorithm: 'a-star',
        avoidObstacles: true,
        updateRate: 0.5
      },
      enabled: true
    },
    timer: {
      type: 'timer',
      properties: {
        duration: 1000,
        autoStart: false,
        loop: false,
        onComplete: ''
      },
      enabled: true
    },
    state: {
      type: 'state',
      properties: {
        initialState: 'idle',
        states: {
          idle: { next: ['walking', 'jumping'] },
          walking: { next: ['idle', 'jumping'] },
          jumping: { next: ['idle'] }
        }
      },
      enabled: true
    },
    custom: {
      type: 'custom',
      properties: {
        name: 'Custom Behavior',
        script: ''
      },
      enabled: true
    }
  };

  const addBehavior = (type: BehaviorType) => {
    const template = behaviorTemplates[type];
    const newBehavior: GameObjectBehavior = {
      id: `behavior-${Date.now()}`,
      ...template as GameObjectBehavior
    };
    
    setObjectBehaviors([...objectBehaviors, newBehavior]);
    setShowAddDialog(false);
    
    toast({
      title: 'Behavior Added',
      description: `Added ${type} behavior to object.`,
    });
  };

  const removeBehavior = (id: string) => {
    setObjectBehaviors(objectBehaviors.filter(b => b.id !== id));
    
    toast({
      title: 'Behavior Removed',
      description: 'Removed behavior from object.',
    });
  };

  const toggleBehavior = (id: string, enabled: boolean) => {
    setObjectBehaviors(objectBehaviors.map(b => 
      b.id === id ? { ...b, enabled } : b
    ));
  };

  const updateBehaviorProperty = (behaviorId: string, property: string, value: any) => {
    setObjectBehaviors(objectBehaviors.map(b => {
      if (b.id === behaviorId) {
        return {
          ...b,
          properties: {
            ...b.properties,
            [property]: value
          }
        };
      }
      return b;
    }));
  };

  const handleSaveBehaviors = () => {
    onSaveBehaviors(objectBehaviors);
    
    toast({
      title: 'Behaviors Saved',
      description: 'Object behaviors have been saved.',
    });
  };

  const getBehaviorIcon = (type: BehaviorType) => {
    switch (type) {
      case 'platformer': return <Gamepad />;
      case 'physics': return <ArrowBigDown />;
      case 'draggable': return <Move />;
      case 'tween': return <Send />;
      case 'pathfinding': return <Users />;
      case 'timer': return <Clock />;
      case 'state': return <Layers />;
      case 'custom': return <Settings />;
      default: return <Settings />;
    }
  };

  const renderPropertyControl = (behavior: GameObjectBehavior, propName: string, propValue: any) => {
    if (typeof propValue === 'boolean') {
      return (
        <Switch 
          checked={propValue} 
          onCheckedChange={(checked) => updateBehaviorProperty(behavior.id, propName, checked)}
        />
      );
    } else if (typeof propValue === 'number') {
      return (
        <Input 
          type="number" 
          value={propValue} 
          onChange={(e) => updateBehaviorProperty(behavior.id, propName, parseFloat(e.target.value))}
          className="h-8"
        />
      );
    } else if (typeof propValue === 'string') {
      return (
        <Input 
          type="text" 
          value={propValue} 
          onChange={(e) => updateBehaviorProperty(behavior.id, propName, e.target.value)}
          className="h-8"
        />
      );
    } else if (typeof propValue === 'object' && propValue !== null) {
      // For complex objects, just show a button to edit
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast({
              title: 'Complex Property',
              description: 'Complex property editing not implemented in this demo.',
            });
          }}
        >
          Edit Object
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-sm font-medium">Behaviors</h2>
        <div className="flex space-x-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Behavior
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Behavior</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(Object.keys(behaviorTemplates) as BehaviorType[]).map((type) => (
                  <Button 
                    key={type} 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-24 text-center"
                    onClick={() => addBehavior(type)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      {React.cloneElement(getBehaviorIcon(type), { className: "h-5 w-5 text-primary" })}
                    </div>
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="default" size="sm" onClick={handleSaveBehaviors}>
            Save
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {objectBehaviors.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              <Gamepad className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>No behaviors added yet.</p>
              <p className="text-sm">Add behaviors to make your object interactive.</p>
            </div>
          ) : (
            objectBehaviors.map((behavior) => (
              <div key={behavior.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-secondary/30 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {React.cloneElement(getBehaviorIcon(behavior.type), { className: "h-4 w-4 text-primary" })}
                    </div>
                    <span className="font-medium capitalize">{behavior.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Enabled</span>
                      <Switch 
                        checked={behavior.enabled} 
                        onCheckedChange={(checked) => toggleBehavior(behavior.id, checked)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeBehavior(behavior.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(behavior.properties).map(([propName, propValue]) => (
                      <div key={propName} className="space-y-1">
                        <Label htmlFor={`${behavior.id}-${propName}`} className="text-xs capitalize">
                          {propName.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <div id={`${behavior.id}-${propName}`}>
                          {renderPropertyControl(behavior, propName, propValue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BehaviorEditor;
