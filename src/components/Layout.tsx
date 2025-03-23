
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PropertyPanel from './PropertyPanel';
import BottomPanel from './BottomPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isEditor, setIsEditor] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsEditor(location.pathname.includes('/editor'));
    setMounted(true);
  }, [location.pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex flex-1 w-full ${isEditor ? 'max-w-full p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {isEditor && (
          <div className="flex w-full h-full">
            <Sidebar />
            <main className="flex-1 flex flex-col">
              <div className="h-12 border-b flex items-center px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center space-x-4">
                  <div className="space-x-2">
                    <Button size="sm" variant="ghost">Save</Button>
                    <Button size="sm" variant="ghost">Undo</Button>
                    <Button size="sm" variant="ghost">Redo</Button>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="space-x-2">
                    <Button size="sm" variant="ghost">Play</Button>
                    <Button size="sm" variant="ghost">Pause</Button>
                    <Button size="sm" variant="ghost">Stop</Button>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="space-x-2">
                    <Button size="sm" variant="ghost">Export</Button>
                    <Button size="sm" variant="ghost">Settings</Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="flex-1 p-4">{children}</div>
                <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <PropertyPanel />
                </div>
              </div>
              <div className="h-32 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <BottomPanel />
              </div>
            </main>
          </div>
        )}
        {!isEditor && (
          <main className="py-8 animate-fade-in">
            {children}
          </main>
        )}
      </div>
      {!isEditor && <Footer />}
    </div>
  );
};

export default Layout;
