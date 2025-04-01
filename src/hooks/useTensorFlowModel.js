import { useState, useEffect } from 'react';
import { useModelContext } from '../context/ModelContext';
import { loadModels, downloadModelsIfNeeded } from '../utils/modelLoader';

/**
 * Custom hook to access and manage TensorFlow models
 * @returns {Object} Models and state information
 */
export const useTensorFlowModel = () => {
  const { models, setModels, isModelReady, setIsModelReady } = useModelContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load models on component mount
  useEffect(() => {
    let isMounted = true;

    const initModels = async () => {
      try {
        setIsLoading(true);
        
        // Check if models need to be downloaded
        const downloadResult = await downloadModelsIfNeeded();
        
        if (!downloadResult.modelsAvailable) {
          throw new Error("Models are not available. Please check your internet connection.");
        }
        
        // Load the models
        const loadedModels = await loadModels();
        
        // If component is still mounted, update state
        if (isMounted) {
          setModels(loadedModels);
          setIsModelReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading models:', err);
        
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    initModels();

    // Cleanup function to handle unmounting
    return () => {
      isMounted = false;
    };
  }, [setModels, setIsModelReady]);

  /**
   * Predict using a specific model
   * @param {string} modelType - Type of model ('age', 'gender', 'expression')
   * @param {Object} inputData - Data to run prediction on
   * @returns {Promise<Object>} Prediction results
   */
  const predict = async (modelType, inputData) => {
    if (!models[modelType]) {
      throw new Error(`Model ${modelType} is not loaded`);
    }

    // In a real implementation, this would use TensorFlow.js to run the prediction
    console.log(`Running prediction with ${modelType} model`);
    
    // Mock prediction for now
    return {
      predictions: [0.7, 0.2, 0.1],
      time: 150, // ms
    };
  };

  return {
    models,
    isLoading,
    error,
    isModelReady,
    predict,
  };
};