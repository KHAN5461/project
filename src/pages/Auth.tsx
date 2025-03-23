
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForms from '@/components/AuthForms';
import { motion } from 'framer-motion';

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/editor');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4"
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">
            Welcome to Cloudcraft
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your projects or create a new account
          </p>
        </div>
        
        <AuthForms />
      </div>
    </motion.div>
  );
};

export default Auth;
