
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X, GripVertical, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export type ToolbarItem = {
  id: string;
  name: string;
  icon: string;
  label?: string;
};

type ToolbarEditorProps = {
  tools: ToolbarItem[];
  onSaveTools: (tools: ToolbarItem[]) => void;
  onClose: () => void;
};

const availableIcons = [
  'MousePointer', 'Square', 'Circle', 'Type', 'Image', 
  'Triangle', 'Box', 'Grid', 'Move', 'RotateCcw', 
  'Hand', 'Hammer', 'Copy', 'Scissors', 'Layers', 
  'Pencil', 'Gamepad', 'Code', 'Play', 'VariableIcon', 
  'Blocks', 'Timer', 'LayoutList', 'Component', 'ScrollText'
];

const ToolbarEditor = ({ tools, onSaveTools, onClose }: ToolbarEditorProps) => {
  const [items, setItems] = useState<ToolbarItem[]>(tools);
  const [toolbarPosition, setToolbarPosition] = useState<'bottom' | 'left'>('bottom');
  const [activeTab, setActiveTab] = useState('layout');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setItems(newItems);
  };

  const handleAddTool = () => {
    const newTool: ToolbarItem = {
      id: `tool-${Date.now()}`,
      name: 'New Tool',
      icon: 'Square',
      label: 'New Tool',
    };
    
    setItems([...items, newTool]);
  };
  
  const handleRemoveTool = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleUpdateToolName = (id: string, name: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, name, label: name } : item
    ));
  };

  const handleUpdateToolIcon = (id: string, icon: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, icon } : item
    ));
  };
  
  const handleSave = () => {
    const itemsWithLabel = items.map(item => ({
      ...item,
      label: item.label || item.name
    }));
    onSaveTools(itemsWithLabel);
    onClose();
  };

  return (
    <div className="p-4 bg-background border rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Customize Toolbar</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="mb-4" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layout">Layout & Position</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === 'layout' && (
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Toolbar Position</h3>
            <div className="flex items-center space-x-4">
              <div 
                className={`border rounded-md p-2 cursor-pointer flex justify-center ${toolbarPosition === 'bottom' ? 'border-primary' : ''}`}
                onClick={() => setToolbarPosition('bottom')}
              >
                <ArrowDown className="h-5 w-5" />
                <span className="ml-2">Bottom</span>
              </div>
              <div 
                className={`border rounded-md p-2 cursor-pointer flex justify-center ${toolbarPosition === 'left' ? 'border-primary' : ''}`}
                onClick={() => setToolbarPosition('left')}
              >
                <ArrowRight className="h-5 w-5" />
                <span className="ml-2">Left</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose where to display the toolbar in the editor.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="toolbar-auto-hide" />
              <Label htmlFor="toolbar-auto-hide">Auto-hide toolbar when not in use</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Toolbar will automatically hide after a period of inactivity.
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'tools' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop to reorder tools, or add and remove tools as needed.
            </p>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="toolbar-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 mb-4 max-h-[300px] overflow-y-auto"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center space-x-2 p-2 bg-secondary rounded-md"
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            value={item.name}
                            onChange={(e) => handleUpdateToolName(item.id, e.target.value)}
                            className="h-8 flex-1"
                          />
                          <Select 
                            value={item.icon} 
                            onValueChange={(value) => handleUpdateToolIcon(item.id, value)}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <SelectValue placeholder="Icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTool(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <Button variant="outline" size="sm" onClick={handleAddTool} className="mb-4">
            <Plus className="h-4 w-4 mr-1" />
            Add Tool
          </Button>
        </>
      )}
      
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="default" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ToolbarEditor;
