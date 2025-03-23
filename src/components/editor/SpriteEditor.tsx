import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Flip, Upload, Save } from 'lucide-react';

interface SpriteEditorProps {
  onSave: (imageData: string) => void;
  initialImage?: string;
}

const SpriteEditor: React.FC<SpriteEditorProps> = ({ onSave, initialImage }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [flipped, setFlipped] = useState({ horizontal: false, vertical: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(e.target?.result as string);
          drawImage(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(
      flipped.horizontal ? -scale : scale,
      flipped.vertical ? -scale : scale
    );
    ctx.drawImage(
      img,
      -img.width / 2,
      -img.height / 2,
      img.width,
      img.height
    );
    ctx.restore();
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      onSave(imageData);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex gap-4 mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setFlipped({ ...flipped, horizontal: !flipped.horizontal })}
        >
          <Flip className="h-4 w-4 mr-2" />
          Flip H
        </Button>
        <Button
          variant="outline"
          onClick={() => setFlipped({ ...flipped, vertical: !flipped.vertical })}
        >
          <Flip className="h-4 w-4 mr-2" />
          Flip V
        </Button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Rotation</label>
        <div className="flex gap-4 items-center">
          <Slider
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
            max={360}
            step={1}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Scale</label>
        <Slider
          value={[scale]}
          onValueChange={(value) => setScale(value[0])}
          min={0.1}
          max={2}
          step={0.1}
          className="flex-1"
        />
      </div>

      <div className="border rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Sprite
      </Button>
    </div>
  );
};

export default SpriteEditor;