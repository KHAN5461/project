
import { Project, GameObject } from "../types/project";

// Get all saved projects
export const getProjects = (userId?: string): Project[] => {
  try {
    const projectsJSON = localStorage.getItem("cloudcraft-projects");
    if (!projectsJSON) return [];
    
    const projects = JSON.parse(projectsJSON);
    if (!Array.isArray(projects)) {
      throw new Error('Invalid projects data format');
    }
    
    // Validate project structure
    const validProjects = projects.filter((p: any) => {
      return p && typeof p === 'object' && 
        typeof p.id === 'string' && 
        typeof p.name === 'string' && 
        Array.isArray(p.objects);
    });
    
    return userId ? validProjects.filter((p: Project) => p.userId === userId) : validProjects;
  } catch (error) {
    console.error("Failed to load projects:", error);
    throw new Error("Failed to load projects. Data may be corrupted.");
  }
};

// Get a specific project by ID
export const getProjectById = (id: string): Project | null => {
  const projects = getProjects();
  return projects.find(project => project.id === id) || null;
};

// Save a project
export const saveProject = (project: Project): Project => {
  try {
    const projects = getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    // Update project's updatedAt time
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing project
      projects[existingIndex] = updatedProject;
    } else {
      // Add new project
      projects.push(updatedProject);
    }
    
    localStorage.setItem("cloudcraft-projects", JSON.stringify(projects));
    return updatedProject;
  } catch (error) {
    console.error("Failed to save project:", error);
    throw new Error("Failed to save project");
  }
};

// Create a new project
export const createNewProject = (name: string, userId?: string): Project => {
  const newProject: Project = {
    id: `project-${Date.now()}`,
    userId,
    name: name || "Untitled Project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objects: [],
    settings: {
      resolution: {
        width: 1920,
        height: 1080
      },
      showGrid: true,
      physics: false,
      backgroundColor: "#ffffff",
      viewMode: '2d',
      renderQuality: 'medium'
    },
    assets: [],
    scripts: []
  };
  
  return saveProject(newProject);
};

// Delete a project
export const deleteProject = (id: string): boolean => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (projects.length === filteredProjects.length) {
      return false; // Project not found
    }
    
    localStorage.setItem("cloudcraft-projects", JSON.stringify(filteredProjects));
    return true;
  } catch (error) {
    console.error("Failed to delete project:", error);
    return false;
  }
};

// Export project as JSON file
export const exportProject = (project: Project) => {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Import project from JSON file
export const importProject = (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const project = JSON.parse(event.target.result as string) as Project;
        
        // Validate project structure
        if (!project.id || !project.name || !Array.isArray(project.objects)) {
          throw new Error("Invalid project file format");
        }
        
        // Add any missing properties for backward compatibility
        if (!project.settings) {
          project.settings = {
            resolution: { width: 1920, height: 1080 },
            showGrid: true,
            physics: false,
            backgroundColor: "#ffffff",
            viewMode: '2d',
            renderQuality: 'medium'
          };
        }
        
        if (!project.settings.viewMode) {
          project.settings.viewMode = '2d';
        }
        
        if (!project.settings.renderQuality) {
          project.settings.renderQuality = 'medium';
        }
        
        if (!project.assets) {
          project.assets = [];
        }
        
        if (!project.scripts) {
          project.scripts = [];
        }
        
        // Regenerate IDs to avoid conflicts
        project.id = `project-${Date.now()}`;
        project.objects = project.objects.map(obj => ({
          ...obj,
          id: `${obj.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        resolve(saveProject(project));
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};
