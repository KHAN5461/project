
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, FolderOpen, FileText, Undo, Redo, 
  ZoomIn, ZoomOut, Grid, Hand, Fullscreen, 
  Download, Share, PlayCircle, PauseCircle
} from 'lucide-react';
import ViewToggle from '@/components/ViewToggle';
import { useToast } from '@/components/ui/use-toast';

interface EditorHeaderProps {
  hasUnsavedChanges: boolean;
  currentProject: any;
  zoomLevel: number;
  showGrid: boolean;
  selectedTool: string;
  isPreviewing: boolean;
  viewMode: '2d' | '3d';
  onSave: () => void;
  onOpen: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onSelectTool: (tool: string) => void;
  onTogglePreview: () => void;
  onToggleFullscreen: () => void;
  onExport: () => void;
  onShare: () => void;
  onToggleViewMode: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  hasUnsavedChanges,
  currentProject,
  zoomLevel,
  showGrid,
  selectedTool,
  isPreviewing,
  viewMode,
  onSave,
  onOpen,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onSelectTool,
  onTogglePreview,
  onToggleFullscreen,
  onExport,
  onShare,
  onToggleViewMode
}) => {
  const { toast } = useToast();

  return (
    <div className="bg-card border-b p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost" 
          size="sm"
          onClick={onSave}
          className={`button-hover ${hasUnsavedChanges ? 'text-yellow-500 dark:text-yellow-400' : ''}`}
        >
          <Save className="h-4 w-4 mr-1" />
          {hasUnsavedChanges ? 'Save*' : 'Save'}
        </Button>
        <Button
          variant="ghost" 
          size="sm"
          onClick={onOpen}
          className="button-hover"
        >
          <FolderOpen className="h-4 w-4 mr-1" />
          Open
        </Button>
        {currentProject && (
          <span className="text-xs text-muted-foreground ml-1 flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {currentProject.name}
          </span>
        )}
        <div className="border-r h-6 mx-1" />
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onUndo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onRedo}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="border-r h-6 mx-1" />
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-sm">{zoomLevel}%</span>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant={showGrid ? "secondary" : "ghost"} 
          size="icon"
          className="h-8 w-8"
          onClick={onToggleGrid}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button 
          variant={selectedTool === 'hand' ? "secondary" : "ghost"} 
          size="icon"
          className="h-8 w-8"
          onClick={() => onSelectTool('hand')}
          title="Hand Tool (Pan Canvas)"
        >
          <Hand className="h-4 w-4" />
        </Button>
        <ViewToggle viewMode={viewMode} onToggle={onToggleViewMode} />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant={isPreviewing ? "default" : "outline"} 
          size="sm"
          onClick={onTogglePreview}
          className="button-hover"
        >
          {isPreviewing ? (
            <>
              <PauseCircle className="h-4 w-4 mr-1" />
              Exit Preview
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4 mr-1" />
              Preview
            </>
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onToggleFullscreen}
        >
          <Fullscreen className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onShare}
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
