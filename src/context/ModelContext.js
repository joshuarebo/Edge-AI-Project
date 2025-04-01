import React, { createContext, useState, useContext } from 'react';

// Create a context for model access
const ModelContext = createContext(null);

/**
 * Provider component that wraps the app to provide model access
 * This is a simplified version that will be expanded later
 */
export const ModelProvider = ({ children }) => {
  const [models, setModels] = useState({
    age: null,
    gender: null,
    expression: null
  });
  const [isModelReady, setIsModelReady] = useState(false);

  const value = {
    models,
    setModels,
    isModelReady,
    setIsModelReady
  };

  return (
    <ModelContext.Provider value={value}>
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