
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to editor
    if (isAuthenticated && !isLoading) {
      navigate('/editor');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/editor');
    } else {
      navigate('/auth');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to Cloudcraft Game Editor
        </h1>
        
        <p className="text-xl mb-8">
          Design and build interactive games with our powerful editor. 
          Create objects, define behaviors, and bring your ideas to life.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-card rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-medium mb-2">Visual Editor</h3>
            <p className="text-muted-foreground">
              Design your game world with our intuitive visual editor
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-medium mb-2">Block Programming</h3>
            <p className="text-muted-foreground">
              Create game logic using simple drag and drop blocks
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-medium mb-2">Instant Preview</h3>
            <p className="text-muted-foreground">
              Test your game in real-time with our built-in preview mode
            </p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleGetStarted}
          className="px-8 py-6 text-lg"
        >
          {isAuthenticated ? 'Go to Editor' : 'Get Started'}
        </Button>
      </div>
    </motion.div>
  );
};

export default Index;
