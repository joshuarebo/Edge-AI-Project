import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
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
   * @param {string} modelType - Type of model ('age', 'gender', 'expression')
   * @param {Object} inputData - Data to run prediction on
   * @returns {Promise<Object>} Prediction results
   */
  const predict = async (modelType, inputData) => {
    if (!models[modelType]) {
      throw new Error(`Model for ${modelType} not found`);
    }
    
    try {
      setIsPredicting(true);
      
      // Get the model
      const model = models[modelType];
      
      // Run prediction
      const startTime = performance.now();
      
      // Convert input data to tensor
      let inputTensor;
      if (inputData instanceof tf.Tensor) {
        inputTensor = inputData;
      } else {
        // Assuming inputData is an array of pixel values in [0, 255]
        inputTensor = tf.tensor(inputData);
      }
      
      // Preprocess the input tensor
      const preprocessedInput = preprocessInput(inputTensor, modelType);
      
      // Run inference
      const prediction = await model.predict(preprocessedInput);
      
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
      
      // Clean up tensors
      inputTensor.dispose();
      preprocessedInput.dispose();
      prediction.dispose();
      
      return result;
    } catch (error) {
      console.error(`Error predicting with ${modelType} model:`, error);
      throw error;
    } finally {
      setIsPredicting(false);
    }
  };
  
  /**
   * Preprocess input tensor based on model type
   * @param {tf.Tensor} tensor - Input tensor
   * @param {string} modelType - Type of model
   * @returns {tf.Tensor} Preprocessed tensor
   */
  const preprocessInput = (tensor, modelType) => {
    // Reshape if needed
    let processed = tensor;
    
    // Resize to model input size
    const modelInputSize = getModelInputSize(modelType);
    processed = tf.image.resizeBilinear(processed, [modelInputSize, modelInputSize]);
    
    // Normalize
    processed = processed.div(255.0);
    
    // Convert to grayscale for expression model
    if (modelType === 'expression') {
      const grayscale = tf.sum(processed.mul(tf.tensor([0.2989, 0.5870, 0.1140])), -1);
      processed = grayscale.expandDims(-1);
    }
    
    // Add batch dimension if needed
    if (processed.shape.length === 3) {
      processed = processed.expandDims(0);
    }
    
    return processed;
  };
  
  /**
   * Get model input size
   * @param {string} modelType - Type of model
   * @returns {number} Input size
   */
  const getModelInputSize = (modelType) => {
    switch (modelType) {
      case 'age':
      case 'gender':
        return 224; // MobileNet based models
      case 'expression':
        return 48; // Custom CNN
      default:
        return 224;
    }
  };
  
  /**
   * Process age model prediction result
   * @param {tf.Tensor} prediction - Model prediction tensor
   * @returns {Object} Processed result
   */
  const processAgeResult = (prediction) => {
    // Age ranges
    const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'];
    
    // Get prediction as array
    const predictionArray = prediction.dataSync();
    
    // Find max confidence and corresponding age range
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
      confidence: maxConfidence,
      allRanges: predictionArray.map((conf, i) => ({
        range: ageRanges[i],
        confidence: conf,
      })),
    };
  };
  
  /**
   * Process gender model prediction result
   * @param {tf.Tensor} prediction - Model prediction tensor
   * @returns {Object} Processed result
   */
  const processGenderResult = (prediction) => {
    // Get prediction as array
    const predictionArray = prediction.dataSync();
    
    // Gender is binary classification (0 = Male, 1 = Female)
    const maleConfidence = predictionArray[0];
    const femaleConfidence = predictionArray[1];
    
    const gender = maleConfidence > femaleConfidence ? 'Male' : 'Female';
    const confidence = gender === 'Male' ? maleConfidence : femaleConfidence;
    
    return {
      gender,
      confidence,
      male: maleConfidence,
      female: femaleConfidence,
    };
  };
  
  /**
   * Process expression model prediction result
   * @param {tf.Tensor} prediction - Model prediction tensor
   * @returns {Object} Processed result
   */
  const processExpressionResult = (prediction) => {
    // Expression classes
    const expressions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprised', 'Neutral'];
    
    // Get prediction as array
    const predictionArray = prediction.dataSync();
    
    // Find max confidence and corresponding expression
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
      confidence: maxConfidence,
      allExpressions: predictionArray.map((conf, i) => ({
        expression: expressions[i],
        confidence: conf,
      })),
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