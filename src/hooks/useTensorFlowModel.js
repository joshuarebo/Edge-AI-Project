import { useState, useEffect } from 'react';
import { useModelContext } from '../context/ModelContext';

/**
 * Custom hook to access and manage TensorFlow models
 * @returns {Object} Models and state information
 */
export const useTensorFlowModel = () => {
  // State
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Access models from context
  const { models, isLoading, error, loadModels } = useModelContext();
  
  // Load models on mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        await loadModels();
      } catch (err) {
        console.error('Error initializing models in hook:', err);
      }
    };
    
    initializeModels();
  }, [loadModels]);
  
  /**
   * Predict using a specific model
   * This is a simplified mock implementation for testing
   */
  const predict = async (modelType, inputData) => {
    if (!models[modelType]) {
      throw new Error(`Model for ${modelType} not found`);
    }
    
    try {
      setIsPredicting(true);
      
      // Get the model
      const model = models[modelType];
      
      // Run prediction using mock model
      const startTime = performance.now();
      const prediction = await model.predict(inputData);
      
      // Process prediction based on model type
      let result;
      switch (modelType) {
        case 'age':
          result = processAgeResult(prediction);
          break;
        case 'gender':
          result = processGenderResult(prediction);
          break;
        case 'expression':
          result = processExpressionResult(prediction);
          break;
        default:
          throw new Error(`Unknown model type: ${modelType}`);
      }
      
      const endTime = performance.now();
      result.inferenceTime = endTime - startTime;
      
      return result;
    } catch (error) {
      console.error(`Error predicting with ${modelType} model:`, error);
      throw error;
    } finally {
      setIsPredicting(false);
    }
  };
  
  /**
   * Process age model prediction result
   */
  const processAgeResult = async (prediction) => {
    const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'];
    const predictionArray = await prediction.data();
    
    let maxConfidence = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < predictionArray.length; i++) {
      if (predictionArray[i] > maxConfidence) {
        maxConfidence = predictionArray[i];
        maxIndex = i;
      }
    }
    
    return {
      ageRange: ageRanges[maxIndex],
      confidence: maxConfidence
    };
  };
  
  /**
   * Process gender model prediction result
   */
  const processGenderResult = async (prediction) => {
    const predictionArray = await prediction.data();
    const maleConfidence = predictionArray[0];
    const femaleConfidence = predictionArray[1];
    
    const gender = maleConfidence > femaleConfidence ? 'Male' : 'Female';
    const confidence = gender === 'Male' ? maleConfidence : femaleConfidence;
    
    return {
      gender,
      confidence
    };
  };
  
  /**
   * Process expression model prediction result
   */
  const processExpressionResult = async (prediction) => {
    const expressions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprised', 'Neutral'];
    const predictionArray = await prediction.data();
    
    let maxConfidence = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < predictionArray.length; i++) {
      if (predictionArray[i] > maxConfidence) {
        maxConfidence = predictionArray[i];
        maxIndex = i;
      }
    }
    
    return {
      expression: expressions[maxIndex],
      confidence: maxConfidence
    };
  };
  
  return {
    models,
    isModelLoading: isLoading,
    modelError: error,
    predict,
    isPredicting,
  };
};