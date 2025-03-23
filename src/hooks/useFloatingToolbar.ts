import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseFloatingToolbarProps {
  selectedElements: any[];
  toolbarWidth?: number;
  toolbarHeight?: number;
  offset?: number;
}

export const useFloatingToolbar = ({
  selectedElements,
  toolbarWidth = 320,
  toolbarHeight = 40,
  offset = 10,
}: UseFloatingToolbarProps) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedElements.length > 0) {
      const element = selectedElements[0];
      const bounds = element.getBoundingClientRect();
      
      // Calculate optimal position
      let x = bounds.right + offset;
      let y = bounds.top;

      // Check if toolbar would go off screen
      if (x + toolbarWidth > window.innerWidth) {
        x = bounds.left - toolbarWidth - offset;
      }

      if (y + toolbarHeight > window.innerHeight) {
        y = window.innerHeight - toolbarHeight - offset;
      }

      setPosition({ x, y });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedElements, toolbarWidth, toolbarHeight, offset]);

  return {
    position,
    isVisible,
    setPosition,
  };
};