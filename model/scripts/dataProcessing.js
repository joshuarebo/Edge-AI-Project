/**
 * Data Processing Utilities for Machine Learning Models
 * 
 * This file contains utility functions for processing image data for 
 * age, gender, and emotion recognition models.
 */

const fs = require('fs-extra');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const Jimp = require('jimp');

// Configuration constants
const IMG_SIZE = 224; // Standard size for age and gender models
const EMOTION_IMG_SIZE = 48; // Smaller size for emotion model
const BATCH_SIZE = 32;

/**
 * Process images from a directory into tensors
 * @param {string} dataDir - Directory with images
 * @param {number} imgSize - Target image size
 * @param {boolean} grayscale - Whether to convert to grayscale
 * @param {Function} labelExtractor - Function to extract labels from filenames
 * @returns {Promise<{xs: tf.Tensor, ys: tf.Tensor}>} - Tensors for training
 */
async function processImagesFromDir(dataDir, imgSize, grayscale = false, labelExtractor) {
  // Get all image files
  const files = await fs.readdir(dataDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.png' || ext === '.jpeg';
  });
  
  console.log(`Found ${imageFiles.length} image files`);
  
  if (imageFiles.length === 0) {
    throw new Error('No image files found in the specified directory');
  }
  
  // Process in batches to avoid memory issues
  const batchSize = 100;
  const numBatches = Math.ceil(imageFiles.length / batchSize);
  
  let allImages = [];
  let allLabels = [];
  
  for (let batchIdx = 0; batchIdx < numBatches; batchIdx++) {
    const startIdx = batchIdx * batchSize;
    const endIdx = Math.min(startIdx + batchSize, imageFiles.length);
    const batchFiles = imageFiles.slice(startIdx, endIdx);
    
    console.log(`Processing batch ${batchIdx + 1}/${numBatches} (${batchFiles.length} images)`);
    
    // Process images in this batch
    const batchPromises = batchFiles.map(async (file) => {
      try {
        const filePath = path.join(dataDir, file);
        const image = await Jimp.read(filePath);
        
        // Resize image
        image.resize(imgSize, imgSize);
        
        // Convert to grayscale if needed
        if (grayscale) {
          image.grayscale();
        }
        
        // Convert to pixel buffer
        const channels = grayscale ? 1 : 3;
        const buffer = new Float32Array(imgSize * imgSize * channels);
        
        let idx = 0;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx2) {
          const r = this.bitmap.data[idx2 + 0] / 255.0;
          
          if (grayscale) {
            buffer[idx++] = r;
          } else {
            const g = this.bitmap.data[idx2 + 1] / 255.0;
            const b = this.bitmap.data[idx2 + 2] / 255.0;
            buffer[idx++] = r;
            buffer[idx++] = g;
            buffer[idx++] = b;
          }
        });
        
        // Extract label from filename
        const label = labelExtractor(file);
        
        return { image: buffer, label };
      } catch (error) {
        console.error(`Error processing image ${file}:`, error);
        return null;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    const validResults = batchResults.filter(result => result !== null);
    
    // Add to accumulated data
    allImages = allImages.concat(validResults.map(result => result.image));
    allLabels = allLabels.concat(validResults.map(result => result.label));
  }
  
  // Create tensors
  const channels = grayscale ? 1 : 3;
  const xs = tf.tensor4d(
    allImages, 
    [allImages.length, imgSize, imgSize, channels]
  );
  
  const ys = tf.tensor2d(
    allLabels, 
    [allLabels.length, allLabels[0].length]
  );
  
  return { xs, ys };
}

/**
 * Split data into training and validation sets
 * @param {tf.Tensor} xs - Input tensor
 * @param {tf.Tensor} ys - Labels tensor
 * @param {number} validationSplit - Fraction of data to use for validation
 * @returns {Object} Training and validation data
 */
function splitTrainValidation(xs, ys, validationSplit = 0.2) {
  const numExamples = xs.shape[0];
  const numValidation = Math.round(numExamples * validationSplit);
  const numTrain = numExamples - numValidation;
  
  // Create training set
  const trainXs = xs.slice([0, 0, 0, 0], [numTrain, xs.shape[1], xs.shape[2], xs.shape[3]]);
  const trainYs = ys.slice([0, 0], [numTrain, ys.shape[1]]);
  
  // Create validation set
  const valXs = xs.slice([numTrain, 0, 0, 0], [numValidation, xs.shape[1], xs.shape[2], xs.shape[3]]);
  const valYs = ys.slice([numTrain, 0], [numValidation, ys.shape[1]]);
  
  return {
    train: { xs: trainXs, ys: trainYs },
    validation: { xs: valXs, ys: valYs }
  };
}

