/**
 * Utility functions for face detection and processing
 * These are placeholder implementations that will be replaced with TensorFlow.js code
 */
import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system';
import Jimp from 'jimp';

/**
 * Process a captured image through the TensorFlow models
 * @param {Object} photo - The photo taken by the camera
 * @param {Object} face - Face detection data from FaceDetector
 * @param {Object} models - TensorFlow Lite models
 * @returns {Object} Results with age, gender, expression and inference time
 */
export const processImage = async (photo, face, models) => {
  console.log('Processing image through models...');
  
  try {
    // Start timing
    const startTime = performance.now();
    
    // Crop the face from the image
    const processedImage = await cropFaceFromImage(photo, face);
    
    // Convert image to tensor
    const tensor = await imageToTensor(processedImage.uri);
    
    // Run predictions
    console.log('Running predictions...');
    const ageResult = await predictAge(tensor, models.age);
    const genderResult = await predictGender(tensor, models.gender);
    const expressionResult = await predictExpression(tensor, models.expression);
    
    // End timing
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    console.log('Prediction complete:', {
      age: ageResult.ageRange,
      gender: genderResult.gender,
      expression: expressionResult.expression,
      processingTime
    });
    
    // Clean up tensors
    tf.dispose(tensor);
    
    // Return results
    return {
      age: ageResult,
      gender: genderResult,
      expression: expressionResult,
      processingTime,
      faceCoordinates: {
        x: face.bounds.origin.x,
        y: face.bounds.origin.y,
        width: face.bounds.size.width,
        height: face.bounds.size.height,
      },
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Crop the image to focus on the detected face
 * @param {Object} photo - The photo taken by the camera
 * @param {Object} face - Face detection data
 * @returns {Object} Processed image data
 */
export const cropFaceFromImage = async (photo, face) => {
  try {
    // Get face bounds
    const { origin, size } = face.bounds;
    
    // Add padding around the face (20%)
    const padding = {
      x: size.width * 0.2,
      y: size.height * 0.2,
    };
    
    // Calculate crop dimensions
    const cropX = Math.max(0, origin.x - padding.x);
    const cropY = Math.max(0, origin.y - padding.y);
    const cropWidth = Math.min(photo.width - cropX, size.width + padding.x * 2);
    const cropHeight = Math.min(photo.height - cropY, size.height + padding.y * 2);
    
    // Create temporary file path for cropped image
    const tempUri = FileSystem.cacheDirectory + 'cropped_face.jpg';
    
    // Use Jimp to crop the image
    const image = await Jimp.read(photo.uri);
    image
      .crop(cropX, cropY, cropWidth, cropHeight)
      .resize(224, 224) // Resize to model input size
      .quality(90);
    
    // Save the cropped image
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    await FileSystem.writeAsStringAsync(tempUri, buffer.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Return the cropped image info
    return {
      uri: tempUri,
      width: 224,
      height: 224,
    };
  } catch (error) {
    console.error('Error cropping face from image:', error);
    // If cropping fails, return the original photo
    return photo;
  }
};

/**
 * Convert image to tensor for model input
 * @param {string} uri - URI of the image
 * @returns {tf.Tensor3D} Tensor representation of the image
 */
export const imageToTensor = async (uri) => {
  try {
    // Read image file
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Load the image
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    
    // Decode and convert to tensor
    const imageTensor = tf.node
      ? tf.node.decodeImage(raw)
      : tf.browser.fromPixels(
          await createImageBitmap(new Blob([raw], { type: 'image/jpeg' }))
        );
    
    return imageTensor;
  } catch (error) {
    console.error('Error converting image to tensor:', error);
    
    // Fallback: create a placeholder tensor of the right shape
    // This should be replaced with proper error handling in production
    return tf.zeros([224, 224, 3]);
  }
};

/**
 * Predict age using the age model
 * @param {tf.Tensor} tensor - Input tensor
 * @param {tflite.Model} model - Age TFLite model
 * @returns {Object} Age prediction and confidence
 */
export const predictAge = async (tensor, model) => {
  try {
    if (!model) {
      throw new Error('Age model not loaded');
    }
    
    // Clone the tensor to avoid issues with multiple model runs
    const input = tensor.clone();
    
    // Run prediction using the TensorFlow model hook
    const prediction = await model.predict(input);
    
    // Process the prediction result
    // Age ranges: '0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'
    const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'];
    
    // Get prediction as array
    const predictionArray = await prediction.data();
    
    // Find max confidence and corresponding age range
    let maxConfidence = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < predictionArray.length; i++) {
      if (predictionArray[i] > maxConfidence) {
        maxConfidence = predictionArray[i];
        maxIndex = i;
      }
    }
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return {
      ageRange: ageRanges[maxIndex],
      confidence: maxConfidence,
    };
  } catch (error) {
    console.error('Error predicting age:', error);
    return {
      ageRange: 'Unknown',
      confidence: 0,
    };
  }
};

/**
 * Predict gender using the gender model
 * @param {tf.Tensor} tensor - Input tensor
 * @param {tflite.Model} model - Gender TFLite model
 * @returns {Object} Gender prediction and confidence
 */
export const predictGender = async (tensor, model) => {
  try {
    if (!model) {
      throw new Error('Gender model not loaded');
    }
    
    // Clone the tensor to avoid issues with multiple model runs
    const input = tensor.clone();
    
    // Run prediction using the TensorFlow model hook
    const prediction = await model.predict(input);
    
    // Get prediction as array - gender is binary classification (0 = Male, 1 = Female)
    const predictionArray = await prediction.data();
    const maleConfidence = predictionArray[0];
    const femaleConfidence = predictionArray[1];
    
    const gender = maleConfidence > femaleConfidence ? 'Male' : 'Female';
    const confidence = gender === 'Male' ? maleConfidence : femaleConfidence;
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return {
      gender,
      confidence,
    };
  } catch (error) {
    console.error('Error predicting gender:', error);
    return {
      gender: 'Unknown',
      confidence: 0,
    };
  }
};

/**
 * Predict facial expression using the expression model
 * @param {tf.Tensor} tensor - Input tensor
 * @param {tflite.Model} model - Expression TFLite model
 * @returns {Object} Expression prediction and confidence
 */
export const predictExpression = async (tensor, model) => {
  try {
    if (!model) {
      throw new Error('Expression model not loaded');
    }
    
    // Clone the tensor to avoid issues with multiple model runs
    const input = tensor.clone();
    
    // Run prediction using the TensorFlow model hook
    const prediction = await model.predict(input);
    
    // Process the result
    const expressions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprised', 'Neutral'];
    
    // Get prediction as array
    const predictionArray = await prediction.data();
    
    // Find max confidence and corresponding expression
    let maxConfidence = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < predictionArray.length; i++) {
      if (predictionArray[i] > maxConfidence) {
        maxConfidence = predictionArray[i];
        maxIndex = i;
      }
    }
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return {
      expression: expressions[maxIndex],
      confidence: maxConfidence,
    };
  } catch (error) {
    console.error('Error predicting expression:', error);
    return {
      expression: 'Unknown',
      confidence: 0,
    };
  }
};