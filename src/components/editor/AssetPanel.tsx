import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image, Box } from 'lucide-react';
import SpriteEditor from './SpriteEditor';
import PlatformerTools from './PlatformerTools';

interface AssetPanelProps {
  onSpriteUpdate?: (imageData: string) => void;
  onPlatformerPropertiesChange?: (properties: any) => void;
  selectedSprite?: string;
  platformerProperties?: any;
}

const AssetPanel: React.FC<AssetPanelProps> = ({
  onSpriteUpdate,
  onPlatformerPropertiesChange,
  selectedSprite,
  platformerProperties
}) => {
  const [activeTab, setActiveTab] = useState('sprite');

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <TabsList className="mx-4 mt-4 w-auto grid grid-cols-2">
          <TabsTrigger value="sprite">
            <Image className="h-4 w-4 mr-2" />
            Sprite Editor
          </TabsTrigger>
          <TabsTrigger value="platformer">
            <Box className="h-4 w-4 mr-2" />
            Platformer
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="sprite" className="mt-0">
            <SpriteEditor
              onSave={onSpriteUpdate}
              initialImage={selectedSprite}
            />
          </TabsContent>

          <TabsContent value="platformer" className="mt-0">
            <PlatformerTools
              onPropertiesChange={onPlatformerPropertiesChange}
              initialProperties={platformerProperties}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default AssetPanel;