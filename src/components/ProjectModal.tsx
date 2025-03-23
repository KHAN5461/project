
import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  PlusCircle, Save, Trash, Download, Upload,
  FileText, Calendar, AlertCircle
} from 'lucide-react';
import { createNewProject, getProjects, deleteProject, exportProject } from '@/utils/projectUtils';
import { Project } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProject: (project: Project) => void;
  onNewProject: (name: string) => void;
  currentProject: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onOpenChange,
  onSelectProject,
  onNewProject,
  currentProject
}) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [view, setView] = useState<'list' | 'new'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load projects when modal opens
  React.useEffect(() => {
    if (open) {
      setProjects(getProjects());
    }
  }, [open]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your new project",
        variant: "destructive"
      });
      return;
    }
    
    onNewProject(newProjectName);
    setNewProjectName('');
    setView('list');
    onOpenChange(false);
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isCurrentProject = currentProject?.id === id;
    try {
      if (deleteProject(id)) {
        setProjects(projects.filter(p => p.id !== id));
        toast({
          title: "Project deleted",
          description: "The project has been permanently deleted",
        });
        
        if (isCurrentProject) {
          // If current project was deleted, create a new one
          const newProject = createNewProject("Untitled Project");
          onSelectProject(newProject);
        }
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    exportProject(project);
    toast({
      title: "Project exported",
      description: "Your project has been exported as a JSON file",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
    
    toast({
      title: "Importing project...",
      description: "Please wait while we import your project",
    });
    
    import('@/utils/projectUtils').then(({ importProject }) => {
      importProject(file)
        .then(project => {
          setProjects([...projects, project]);
          toast({
            title: "Project imported",
            description: `"${project.name}" has been imported successfully`,
          });
        })
        .catch(error => {
          toast({
            title: "Import failed",
            description: error.message || "Failed to import project",
            variant: "destructive"
          });
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Projects</DialogTitle>
          <DialogDescription>
            Manage your game projects or create a new one.
          </DialogDescription>
        </DialogHeader>

        {view === 'list' ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No projects found</p>
                  <p className="text-sm text-muted-foreground">Create a new project to get started</p>
                </div>
              ) : (
                projects.map(project => (
                  <div 
                    key={project.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:bg-accent ${
                      currentProject?.id === project.id ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => {
                      onSelectProject(project);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {project.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Updated {formatDistanceToNow(new Date(project.updatedAt))} ago</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {project.objects.length} objects
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleExportProject(project, e)}
                          title="Export project"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          title="Delete project"
                          className="hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DialogFooter className="flex sm:justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setView('new')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImportClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="My Awesome Game"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setView('list')}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                <Save className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
