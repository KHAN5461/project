
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Project, GameObject } from '@/types/project';
import { useAuth } from '@/contexts/AuthContext';
import { 
  createNewProject, 
  getProjects, 
  saveProject, 
  exportProject 
} from '@/utils/projectUtils';
import { 
  saveProjectToFirebase,
  getProjectsFromFirebase,
  deleteProjectFromFirebase
} from '@/lib/firebaseService';
import { generateGameDescription, improveGameLogic } from '@/lib/gemini';

export const useProjectManagement = (objects: GameObject[], showGrid: boolean, viewMode: '2d' | '3d') => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize with a project from Firebase
  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.id) return;
      
      try {
        const projects = await getProjectsFromFirebase(user.id);
        let project: Project;
        
        if (projects.length > 0) {
          project = projects[0]; // Already sorted by updatedAt in Firebase query
        } else {
          project = createNewProject("My First Game", user.id);
          await saveProjectToFirebase(project, user.id);
        }
        
        setCurrentProject(project);
      } catch (error) {
        console.error('Failed to initialize project:', error);
        toast({
          title: "Project Load Error",
          description: "Failed to load or create project. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    loadProjects();
  }, [user?.id, toast]);

  // Track changes
  useEffect(() => {
    if (currentProject) {
      setHasUnsavedChanges(true);
    }
  }, [objects, showGrid, viewMode]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && currentProject) {
        handleSaveProject(false);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, currentProject, objects]);

  // Warn on unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveProject = async (showToastOrEvent: boolean | React.MouseEvent<HTMLButtonElement> = true) => {
    const showToast = typeof showToastOrEvent === 'boolean' ? showToastOrEvent : true;
    
    if (!currentProject) {
      toast({
        title: "Save Failed",
        description: "No active project to save.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Validate project settings before saving
      if (!currentProject.settings?.resolution?.width || !currentProject.settings?.resolution?.height) {
        throw new Error('Invalid project resolution settings');
      }

      const updatedProject = {
        ...currentProject,
        objects,
        settings: {
          resolution: currentProject.settings.resolution,
          showGrid,
          viewMode,
          physics: currentProject.settings.physics ?? false,
          backgroundColor: currentProject.settings.backgroundColor ?? '#ffffff',
          renderQuality: currentProject.settings.renderQuality ?? 'medium'
        }
      };

      // Save locally and to Firebase
      const savedProject = saveProject(updatedProject);
      if (user?.id) {
        await saveProjectToFirebase(savedProject, user.id);
      }
      
      setCurrentProject(savedProject);
      setHasUnsavedChanges(false);
      
      if (showToast) {
        toast({
          title: "Project Saved",
          description: "Your project has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Project save error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "There was an error saving your project.",
        variant: "destructive"
      });
    }
  };

  const handleOpenProject = () => {
    if (hasUnsavedChanges) {
      handleSaveProject(false);
    }
    setProjectModalOpen(true);
  };

  const handleSelectProject = (project: Project) => {
    try {
      // Validate project data
      if (!project.id || !project.name || !Array.isArray(project.objects)) {
        throw new Error('Invalid project structure');
      }

      setCurrentProject(project);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Project Loaded",
        description: `"${project.name}" has been loaded successfully.`,
      });

      return project;
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({
        title: "Project Load Error",
        description: "Failed to load project. The project file may be corrupted.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleNewProject = async (name: string) => {
    try {
      if (!name.trim()) {
        throw new Error('Project name cannot be empty');
      }

      const newProject = createNewProject(name, user?.id);
      if (user?.id) {
        await saveProjectToFirebase(newProject, user.id);
      }
      setCurrentProject(newProject);
      setHasUnsavedChanges(false);
      
      toast({
        title: "New Project Created",
        description: `"${name}" has been created successfully.`,
      });

      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Project Creation Error",
        description: error instanceof Error ? error.message : "Failed to create new project.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleExportCurrentProject = () => {
    if (!currentProject) return;
    
    if (hasUnsavedChanges) {
      handleSaveProject(false);
    }
    
    exportProject(currentProject);
    
    toast({
      title: "Project Exported",
      description: "Your project has been exported as a JSON file.",
    });
  };

  return {
    currentProject,
    setCurrentProject,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    projectModalOpen,
    setProjectModalOpen,
    handleSaveProject,
    handleOpenProject,
    handleSelectProject,
    handleNewProject,
    handleExportCurrentProject
  };
};
