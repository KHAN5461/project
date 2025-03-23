import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  title: string;
  lastModified: string;
  thumbnail?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Adventure Game',
    lastModified: '2024-01-15',
    thumbnail: 'https://via.placeholder.com/300x200',
  },
  {
    id: '2',
    title: 'Puzzle Game',
    lastModified: '2024-01-14',
    thumbnail: 'https://via.placeholder.com/300x200',
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card className="overflow-hidden">
      {project.thumbnail && (
        <div className="aspect-video overflow-hidden">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <p className="text-sm text-muted-foreground">Last modified: {project.lastModified}</p>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="default">Open</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

const Projects: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;