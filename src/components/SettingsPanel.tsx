
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, Monitor, Smartphone, Computer, 
  Download, Globe, CloudUpload, Check
} from 'lucide-react';

interface SettingsPanelProps {
  settings: {
    gameTitle: string;
    width: number;
    height: number;
    backgroundColor: string;
    gravity: number;
    physicsEnabled: boolean;
    audioEnabled: boolean;
    exportPlatform: 'web' | 'mobile' | 'desktop';
    compressionLevel: 'low' | 'medium' | 'high';
  };
  onUpdateSettings: (key: string, value: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Game Settings</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Basic Settings */}
          <div>
            <h4 className="text-sm font-medium mb-3">Basic Settings</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="game-title">Game Title</Label>
                <Input 
                  id="game-title" 
                  value={settings.gameTitle}
                  onChange={(e) => onUpdateSettings('gameTitle', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input 
                    id="width" 
                    type="number"
                    value={settings.width}
                    onChange={(e) => onUpdateSettings('width', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input 
                    id="height" 
                    type="number"
                    value={settings.height}
                    onChange={(e) => onUpdateSettings('height', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex">
                  <Input 
                    id="background-color" 
                    value={settings.backgroundColor}
                    onChange={(e) => onUpdateSettings('backgroundColor', e.target.value)}
                    className="rounded-r-none"
                  />
                  <div 
                    className="w-10 border border-l-0 rounded-r-md flex items-center justify-center"
                    style={{ backgroundColor: settings.backgroundColor }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Physics Settings */}
          <div>
            <h4 className="text-sm font-medium mb-3">Physics Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="physics-enabled">Physics Engine</Label>
                <Switch 
                  id="physics-enabled" 
                  checked={settings.physicsEnabled}
                  onCheckedChange={(checked) => onUpdateSettings('physicsEnabled', checked)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="gravity">Gravity</Label>
                  <span className="text-sm text-muted-foreground">{settings.gravity}</span>
                </div>
                <Slider
                  id="gravity"
                  value={[settings.gravity]}
                  min={0}
                  max={20}
                  step={0.1}
                  disabled={!settings.physicsEnabled}
                  onValueChange={(value) => onUpdateSettings('gravity', value[0])}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-enabled">Audio Engine</Label>
                <Switch 
                  id="audio-enabled" 
                  checked={settings.audioEnabled}
                  onCheckedChange={(checked) => onUpdateSettings('audioEnabled', checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Export Settings */}
          <div>
            <h4 className="text-sm font-medium mb-3">Export Settings</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="export-platform" className="mb-1.5 block">Platform</Label>
                <Select 
                  value={settings.exportPlatform}
                  onValueChange={(value) => onUpdateSettings('exportPlatform', value)}
                >
                  <SelectTrigger id="export-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Web</span>
                    </SelectItem>
                    <SelectItem value="mobile" className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <span>Mobile</span>
                    </SelectItem>
                    <SelectItem value="desktop" className="flex items-center">
                      <Computer className="h-4 w-4 mr-2" />
                      <span>Desktop</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="compression-level" className="mb-1.5 block">Compression Level</Label>
                <Select 
                  value={settings.compressionLevel}
                  onValueChange={(value: 'low' | 'medium' | 'high') => onUpdateSettings('compressionLevel', value)}
                >
                  <SelectTrigger id="compression-level">
                    <SelectValue placeholder="Select compression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Larger Size)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Smaller Size)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => alert('Project settings saved to cloud')}
          >
            <CloudUpload className="h-4 w-4 mr-2" />
            Save to Cloud
          </Button>
          <Button 
            className="flex-1"
            onClick={() => alert('Project settings applied')}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
