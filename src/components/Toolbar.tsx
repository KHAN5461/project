import React, { useState } from 'react';
import { 
  MousePointer, Square, Circle, Type, Image, 
  Triangle, Box, Grid, Move, RotateCcw, Hand,
  Hammer, Copy, Scissors, Layers, Pencil,
  Gamepad, Code, Play, Variable as VariableIcon, Blocks, Timer,
  LayoutList, Component, ScrollText, Edit, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import ToolbarEditor, { ToolbarItem as EditorToolbarItem } from './ToolbarEditor';
import { useToast } from '@/components/ui/use-toast';

interface ToolbarProps {
  onSelectTool: (tool: string) => void;
  selectedTool: string;
}

// Define a type for toolbar item for better type safety
export type ToolbarItem = {
  id: string;
  icon: string;
  label: string;
};

const Toolbar: React.FC<ToolbarProps> = ({ onSelectTool, selectedTool }) => {
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<'bottom' | 'left'>('bottom');

  // Default tools organized by category
  const tools = [
    { id: 'select', icon: 'MousePointer', label: 'Select Tool' },
    { id: 'hand', icon: 'Hand', label: 'Hand Tool (Pan)' },
    { id: 'rectangle', icon: 'Square', label: 'Rectangle Tool' },
    { id: 'circle', icon: 'Circle', label: 'Circle Tool' },
    { id: 'triangle', icon: 'Triangle', label: 'Triangle Tool' },
    { id: 'text', icon: 'Type', label: 'Text Tool' },
    { id: 'image', icon: 'Image', label: 'Image Tool' },
  ];

  const transformTools = [
    { id: 'move', icon: 'Move', label: 'Move Tool' },
    { id: 'rotate', icon: 'RotateCcw', label: 'Rotate Tool' },
    { id: 'grid', icon: 'Grid', label: 'Toggle Grid' }
  ];

  const editTools = [
    { id: 'copy', icon: 'Copy', label: 'Copy Selection' },
    { id: 'cut', icon: 'Scissors', label: 'Cut Selection' },
    { id: 'hammer', icon: 'Hammer', label: 'Edit Properties' },
    { id: 'layers', icon: 'Layers', label: 'Manage Layers' }
  ];
  
  // Visual programming tools
  const scriptingTools = [
    { id: 'visual-script', icon: 'Blocks', label: 'Visual Programming Blocks' },
    { id: 'behavior', icon: 'Gamepad', label: 'Add Behaviors' },
    { id: 'event', icon: 'Code', label: 'Event Scripting' },
    { id: 'variable', icon: 'VariableIcon', label: 'Manage Variables' }
  ];
  
  // Component tools
  const componentTools = [
    { id: 'component', icon: 'Component', label: 'Create Component' },
    { id: 'prefab', icon: 'LayoutList', label: 'Create Prefab' },
    { id: 'state-machine', icon: 'ScrollText', label: 'State Machine' },
  ];

  // Get the icon component based on its name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.FC<any>> = {
      MousePointer, Square, Circle, Type, Image, Triangle, Box, Grid, 
      Move, RotateCcw, Hand, Hammer, Copy, Scissors, Layers, Pencil,
      Gamepad, Code, Play, VariableIcon, Blocks, Timer, LayoutList, 
      Component, ScrollText
    };
    
    return iconMap[iconName] || MousePointer;
  };

  const handleSaveTools = (updatedTools: EditorToolbarItem[]) => {
    toast({
      title: "Toolbar Customized",
      description: "Your toolbar settings have been saved.",
    });
  };

  const renderToolbar = () => {
    const toolGroups = [
      { title: "Basic Tools", tools },
      { title: "Transform Tools", tools: transformTools },
      { title: "Edit Tools", tools: editTools },
      { title: "Scripting Tools", tools: scriptingTools },
      { title: "Component Tools", tools: componentTools }
    ];

    const positionClasses = toolbarPosition === 'bottom' 
      ? "fixed bottom-6 left-1/2 -translate-x-1/2 flex-row rounded-xl p-1.5" 
      : "fixed top-1/2 left-6 -translate-y-1/2 flex-col rounded-xl p-1.5";

    return (
      <TooltipProvider delayDuration={300}>
        <div className={`glass shadow-glass ${positionClasses} z-10`}>
          {toolbarPosition === 'bottom' ? (
            // Horizontal layout for bottom position
            <div className="flex items-center space-x-1">
              {toolGroups.flatMap((group, groupIndex) => [
                groupIndex > 0 && <Separator key={`sep-${groupIndex}`} orientation="vertical" className="h-9 mx-1" />,
                ...group.tools.map((tool) => {
                  const IconComponent = getIconComponent(tool.icon);
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === tool.id ? "secondary" : "ghost"}
                          size="icon"
                          className="h-9 w-9 rounded-lg"
                          onClick={() => onSelectTool(tool.id)}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="sr-only">{tool.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{tool.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              ]).filter(Boolean)}

              {/* Edit toolbar button */}
              <Separator orientation="vertical" className="h-9 mx-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setShowEditor(true)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Customize Toolbar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Customize Toolbar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            // Vertical layout for left position (original)
            <>
              {toolGroups.map((group, groupIndex) => (
                <React.Fragment key={group.title}>
                  {groupIndex > 0 && <Separator className="my-1" />}
                  {group.tools.map((tool) => {
                    const IconComponent = getIconComponent(tool.icon);
                    return (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={selectedTool === tool.id ? "secondary" : "ghost"}
                            size="icon"
                            className="h-9 w-9 rounded-lg"
                            onClick={() => onSelectTool(tool.id)}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="sr-only">{tool.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{tool.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Edit toolbar button */}
              <Separator className="my-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setShowEditor(true)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Customize Toolbar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Customize Toolbar</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </TooltipProvider>
    );
  };

  return (
    <>
      {renderToolbar()}
      
      {showEditor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <ToolbarEditor 
            tools={[...tools, ...transformTools, ...editTools, ...scriptingTools, ...componentTools].map(tool => ({
              id: tool.id,
              name: tool.label,
              icon: tool.icon,
              label: tool.label
            }))} 
            onSaveTools={handleSaveTools} 
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}
    </>
  );
};

export default Toolbar;
