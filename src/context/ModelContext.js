import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { loadModels as loadModelsUtil } from '../utils/modelLoader';

// Create context
export const ModelContext = createContext();

/**
 * Provider component that wraps the app to provide model access
 * This is a simplified version for initial testing
 */
export const ModelProvider = ({ children }) => {
  // State
  const [models, setModels] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize and load mock models
  const loadModels = useCallback(async () => {
    if (Object.keys(models).length > 0) {
      return models; // Models already loaded
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading mock models...');
      
      // Load mock models
      const loadedModels = await loadModelsUtil();
      console.log('Mock models loaded successfully');
      
      setModels(loadedModels);
      return loadedModels;
    } catch (err) {
      console.error('Error loading mock models:', err);
      setError(err.message);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [models]);
  
  // Load models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);
  
  // Context value
  const contextValue = {
    models,
    isLoading,
    error,
    loadModels,
  };
  
  return (
    <ModelContext.Provider value={contextValue}>
      {children}
    </ModelContext.Provider>
  );
};

/**
 * Custom hook to use the model context
 */
export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};