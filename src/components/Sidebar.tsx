
import React, { useState } from 'react';
import { 
  Layers, Square, Circle, Triangle, Box, Image,
  ChevronLeft, ChevronRight, MousePointer, Type,
  Settings, Code, PenTool, Play, Pause, Save,
  FileText, Crop, Grid, Move, ArrowUpRight,
  Gamepad, Blocks, Variable, Component, Timer,
  Eye, Volume2, Users, LayoutList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('objects');

  const tabs = {
    objects: {
      icon: Layers,
      tools: [
        { name: 'Select', icon: MousePointer },
        { name: 'Rectangle', icon: Square },
        { name: 'Circle', icon: Circle },
        { name: 'Triangle', icon: Triangle },
        { name: 'Box 3D', icon: Box },
        { name: 'Text', icon: Type },
        { name: 'Image', icon: Image }
      ]
    },
    scripts: {
      icon: Code,
      tools: [
        { name: 'Events', icon: Play },
        { name: 'Actions', icon: ArrowUpRight },
        { name: 'Variables', icon: Variable },
        { name: 'Conditions', icon: PenTool },
        { name: 'Visual Blocks', icon: Blocks },
        { name: 'Behaviors', icon: Gamepad }
      ]
    },
    behaviors: {
      icon: Gamepad,
      tools: [
        { name: 'Platformer', icon: Gamepad },
        { name: 'Physics', icon: Move },
        { name: 'Draggable', icon: Move },
        { name: 'Pathfinding', icon: Users },
        { name: 'Animation', icon: Eye },
        { name: 'Timer', icon: Timer }
      ]
    },
    transform: {
      icon: Move,
      tools: [
        { name: 'Position', icon: Move },
        { name: 'Scale', icon: Crop },
        { name: 'Rotate', icon: Circle },
        { name: 'Grid', icon: Grid }
      ]
    },
    components: {
      icon: Component,
      tools: [
        { name: 'Create', icon: Component },
        { name: 'Prefabs', icon: LayoutList },
        { name: 'Import', icon: FileText },
        { name: 'Export', icon: Save }
      ]
    },
    assets: {
      icon: Image,
      tools: [
        { name: 'Images', icon: Image },
        { name: 'Sprites', icon: Layers },
        { name: 'Sounds', icon: Volume2 },
        { name: '3D Models', icon: Box }
      ]
    },
    settings: {
      icon: Settings,
      tools: [
        { name: 'Project', icon: FileText },
        { name: 'Canvas', icon: Square },
        { name: 'Export', icon: Save }
      ]
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderTab = (id: keyof typeof tabs) => {
    const tab = tabs[id];
    return (
      <TooltipProvider delayDuration={200}>
        <div className="my-4">
          <div className="flex items-center text-xs uppercase text-muted-foreground px-4 mb-2">
            {!collapsed && id}
          </div>
          <div className="space-y-1 px-2">
            {tab.tools.map((tool) => (
              <Tooltip key={tool.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${
                      collapsed ? 'justify-center px-2' : ''
                    }`}
                  >
                    <tool.icon className="h-4 w-4 mr-2" />
                    {!collapsed && <span>{tool.name}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{tool.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={`h-[calc(100vh-4rem)] bg-card border-r relative transition-all duration-300 ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      <div className="flex flex-col h-full overflow-auto">
        {/* Sidebar header */}
        <div className="p-4 flex items-center justify-between">
          {!collapsed && <span className="font-medium">Tools</span>}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`h-8 w-8 p-0 ${collapsed ? 'ml-auto mr-auto' : ''}`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        <Separator />
        
        {/* Tabs */}
        <div className="flex overflow-x-auto p-2 space-x-1 border-b">
          {Object.entries(tabs).map(([id, tab]) => (
            <TooltipProvider key={id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === id ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`h-8 ${collapsed ? 'w-8 p-0' : ''}`}
                    onClick={() => setActiveTab(id as keyof typeof tabs)}
                  >
                    <tab.icon className="h-4 w-4" />
                    {!collapsed && (
                      <span className="ml-2 capitalize">{id}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p className="capitalize">{id}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {/* Active tab content */}
        <div className="flex-1 overflow-y-auto fade-mask-b">
          {renderTab(activeTab as keyof typeof tabs)}
        </div>
        
        {/* Footer */}
        <div className="p-2 border-t">
          <div className="flex space-x-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Play className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">Preview</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>Preview Game</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" size="sm" className="w-full">
                    <Save className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">Save</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>Save Project</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
