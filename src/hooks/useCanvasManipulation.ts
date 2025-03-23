
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useCanvasManipulation = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const { toast } = useToast();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
    return !showGrid;
  };

  const handleTogglePreview = () => {
    setIsPreviewing(prev => !prev);
    toast({
      title: isPreviewing ? "Exiting Preview Mode" : "Entering Preview Mode",
      description: isPreviewing ? "Now you can edit objects again." : "Testing your game. Controls are enabled.",
    });
    return !isPreviewing;
  };

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
    
    if (tool === 'hand') {
      if (document.body.style.cursor !== 'grab') {
        document.body.style.cursor = 'grab';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingCanvas && selectedTool === 'hand') {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        setCanvasPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUp = () => {
      if (isDraggingCanvas) {
        setIsDraggingCanvas(false);
        if (selectedTool === 'hand') {
          document.body.style.cursor = 'grab';
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDraggingCanvas, dragStart, selectedTool]);

  return {
    zoomLevel,
    setZoomLevel,
    showGrid,
    setShowGrid,
    isPreviewing,
    setIsPreviewing,
    canvasPosition,
    setCanvasPosition,
    isDraggingCanvas,
    setIsDraggingCanvas,
    dragStart,
    setDragStart,
    selectedTool,
    setSelectedTool,
    handleZoomIn,
    handleZoomOut,
    handleToggleGrid,
    handleTogglePreview,
    handleSelectTool
  };
};