/**
 * Create a data generator for training
 * @param {tf.Tensor} xs - Input tensor
 * @param {tf.Tensor} ys - Labels tensor
 * @param {number} batchSize - Batch size
 * @returns {Object} Data generator
 */
function createDataGenerator(xs, ys, batchSize = BATCH_SIZE) {
  const numExamples = xs.shape[0];
  let currentIndex = 0;
  
  return {
    next() {
      if (currentIndex + batchSize >= numExamples) {
        // Reset if we reached the end
        currentIndex = 0;
      }
      
      const batchXs = xs.slice(
        [currentIndex, 0, 0, 0],
        [batchSize, xs.shape[1], xs.shape[2], xs.shape[3]]
      );
      
      const batchYs = ys.slice(
        [currentIndex, 0],
        [batchSize, ys.shape[1]]
      );
      
      currentIndex += batchSize;
      
      return { xs: batchXs, ys: batchYs };
    },
    
    reset() {
      currentIndex = 0;
    }
  };
}

/**
 * Extract age from UTKFace filename
 * UTKFace filename format: [age]_[gender]_[race]_[date&time].jpg
 * @param {string} filename - The image filename
 * @returns {number[]} One-hot encoded age range
 */
function extractAgeLabel(filename) {
  try {
    // Extract age from filename (first component before underscore)
    const parts = filename.split('_');
    const age = parseInt(parts[0], 10);
    
    // Define age ranges
    // [0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+]
    const ageRanges = [10, 20, 30, 40, 50, 60];
    
    // Create one-hot encoding (7 categories)
    const label = new Array(7).fill(0);
    
    // Find the appropriate range
    let rangeIndex = 0;
    for (let i = 0; i < ageRanges.length; i++) {
      if (age <= ageRanges[i]) {
        rangeIndex = i;
        break;
      }
      rangeIndex = ageRanges.length; // 61+
    }
    
    label[rangeIndex] = 1;
    return label;
  } catch (error) {
    console.error(`Error extracting age from filename ${filename}:`, error);
    // Default to unknown (all zeros)
    return new Array(7).fill(0);
  }
}

/**
 * Extract gender from UTKFace filename
 * UTKFace filename format: [age]_[gender]_[race]_[date&time].jpg
 * @param {string} filename - The image filename
 * @returns {number[]} One-hot encoded gender
 */
function extractGenderLabel(filename) {
  try {
    // Extract gender from filename (second component between underscores)
    const parts = filename.split('_');
    const gender = parseInt(parts[1], 10);
    
    // One-hot encoding (0=female, 1=male)
    return [gender === 0 ? 1 : 0, gender === 1 ? 1 : 0];
  } catch (error) {
    console.error(`Error extracting gender from filename ${filename}:`, error);
    // Default to unknown (all zeros)
    return [0, 0];
  }
}

/**
 * Extract emotion from FER dataset
 * @param {string} filename - The image filename
 * @returns {number[]} One-hot encoded emotion
 */
function extractEmotionLabel(filename) {
  try {
    // For demonstration, extract emotion from filename
    // In practice, the FER dataset would need specific handling
    // based on how it's organized
    
    // Placeholder: simple mapping based on filename prefix
    // Real implementation would need dataset-specific logic
    const emotionMap = {
      'angry': 0,
      'disgust': 1,
      'fear': 2,
      'happy': 3,
      'sad': 4,
      'surprise': 5,
      'neutral': 6
    };
    
    // Try to extract emotion from filename
    let emotion = 6; // Default to neutral
    for (const [key, value] of Object.entries(emotionMap)) {
      if (filename.toLowerCase().includes(key)) {
        emotion = value;
        break;
      }
    }
    
    // Create one-hot encoding (7 emotions)
    const label = new Array(7).fill(0);
    label[emotion] = 1;
    
    return label;
  } catch (error) {
    console.error(`Error extracting emotion from filename ${filename}:`, error);
    // Default to neutral (index 6)
    const label = new Array(7).fill(0);
    label[6] = 1; // Neutral
    return label;
  }
}

module.exports = {
  IMG_SIZE,
  EMOTION_IMG_SIZE,
  BATCH_SIZE,
  processImagesFromDir,
  splitTrainValidation,
  createDataGenerator,
  extractAgeLabel,
  extractGenderLabel,
  extractEmotionLabel
};