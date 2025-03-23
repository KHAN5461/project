
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer, Square, Circle, Type, Image, 
  Triangle, Box, Grid, Move, RotateCcw, Hand,
  Hammer, Copy, Scissors, Layers, Pencil,
  Gamepad, Code, Play, Variable as VariableIcon, Blocks, Timer,
  LayoutList, Component, ScrollText
} from 'lucide-react';

interface ToolbarItemProps {
  id: string;
  icon: string;
  label: string;
  selectedTool: string;
  onSelectTool: (tool: string) => void;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({ 
  id, 
  icon, 
  label, 
  selectedTool, 
  onSelectTool,
  tooltipSide = 'top'
}) => {
  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    MousePointer: <MousePointer className="h-5 w-5" />,
    Square: <Square className="h-5 w-5" />,
    Circle: <Circle className="h-5 w-5" />,
    Type: <Type className="h-5 w-5" />,
    Image: <Image className="h-5 w-5" />,
    Triangle: <Triangle className="h-5 w-5" />,
    Box: <Box className="h-5 w-5" />,
    Grid: <Grid className="h-5 w-5" />,
    Move: <Move className="h-5 w-5" />,
    RotateCcw: <RotateCcw className="h-5 w-5" />,
    Hand: <Hand className="h-5 w-5" />,
    Hammer: <Hammer className="h-5 w-5" />,
    Copy: <Copy className="h-5 w-5" />,
    Scissors: <Scissors className="h-5 w-5" />,
    Layers: <Layers className="h-5 w-5" />,
    Pencil: <Pencil className="h-5 w-5" />,
    Gamepad: <Gamepad className="h-5 w-5" />,
    Code: <Code className="h-5 w-5" />,
    Play: <Play className="h-5 w-5" />,
    VariableIcon: <VariableIcon className="h-5 w-5" />,
    Blocks: <Blocks className="h-5 w-5" />,
    Timer: <Timer className="h-5 w-5" />,
    LayoutList: <LayoutList className="h-5 w-5" />,
    Component: <Component className="h-5 w-5" />,
    ScrollText: <ScrollText className="h-5 w-5" />
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={selectedTool === id ? "secondary" : "ghost"}
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => onSelectTool(id)}
        >
          {iconMap[icon] || <MousePointer className="h-5 w-5" />}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolbarItem;
