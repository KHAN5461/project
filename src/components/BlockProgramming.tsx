import React, { useState, useRef, useEffect } from 'react';
import { BlockCategory, VisualBlock, BlockType } from '@/types/project';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  Play, Pause, Save, Trash, Copy, 
  MoveHorizontal, ArrowRight, Code, Variable as VariableIcon, 
  Repeat, Timer, Gamepad, MousePointer, Volume2,
  Eye, ArrowDown, RotateCw, Zap, CheckCircle
} from 'lucide-react';

type BlockProgrammingProps = {
  blocks: VisualBlock[];
  onSaveBlocks: (blocks: VisualBlock[]) => void;
  selectedObjectId?: string | null;
};

const BlockProgramming: React.FC<BlockProgrammingProps> = ({ 
  blocks, 
  onSaveBlocks,
  selectedObjectId
}) => {
  const { toast } = useToast();
  const [scriptBlocks, setScriptBlocks] = useState<VisualBlock[]>(blocks);
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('events');
  const workspaceRef = useRef<HTMLDivElement>(null);

  const blockTemplates: Record<BlockCategory, VisualBlock[]> = {
    events: [
      { id: 'template-event-1', type: 'event', x: 0, y: 0, inputs: { name: 'when clicked' }, outputConnections: [], category: 'events' },
      { id: 'template-event-2', type: 'event', x: 0, y: 0, inputs: { name: 'when game starts' }, outputConnections: [], category: 'events' },
      { id: 'template-event-3', type: 'event', x: 0, y: 0, inputs: { name: 'when key pressed' }, outputConnections: [], category: 'events' },
      { id: 'template-event-4', type: 'event', x: 0, y: 0, inputs: { name: 'when collision' }, outputConnections: [], category: 'events' },
    ],
    control: [
      { id: 'template-control-1', type: 'condition', x: 0, y: 0, inputs: { condition: 'if' }, outputConnections: [], category: 'control' },
      { id: 'template-control-2', type: 'condition', x: 0, y: 0, inputs: { condition: 'if-else' }, outputConnections: [], category: 'control' },
      { id: 'template-control-3', type: 'loop', x: 0, y: 0, inputs: { times: 10 }, outputConnections: [], category: 'control' },
      { id: 'template-control-4', type: 'loop', x: 0, y: 0, inputs: { condition: 'while' }, outputConnections: [], category: 'control' },
    ],
    operators: [
      { id: 'template-op-1', type: 'operator', x: 0, y: 0, inputs: { op: '+' }, outputConnections: [], category: 'operators' },
      { id: 'template-op-2', type: 'operator', x: 0, y: 0, inputs: { op: '-' }, outputConnections: [], category: 'operators' },
      { id: 'template-op-3', type: 'operator', x: 0, y: 0, inputs: { op: '=' }, outputConnections: [], category: 'operators' },
      { id: 'template-op-4', type: 'operator', x: 0, y: 0, inputs: { op: '>' }, outputConnections: [], category: 'operators' },
    ],
    variables: [
      { id: 'template-var-1', type: 'variable', x: 0, y: 0, inputs: { action: 'set', name: 'score' }, outputConnections: [], category: 'variables' },
      { id: 'template-var-2', type: 'variable', x: 0, y: 0, inputs: { action: 'change', name: 'lives' }, outputConnections: [], category: 'variables' },
      { id: 'template-var-3', type: 'variable', x: 0, y: 0, inputs: { action: 'get', name: 'health' }, outputConnections: [], category: 'variables' },
    ],
    motion: [
      { id: 'template-motion-1', type: 'motion', x: 0, y: 0, inputs: { action: 'move', steps: 10 }, outputConnections: [], category: 'motion' },
      { id: 'template-motion-2', type: 'motion', x: 0, y: 0, inputs: { action: 'rotate', degrees: 90 }, outputConnections: [], category: 'motion' },
      { id: 'template-motion-3', type: 'motion', x: 0, y: 0, inputs: { action: 'go to', x: 0, y: 0 }, outputConnections: [], category: 'motion' },
    ],
    looks: [
      { id: 'template-looks-1', type: 'looks', x: 0, y: 0, inputs: { action: 'set color', color: '#ff0000' }, outputConnections: [], category: 'looks' },
      { id: 'template-looks-2', type: 'looks', x: 0, y: 0, inputs: { action: 'change size', factor: 1.5 }, outputConnections: [], category: 'looks' },
      { id: 'template-looks-3', type: 'looks', x: 0, y: 0, inputs: { action: 'hide' }, outputConnections: [], category: 'looks' },
      { id: 'template-looks-4', type: 'looks', x: 0, y: 0, inputs: { action: 'show' }, outputConnections: [], category: 'looks' },
    ],
    sound: [
      { id: 'template-sound-1', type: 'sound', x: 0, y: 0, inputs: { action: 'play', sound: 'pop' }, outputConnections: [], category: 'sound' },
      { id: 'template-sound-2', type: 'sound', x: 0, y: 0, inputs: { action: 'stop' }, outputConnections: [], category: 'sound' },
      { id: 'template-sound-3', type: 'sound', x: 0, y: 0, inputs: { action: 'change volume', volume: 10 }, outputConnections: [], category: 'sound' },
    ],
    sensing: [
      { id: 'template-sensing-1', type: 'condition', x: 0, y: 0, inputs: { condition: 'touching', object: 'mouse' }, outputConnections: [], category: 'sensing' },
      { id: 'template-sensing-2', type: 'condition', x: 0, y: 0, inputs: { condition: 'keyboard', key: 'space' }, outputConnections: [], category: 'sensing' },
      { id: 'template-sensing-3', type: 'condition', x: 0, y: 0, inputs: { condition: 'distance to', object: 'player' }, outputConnections: [], category: 'sensing' },
    ],
    custom: [
      { id: 'template-custom-1', type: 'function', x: 0, y: 0, inputs: { name: 'Custom Block' }, outputConnections: [], category: 'custom' },
    ],
  };

  const handleSaveBlocks = () => {
    onSaveBlocks(scriptBlocks);
    toast({
      title: 'Script Saved',
      description: selectedObjectId ? 'Object script has been updated.' : 'Global script has been updated.',
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'block-palette') {
      const templateId = result.draggableId;
      const categoryKey = selectedCategory;
      const template = blockTemplates[categoryKey].find(t => t.id === templateId);
      
      if (template) {
        const newBlock: VisualBlock = {
          ...template,
          id: `block-${Date.now()}`,
          x: result.destination.x || 0,
          y: result.destination.y || 0,
        };
        
        setScriptBlocks([...scriptBlocks, newBlock]);
      }
    } else if (result.source.droppableId === 'block-workspace') {
      const items = Array.from(scriptBlocks);
      const [reorderedItem] = items.splice(result.source.index, 1);
      
      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        reorderedItem.x = result.destination.x - rect.left;
        reorderedItem.y = result.destination.y - rect.top;
      }
      
      items.splice(result.destination.index, 0, reorderedItem);
      setScriptBlocks(items);
    }
  };

  const handleDeleteBlock = (id: string) => {
    setScriptBlocks(scriptBlocks.filter(block => block.id !== id));
  };

  const handleDuplicateBlock = (id: string) => {
    const blockToCopy = scriptBlocks.find(block => block.id === id);
    if (blockToCopy) {
      const newBlock: VisualBlock = {
        ...blockToCopy,
        id: `block-${Date.now()}`,
        x: blockToCopy.x + 20,
        y: blockToCopy.y + 20,
        outputConnections: [],
      };
      setScriptBlocks([...scriptBlocks, newBlock]);
    }
  };

  const getCategoryIcon = (category: BlockCategory) => {
    switch (category) {
      case 'events': return <Zap className="h-4 w-4" />;
      case 'control': return <ArrowRight className="h-4 w-4" />;
      case 'operators': return <Code className="h-4 w-4" />;
      case 'variables': return <VariableIcon className="h-4 w-4" />;
      case 'motion': return <MoveHorizontal className="h-4 w-4" />;
      case 'looks': return <Eye className="h-4 w-4" />;
      case 'sound': return <Volume2 className="h-4 w-4" />;
      case 'sensing': return <MousePointer className="h-4 w-4" />;
      case 'custom': return <Gamepad className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getBlockColor = (category: BlockCategory) => {
    switch (category) {
      case 'events': return 'bg-yellow-500';
      case 'control': return 'bg-blue-500';
      case 'operators': return 'bg-green-500';
      case 'variables': return 'bg-orange-500';
      case 'motion': return 'bg-purple-500';
      case 'looks': return 'bg-pink-500';
      case 'sound': return 'bg-red-500';
      case 'sensing': return 'bg-indigo-500';
      case 'custom': return 'bg-gray-500';
      default: return 'bg-slate-500';
    }
  };

  const getBlockIcon = (type: BlockType, inputs: Record<string, any>) => {
    switch (type) {
      case 'event': return <Zap className="h-4 w-4" />;
      case 'action': return <Play className="h-4 w-4" />;
      case 'condition': return <CheckCircle className="h-4 w-4" />;
      case 'variable': return <VariableIcon className="h-4 w-4" />;
      case 'operator': return <Code className="h-4 w-4" />;
      case 'loop': return <Repeat className="h-4 w-4" />;
      case 'function': return <Code className="h-4 w-4" />;
      case 'motion': return <MoveHorizontal className="h-4 w-4" />;
      case 'looks': return <Eye className="h-4 w-4" />;
      case 'sound': return <Volume2 className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-sm font-medium">
          {selectedObjectId ? 'Object Script' : 'Global Script'}
        </h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => {
            toast({
              title: 'Running Script',
              description: 'Script is now running in preview mode.',
            });
          }}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            toast({
              title: 'Stopped Script',
              description: 'Script execution has been stopped.',
            });
          }}>
            <Pause className="h-4 w-4 mr-1" />
            Stop
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveBlocks}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-48 border-r overflow-y-auto">
          <Tabs defaultValue="events" value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as BlockCategory)}>
            <TabsList className="w-full grid grid-cols-3">
              {['events', 'motion', 'looks'].map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs py-1 h-auto">
                  {getCategoryIcon(cat as BlockCategory)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="w-full grid grid-cols-3 mt-1">
              {['control', 'variables', 'sound'].map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs py-1 h-auto">
                  {getCategoryIcon(cat as BlockCategory)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="w-full grid grid-cols-3 mt-1">
              {['operators', 'sensing', 'custom'].map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs py-1 h-auto">
                  {getCategoryIcon(cat as BlockCategory)}
                </TabsTrigger>
              ))}
            </TabsList>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="block-palette" isDropDisabled={true}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-2"
                  >
                    <h4 className="text-xs font-medium capitalize mb-2">{selectedCategory} Blocks</h4>
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-2">
                        {blockTemplates[selectedCategory].map((block, index) => (
                          <Draggable
                            key={block.id}
                            draggableId={block.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${getBlockColor(block.category)} text-white p-2 rounded text-xs cursor-grab`}
                              >
                                <div className="flex items-center">
                                  {getBlockIcon(block.type, block.inputs)}
                                  <span className="ml-2 truncate">
                                    {block.inputs.name || block.inputs.action || block.inputs.condition || block.type}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Tabs>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="block-workspace">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={(el) => {
                  provided.innerRef(el);
                  workspaceRef.current = el;
                }}
                className="flex-1 bg-secondary/20 p-4 overflow-auto relative"
                style={{ minHeight: '500px' }}
              >
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={`h-${i}`} className="border-b border-gray-200/20 col-span-12" />
                  ))}
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={`v-${i}`} className="border-r border-gray-200/20 row-span-12" />
                  ))}
                </div>

                {scriptBlocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${getBlockColor(block.category)} text-white p-3 rounded absolute shadow-md flex flex-col min-w-[180px]`}
                        style={{
                          left: `${block.x}px`,
                          top: `${block.y}px`,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getBlockIcon(block.type, block.inputs)}
                            <span className="ml-2 font-medium">
                              {block.inputs.name || block.inputs.action || block.inputs.condition || block.type}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 bg-white/10 hover:bg-white/20"
                              onClick={() => handleDuplicateBlock(block.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 bg-white/10 hover:bg-white/20"
                              onClick={() => handleDeleteBlock(block.id)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {Object.entries(block.inputs)
                          .filter(([key]) => key !== 'name' && key !== 'action' && key !== 'condition')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center mt-1 text-xs bg-black/20 p-1 rounded">
                              <span className="mr-2">{key}:</span>
                              <span className="font-mono bg-white/10 px-1 rounded">{value}</span>
                            </div>
                          ))}

                        {block.type !== 'event' && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-t-md border-2 border-gray-400"></div>
                        )}
                        
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-b-md border-2 border-gray-400"></div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BlockProgramming;
