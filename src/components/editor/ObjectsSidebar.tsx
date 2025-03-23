
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash, Music, Boxes } from 'lucide-react';
import { GameObject } from '@/types/project';

interface ObjectsSidebarProps {
  objects: GameObject[];
  selectedObject: string | null;
  activePanel: string;
  setActivePanel: (panel: any) => void;
  onSelectObject: (id: string) => void;
  onCreateObject: (type: GameObject['type'], x: number, y: number) => void;
  onDeleteObject: (id: string) => void;
}

const ObjectsSidebar: React.FC<ObjectsSidebarProps> = ({
  objects,
  selectedObject,
  activePanel,
  setActivePanel,
  onSelectObject,
  onCreateObject,
  onDeleteObject
}) => {
  return (
    <div className="w-80 border-l bg-card flex flex-col">
      <Tabs 
        defaultValue="objects" 
        className="flex flex-col h-full"
        value={activePanel}
        onValueChange={(value) => setActivePanel(value as any)}
      >
        <TabsList className="mx-4 mt-4 w-auto grid grid-cols-5">
          <TabsTrigger value="objects" className="relative">
            <Boxes className="h-4 w-4" />
            <span className="sr-only">Objects</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {objects.length}
            </div>
          </TabsTrigger>
          <TabsTrigger value="scripts">
            <Music className="h-4 w-4" />
            <span className="sr-only">Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Music className="h-4 w-4" />
            <span className="sr-only">Assets</span>
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Music className="h-4 w-4" />
            <span className="sr-only">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Music className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="objects" className="flex-1 pt-2 flex flex-col">
          <div className="px-4 mb-2 flex">
            <Button
              variant="outline"
              onClick={() => {
                onCreateObject('rectangle', 200, 200);
              }}
              className="flex-1 mr-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Object
            </Button>
            <Button
              variant="destructive"
              disabled={!selectedObject}
              onClick={() => selectedObject && onDeleteObject(selectedObject)}
              className="flex-shrink-0"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Scene Objects</h3>
            <div className="space-y-2">
              {objects.map(obj => (
                <div 
                  key={obj.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedObject === obj.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => onSelectObject(obj.id)}
                >
                  <div className="flex items-center">
                    {obj.type === 'rectangle' && <div className="w-4 h-4 bg-primary/70 rounded mr-2" />}
                    {obj.type === 'circle' && <div className="w-4 h-4 bg-primary/70 rounded-full mr-2" />}
                    {obj.type === 'text' && <div className="w-4 h-4 border border-primary/70 flex items-center justify-center text-xs rounded mr-2">T</div>}
                    {obj.type === 'triangle' && <div className="w-4 h-4 relative mr-2"><div className="absolute inset-0 border-b-[0.25rem] border-l-[0.125rem] border-r-[0.125rem] border-primary/70 border-solid" style={{ borderBottomColor: 'currentcolor', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div></div>}
                    {obj.type === 'box' && <div className="w-4 h-4 bg-primary/70 mr-2" style={{ transform: 'perspective(200px) rotateY(45deg) rotateX(45deg)' }}></div>}
                    {obj.type === 'model' && <Boxes className="w-4 h-4 text-primary/70 mr-2" />}
                    {obj.type === 'light' && <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2" style={{ boxShadow: '0 0 5px 2px rgba(250, 204, 21, 0.7)' }} />}
                    {obj.type === 'sound' && <Music className="w-4 h-4 text-primary/70 mr-2" />}
                    <span className="capitalize">{obj.type}</span>
                    <span className="text-xs text-muted-foreground ml-2">#{obj.id.slice(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {selectedObject && (
            <div className="border-t p-4">
              <h3 className="text-sm font-medium mb-2">Properties</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary p-2 rounded">
                    <span className="text-muted-foreground block text-xs">Position X</span>
                    <span className="font-mono">
                      {objects.find(o => o.id === selectedObject)?.x}px
                    </span>
                  </div>
                  <div className="bg-secondary p-2 rounded">
                    <span className="text-muted-foreground block">Position Y</span>
                    <span className="font-mono">
                      {objects.find(o => o.id === selectedObject)?.y}px
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectsSidebar;
