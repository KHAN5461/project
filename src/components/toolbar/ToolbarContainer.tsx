
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ToolbarContainerProps {
  children: React.ReactNode;
  position: 'bottom' | 'left';
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ children, position }) => {
  const positionClasses = position === 'bottom' 
    ? "fixed bottom-6 left-1/2 -translate-x-1/2 flex-row rounded-xl p-1.5" 
    : "fixed top-1/2 left-6 -translate-y-1/2 flex-col rounded-xl p-1.5";

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`glass shadow-glass ${positionClasses} z-10`}>
        {children}
      </div>
    </TooltipProvider>
  );
};

export default ToolbarContainer;
