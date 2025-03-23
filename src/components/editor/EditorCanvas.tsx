
import React, { useRef, useEffect } from 'react';
import { Music, Box, Boxes } from 'lucide-react';
import { GameObject } from '@/types/project';
import SceneView from '@/components/SceneView';
import Toolbar from '@/components/toolbar';

interface EditorCanvasProps {
  objects: GameObject[];
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
  zoomLevel: number;
  showGrid: boolean;
  viewMode: '2d' | '3d';
  isPreviewing: boolean;
  selectedTool: string;
  canvasPosition: { x: number; y: number };
  setCanvasPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsDraggingCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  setDragStart: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  createObject: (type: GameObject['type'], x: number, y: number) => void;
  onSelectTool: (tool: string) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  objects,
  selectedObject,
  onSelectObject,
  zoomLevel,
  showGrid,
  viewMode,
  isPreviewing,
  selectedTool,
  canvasPosition,
  setCanvasPosition,
  setIsDraggingCanvas,
  setDragStart,
  createObject,
  onSelectTool
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    
    const canvasContainer = canvasContainerRef.current;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedTool === 'hand') {
        setIsDraggingCanvas(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        document.body.style.cursor = 'grabbing';
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        // Let the parent component handle the zoom level
      }
    };
    
    canvasContainer.addEventListener('mousedown', handleMouseDown);
    canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvasContainer.removeEventListener('mousedown', handleMouseDown);
      canvasContainer.removeEventListener('wheel', handleWheel);
    };
  }, [selectedTool, setIsDraggingCanvas, setDragStart]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer) return;
      
      const objectType = e.dataTransfer.getData('text/plain');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Let the parent component handle object creation
      createObject(objectType as GameObject['type'], x, y);
    };
    
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    
    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [createObject]);

  const renderObject = (obj: GameObject) => {
    const isSelected = obj.id === selectedObject;
    const selectionClass = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';
    
    switch (obj.type) {
      case 'rectangle':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              width: `${obj.width}px`,
              height: `${obj.height}px`,
              backgroundColor: obj.color,
              borderRadius: '4px',
              transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          />
        );
      case 'circle':
        return (
          <div 
            key={obj.id}
            className={`absolute rounded-full cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x - (obj.radius || 0)}px`,
              top: `${obj.y - (obj.radius || 0)}px`,
              width: `${(obj.radius || 0) * 2}px`,
              height: `${(obj.radius || 0) * 2}px`,
              backgroundColor: obj.color,
              transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          />
        );
      case 'text':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              padding: '8px',
              transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          >
            <span style={{ color: obj.color }}>{obj.text}</span>
          </div>
        );
      case 'triangle':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              width: '0',
              height: '0',
              borderLeft: `${(obj.width || 0) / 2}px solid transparent`,
              borderRight: `${(obj.width || 0) / 2}px solid transparent`,
              borderBottom: `${obj.height || 0}px solid ${obj.color}`,
              transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          />
        );
      case 'box':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass} perspective-[800px]`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              width: `${obj.width}px`,
              height: `${obj.height}px`,
              transform: `rotateY(45deg) rotateX(45deg) ${obj.rotation ? `rotate(${obj.rotation}deg)` : ''}`,
              transformStyle: 'preserve-3d',
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          >
            <div className="absolute inset-0 bg-opacity-80" style={{ backgroundColor: obj.color }}></div>
            <div className="absolute top-0 left-0 w-full h-full transform translate-z-[-50px] bg-opacity-60" style={{ backgroundColor: obj.color }}></div>
            <div className="absolute top-0 left-0 w-full h-full transform rotateY-90 translate-z-[-50px] bg-opacity-70" style={{ backgroundColor: obj.color }}></div>
          </div>
        );
      case 'model':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              backgroundColor: 'transparent',
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          >
            <Box className="w-8 h-8 text-primary/70" />
          </div>
        );
      case 'light':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              backgroundColor: 'yellow',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              boxShadow: '0 0 10px yellow',
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          />
        );
      case 'sound':
        return (
          <div 
            key={obj.id}
            className={`absolute cursor-move ${selectionClass}`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              zIndex: obj.zIndex || 0,
            }}
            onClick={() => onSelectObject(obj.id)}
          >
            <Music className="w-8 h-8 text-primary/70" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={canvasContainerRef}
      className="flex-1 relative overflow-auto bg-muted"
    >
      <Toolbar onSelectTool={onSelectTool} selectedTool={selectedTool} />
      
      {viewMode === '2d' ? (
        <div 
          ref={canvasRef}
          className="absolute w-[8000px] h-[8000px] bg-white/50"
          style={{ 
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoomLevel / 100})`,
            transformOrigin: 'top left',
            backgroundImage: showGrid ? `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0h1v20H1V0zm19 0h1v20h-1V0zm0 19v1H0v-1h20zm0-19v1H0V0h20z' fill='%23f0f0f0'/%3E%3C/svg%3E")` : 'none',
          }}
        >
          <div className="relative w-[1920px] h-[1080px] border-2 border-blue-400/30 rounded-md">
            {objects.map(renderObject)}
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          <SceneView 
            objects={objects}
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            showGrid={showGrid}
            isPreviewing={isPreviewing}
          />
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-card p-2 rounded-md shadow-md text-xs text-muted-foreground">
        <span>Pan: Hold hand tool + drag | Zoom: Ctrl + Scroll | {viewMode === '3d' ? 'Orbit: Drag' : ''}</span>
      </div>
    </div>
  );
};

export default EditorCanvas;
