import React, { useEffect, useRef } from 'react';
import { GameObject } from '@/types/project';
import { PlatformerEngine } from '@/engine/PlatformerEngine';

interface GamePreviewProps {
  objects: GameObject[];
  onUpdateObjects: (objects: GameObject[]) => void;
}

const GamePreview: React.FC<GamePreviewProps> = ({ objects, onUpdateObjects }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PlatformerEngine>(new PlatformerEngine());
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const engine = engineRef.current;
    objects.forEach(obj => engine.addGameObject(obj));

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      engine.reset();
    };
  }, [objects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const engine = engineRef.current;

    if (!canvas || !ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      objects.forEach(obj => {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate((obj.rotation * Math.PI) / 180);

        switch (obj.type) {
          case 'rectangle':
            ctx.fillStyle = obj.color;
            ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
            break;
          case 'circle':
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(0, 0, obj.radius || 0, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'text':
            ctx.fillStyle = obj.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obj.text || '', 0, 0);
            break;
        }

        ctx.restore();
      });
    };

    const update = (timestamp: number) => {
      const platformerObjects = objects.filter(obj => 
        obj.behaviors?.some(b => b.type === 'platformer')
      );

      platformerObjects.forEach(obj => {
        if (keysPressed.current.has('arrowleft')) {
          engine.moveLeft(obj.id);
        }
        if (keysPressed.current.has('arrowright')) {
          engine.moveRight(obj.id);
        }
        if (keysPressed.current.has('space')) {
          engine.jump(obj.id);
        }
      });

      engine.update(timestamp);
      render();
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [objects]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={800}
        height={600}
      />
      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded">
        <p>Controls:</p>
        <p>Arrow Keys - Move</p>
        <p>Space - Jump</p>
      </div>
    </div>
  );
};

export default GamePreview;