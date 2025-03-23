
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X, GripVertical, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

type ProjectTabsProps = {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateNewProject: () => void;
};

const ProjectTabs = ({ projects, currentProject, onSelectProject, onCreateNewProject }: ProjectTabsProps) => {
  const { toast } = useToast();
  const [tabs, setTabs] = React.useState<Project[]>(projects);

  React.useEffect(() => {
    setTabs(projects);
  }, [projects]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newTabs = Array.from(tabs);
    const [reorderedTab] = newTabs.splice(result.source.index, 1);
    newTabs.splice(result.destination.index, 0, reorderedTab);
    
    setTabs(newTabs);
    
    toast({
      title: "Tabs Rearranged",
      description: "Project tabs have been reordered.",
    });
  };

  return (
    <div className="flex items-center border-b px-1">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="project-tabs" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex overflow-x-auto scrollbar-hide"
            >
              {tabs.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center py-2 px-3 text-sm cursor-pointer border-r ${
                        currentProject?.id === project.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => onSelectProject(project)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      <span className="truncate max-w-[120px]">{project.name}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-full py-2 px-3"
        onClick={onCreateNewProject}
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-2 h-6" />
    </div>
  );
};

export default ProjectTabs;
