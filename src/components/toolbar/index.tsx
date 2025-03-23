
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ToolbarContainer from './ToolbarContainer';
import ToolbarGroup, { ToolItem } from './ToolbarGroup';
import ToolbarSettings from './ToolbarSettings';
import ToolbarEditor, { ToolbarItem as EditorToolbarItem } from '../ToolbarEditor';

interface ToolbarProps {
  onSelectTool: (tool: string) => void;
  selectedTool: string;
}

// Define tool groups for better organization
const TOOL_GROUPS = {
  basic: [
    { id: 'select', icon: 'MousePointer', label: 'Select Tool' },
    { id: 'hand', icon: 'Hand', label: 'Hand Tool (Pan)' },
    { id: 'rectangle', icon: 'Square', label: 'Rectangle Tool' },
    { id: 'circle', icon: 'Circle', label: 'Circle Tool' },
    { id: 'triangle', icon: 'Triangle', label: 'Triangle Tool' },
    { id: 'text', icon: 'Type', label: 'Text Tool' },
    { id: 'image', icon: 'Image', label: 'Image Tool' },
  ],
  transform: [
    { id: 'move', icon: 'Move', label: 'Move Tool' },
    { id: 'rotate', icon: 'RotateCcw', label: 'Rotate Tool' },
    { id: 'grid', icon: 'Grid', label: 'Toggle Grid' }
  ],
  edit: [
    { id: 'copy', icon: 'Copy', label: 'Copy Selection' },
    { id: 'cut', icon: 'Scissors', label: 'Cut Selection' },
    { id: 'hammer', icon: 'Hammer', label: 'Edit Properties' },
    { id: 'layers', icon: 'Layers', label: 'Manage Layers' }
  ],
  scripting: [
    { id: 'visual-script', icon: 'Blocks', label: 'Visual Programming Blocks' },
    { id: 'behavior', icon: 'Gamepad', label: 'Add Behaviors' },
    { id: 'event', icon: 'Code', label: 'Event Scripting' },
    { id: 'variable', icon: 'VariableIcon', label: 'Manage Variables' }
  ],
  component: [
    { id: 'component', icon: 'Component', label: 'Create Component' },
    { id: 'prefab', icon: 'LayoutList', label: 'Create Prefab' },
    { id: 'state-machine', icon: 'ScrollText', label: 'State Machine' },
  ]
};

const Toolbar: React.FC<ToolbarProps> = ({ onSelectTool, selectedTool }) => {
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<'bottom' | 'left'>('bottom');

  const handleSaveTools = (updatedTools: EditorToolbarItem[]) => {
    // In a real app, this would persist the tool configuration
    setShowEditor(false);
    
    toast({
      title: "Toolbar Customized",
      description: "Your toolbar settings have been saved.",
    });
  };

  // Get all tools for the editor
  const getAllTools = () => {
    return Object.values(TOOL_GROUPS).flat().map(tool => ({
      id: tool.id,
      name: tool.label,
      icon: tool.icon,
      label: tool.label
    }));
  };

  const renderToolGroups = () => {
    const isHorizontal = toolbarPosition === 'bottom';
    
    return (
      <>
        <ToolbarGroup 
          title="Basic Tools" 
          tools={TOOL_GROUPS.basic} 
          selectedTool={selectedTool} 
          onSelectTool={onSelectTool} 
          isHorizontal={isHorizontal} 
        />
        <ToolbarGroup 
          title="Transform Tools" 
          tools={TOOL_GROUPS.transform} 
          selectedTool={selectedTool} 
          onSelectTool={onSelectTool} 
          isHorizontal={isHorizontal} 
          showSeparator={true} 
        />
        <ToolbarGroup 
          title="Edit Tools" 
          tools={TOOL_GROUPS.edit} 
          selectedTool={selectedTool} 
          onSelectTool={onSelectTool} 
          isHorizontal={isHorizontal} 
          showSeparator={true} 
        />
        <ToolbarGroup 
          title="Scripting Tools" 
          tools={TOOL_GROUPS.scripting} 
          selectedTool={selectedTool} 
          onSelectTool={onSelectTool} 
          isHorizontal={isHorizontal} 
          showSeparator={true} 
        />
        <ToolbarGroup 
          title="Component Tools" 
          tools={TOOL_GROUPS.component} 
          selectedTool={selectedTool} 
          onSelectTool={onSelectTool} 
          isHorizontal={isHorizontal} 
          showSeparator={true} 
        />
        <ToolbarSettings 
          onOpenSettings={() => setShowEditor(true)} 
          isHorizontal={isHorizontal} 
        />
      </>
    );
  };

  return (
    <>
      <ToolbarContainer position={toolbarPosition}>
        {renderToolGroups()}
      </ToolbarContainer>
      
      {showEditor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <ToolbarEditor 
            tools={getAllTools()} 
            onSaveTools={handleSaveTools} 
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}
    </>
  );
};

export default Toolbar;
