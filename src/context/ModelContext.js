import React, { createContext, useState, useContext, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadModels as loadModelsUtil, downloadModelsIfNeeded } from '../utils/modelLoader';

// Create context
export const ModelContext = createContext();

/**
 * Provider component that wraps the app to provide model access
 * This is a simplified version that will be expanded later
 */
export const ModelProvider = ({ children }) => {
  // State
  const [models, setModels] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize TensorFlow.js and load models
  const loadModels = useCallback(async () => {
    if (Object.keys(models).length > 0) {
      return models; // Models already loaded
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js initialized');
      
      // Check if models need to be downloaded
      await downloadModelsIfNeeded();
      
      // Load models
      const loadedModels = await loadModelsUtil();
      console.log('Models loaded:', Object.keys(loadedModels));
      
      setModels(loadedModels);
      return loadedModels;
    } catch (err) {
      console.error('Error loading models:', err);
      setError(err.message);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [models]);
  
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