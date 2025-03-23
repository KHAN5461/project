
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewToggleProps {
  viewMode: '2d' | '3d';
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="flex items-center gap-1"
          >
            {viewMode === '2d' ? (
              <>
                <Square className="h-4 w-4" />
                <span className="text-xs">2D</span>
              </>
            ) : (
              <>
                <Box className="h-4 w-4" />
                <span className="text-xs">3D</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle between 2D and 3D view</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ViewToggle;
