
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ToolbarItem from './ToolbarItem';

export interface ToolItem {
  id: string;
  icon: string;
  label: string;
}

interface ToolbarGroupProps {
  title: string;
  tools: ToolItem[];
  selectedTool: string;
  onSelectTool: (tool: string) => void;
  isHorizontal?: boolean;
  showSeparator?: boolean;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ 
  title, 
  tools, 
  selectedTool, 
  onSelectTool, 
  isHorizontal = false,
  showSeparator = false
}) => {
  const tooltipSide = isHorizontal ? 'top' : 'right';

  if (isHorizontal) {
    return (
      <>
        {showSeparator && <Separator orientation="vertical" className="h-9 mx-1" />}
        {tools.map((tool) => (
          <ToolbarItem
            key={tool.id}
            id={tool.id}
            icon={tool.icon}
            label={tool.label}
            selectedTool={selectedTool}
            onSelectTool={onSelectTool}
            tooltipSide={tooltipSide}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {showSeparator && <Separator className="my-1" />}
      {tools.map((tool) => (
        <ToolbarItem
          key={tool.id}
          id={tool.id}
          icon={tool.icon}
          label={tool.label}
          selectedTool={selectedTool}
          onSelectTool={onSelectTool}
          tooltipSide={tooltipSide}
        />
      ))}
    </>
  );
};

export default ToolbarGroup;
