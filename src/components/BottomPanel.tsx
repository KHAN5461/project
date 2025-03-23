import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const BottomPanel = () => {
  return (
    <Tabs defaultValue="timeline" className="h-full">
      <TabsList className="mb-2">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="console">Console</TabsTrigger>
        <TabsTrigger value="output">Output</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="h-[calc(100%-40px)]">
        <ScrollArea className="h-full">
          <div className="p-2">
            {/* Timeline content */}
            <div className="text-sm text-muted-foreground">
              Timeline panel will show animation keyframes and event sequences
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="console" className="h-[calc(100%-40px)]">
        <ScrollArea className="h-full">
          <div className="p-2 font-mono text-sm">
            {/* Console content */}
            <div className="text-muted-foreground">
              {'>'} Game engine initialized
              <br />
              {'>'} Scene loaded successfully
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="output" className="h-[calc(100%-40px)]">
        <ScrollArea className="h-full">
          <div className="p-2">
            {/* Output content */}
            <div className="text-sm text-muted-foreground">
              Build and compilation output will appear here
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default BottomPanel;
