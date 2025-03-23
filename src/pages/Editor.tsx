
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ProjectModal from '../components/ProjectModal';
import { GameObject } from '@/types/project';
import EditorHeader from '@/components/editor/EditorHeader';
import EditorCanvas from '@/components/editor/EditorCanvas';
import ObjectsSidebar from '@/components/editor/ObjectsSidebar';
import AssetPanel from '@/components/editor/AssetPanel';
import { useObjectManipulation } from '@/hooks/useObjectManipulation';
import { useCanvasManipulation } from '@/hooks/useCanvasManipulation';
import { useProjectManagement } from '@/hooks/useProjectManagement';

const Editor = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [activePanel, setActivePanel] = useState<'objects' | 'settings' | 'scripts' | 'assets' | 'audio' | 'view' | '3d' | '2d' | 'sprite'>('objects');
  const [selectedSprite, setSelectedSprite] = useState<string>();
  const [platformerProperties, setPlatformerProperties] = useState();
  
  // Use custom hooks for state management
  const {
    objects,
    setObjects,
    selectedObject,
    setSelectedObject,
    createObject,
    deleteObject,
    selectObject,
    updateObject
  } = useObjectManipulation([]);

  const {
    zoomLevel,
    showGrid,
    isPreviewing,
    canvasPosition,
    setCanvasPosition,
    isDraggingCanvas,
    setIsDraggingCanvas,
    dragStart,
    setDragStart,
    selectedTool,
    handleZoomIn,
    handleZoomOut,
    handleToggleGrid,
    handleTogglePreview,
    handleSelectTool
  } = useCanvasManipulation();

  const {
    currentProject,
    setCurrentProject,
    hasUnsavedChanges,
    projectModalOpen,
    setProjectModalOpen,
    handleSaveProject,
    handleOpenProject,
    handleSelectProject,
    handleNewProject,
    handleExportCurrentProject
  } = useProjectManagement(objects, showGrid, viewMode);

  // Load objects from current project
  useEffect(() => {
    if (currentProject) {
      setObjects(currentProject.objects);
      setViewMode(currentProject.settings.viewMode || '2d');
    }
  }, [currentProject, setObjects]);

  const handleToggleViewMode = () => {
    setViewMode(prev => prev === '2d' ? '3d' : '2d');
    
    toast({
      title: `Switched to ${viewMode === '2d' ? '3D' : '2D'} View`,
      description: `You are now in ${viewMode === '2d' ? '3D' : '2D'} editing mode.`,
    });
  };

  const handleSelectObject = (id: string) => {
    if (selectedTool === 'select' || selectedTool === 'move') {
      setSelectedObject(id);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <EditorHeader 
        hasUnsavedChanges={hasUnsavedChanges}
        currentProject={currentProject}
        zoomLevel={zoomLevel}
        showGrid={showGrid}
        selectedTool={selectedTool}
        isPreviewing={isPreviewing}
        viewMode={viewMode}
        onSave={handleSaveProject}
        onOpen={handleOpenProject}
        onUndo={() => toast({ title: "Undo", description: "Last action undone" })}
        onRedo={() => toast({ title: "Redo", description: "Action redone" })}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleGrid={handleToggleGrid}
        onSelectTool={handleSelectTool}
        onTogglePreview={handleTogglePreview}
        onToggleFullscreen={() => toast({ title: "Fullscreen", description: "Entered fullscreen mode" })}
        onExport={handleExportCurrentProject}
        onShare={() => toast({ title: "Share", description: "Sharing options opened" })}
        onToggleViewMode={handleToggleViewMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <AssetPanel
          onSpriteUpdate={(imageData) => {
            if (selectedObject) {
              updateObject(selectedObject, { sprite: imageData });
            }
          }}
          onPlatformerPropertiesChange={(properties) => {
            if (selectedObject) {
              updateObject(selectedObject, { platformerProperties: properties });
            }
          }}
          selectedSprite={selectedObject ? objects.find(obj => obj.id === selectedObject)?.sprite : undefined}
          platformerProperties={selectedObject ? objects.find(obj => obj.id === selectedObject)?.platformerProperties : undefined}
        />
        <EditorCanvas 
          objects={objects}
          selectedObject={selectedObject}
          onSelectObject={handleSelectObject}
          zoomLevel={zoomLevel}
          showGrid={showGrid}
          viewMode={viewMode}
          isPreviewing={isPreviewing}
          selectedTool={selectedTool}
          canvasPosition={canvasPosition}
          setCanvasPosition={setCanvasPosition}
          setIsDraggingCanvas={setIsDraggingCanvas}
          setDragStart={setDragStart}
          createObject={createObject}
          onSelectTool={handleSelectTool}
        />

        <ObjectsSidebar 
          objects={objects}
          selectedObject={selectedObject}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          onSelectObject={handleSelectObject}
          onCreateObject={createObject}
          onDeleteObject={deleteObject}
        />
      </div>

      {projectModalOpen && (
        <ProjectModal 
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          onSelectProject={(project) => {
            const selectedProject = handleSelectProject(project);
            setObjects(selectedProject.objects);
            setProjectModalOpen(false);
          }}
          onCreateProject={(name) => {
            const newProject = handleNewProject(name);
            setObjects([]);
            setProjectModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Editor;
