import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MousePointer, Square, Circle, Type, Image, Triangle, Move, RotateCcw } from 'lucide-react';

interface FloatingToolbarProps {
  selectedElements: any[];
  onSelectTool: (tool: string) => void;
  selectedTool: string;
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  selectedElements,
  onSelectTool,
  selectedTool,
  className
}) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Quick access tools for the floating toolbar
  const quickTools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: Image, label: 'Image' },
  ];

  useEffect(() => {
    if (selectedElements.length > 0 && !isDragging) {
      // Calculate the position based on selected elements
      const bounds = selectedElements[0].getBoundingClientRect();
      setPosition({
        x: bounds.right + 10,
        y: bounds.top
      });
    }
  }, [selectedElements, isDragging]);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  if (selectedElements.length === 0) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          touchAction: 'none',
        }}
        drag
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'rounded-lg border shadow-lg p-1.5',
          'flex gap-1',
          className
        )}
      >
        <TooltipProvider delayDuration={0}>
          {quickTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === tool.id ? 'secondary' : 'ghost'}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-sm">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default FloatingToolbar;