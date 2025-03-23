
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface ToolbarSettingsProps {
  onOpenSettings: () => void;
  isHorizontal?: boolean;
}

const ToolbarSettings: React.FC<ToolbarSettingsProps> = ({ 
  onOpenSettings, 
  isHorizontal = false 
}) => {
  const tooltipSide = isHorizontal ? 'top' : 'right';
  
  return (
    <>
      {isHorizontal ? (
        <Separator orientation="vertical" className="h-9 mx-1" />
      ) : (
        <Separator className="my-1" />
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={onOpenSettings}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Customize Toolbar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>Customize Toolbar</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default ToolbarSettings;
