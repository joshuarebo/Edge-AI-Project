/**
 * Train Age Classification Model
 * 
 * This script trains a convolutional neural network for age classification
 * using the UTKFace dataset.
 */

const fs = require('fs-extra');
const path = require('path');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const {
  processImagesFromDir,
  splitTrainValidation,
  createDataGenerator,
  extractAgeLabel,
  IMG_SIZE,
  BATCH_SIZE
} = require('../../scripts/dataProcessing');

// Configuration
const DATA_DIR = path.join(__dirname, '../../data/utkface');
const MODEL_DIR = path.join(__dirname, '../../models');
const EPOCHS = 30;
const LEARNING_RATE = 0.001;

// Age model has 7 classes (age ranges)
const NUM_CLASSES = 7;

/**
 * Create the age classification model
 */
function createAgeModel() {
  // Use a MobileNet-like architecture, but simplified for our needs
  const model = tf.sequential();
  
  // Input layer and initial convolutions
  model.add(tf.layers.conv2d({
    inputShape: [IMG_SIZE, IMG_SIZE, 3],
    filters: 32,
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  
  // Depthwise separable convolution block 1
  model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    padding: 'same',
    depthMultiplier: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Depthwise separable convolution block 2
  model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    padding: 'same',
    depthMultiplier: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Depthwise separable convolution block 3
  model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    padding: 'same',
    depthMultiplier: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 256,
    kernelSize: 1,
    activation: 'relu'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Flatten and dense layers
  model.add(tf.layers.globalAveragePooling2d());
  model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax' }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
}

/**
 * Train the age model with the given data
 */
async function trainAgeModel() {
  console.log('Starting age model training...');
  
  // Check if data directory exists
  if (!(await fs.pathExists(DATA_DIR))) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    console.log('Please download the UTKFace dataset and extract it to this directory.');
    return;
  }
  
  try {
    // Process images
    console.log('Processing images...');
    const { xs, ys } = await processImagesFromDir(
      DATA_DIR, 
      IMG_SIZE, 
      false, // Keep color for age model
      extractAgeLabel
    );
    
    // Split data
    console.log('Splitting into train/validation sets...');
    const { train, validation } = splitTrainValidation(xs, ys);
    
    console.log(`Training samples: ${train.xs.shape[0]}`);
    console.log(`Validation samples: ${validation.xs.shape[0]}`);
    
    // Create model
    console.log('Creating model...');
    const model = createAgeModel();
    model.summary();
    
    // Training
    console.log('Training model...');
    await model.fit(train.xs, train.ys, {
      epochs: EPOCHS,
      batchSize: BATCH_SIZE,
      validationData: [validation.xs, validation.ys],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}/${EPOCHS}, loss: ${logs.loss.toFixed(4)}, accuracy: ${logs.accuracy.toFixed(4)}, val_loss: ${logs.val_loss.toFixed(4)}, val_accuracy: ${logs.val_accuracy.toFixed(4)}`);
        }
      }
    });
    
    // Create model directory if it doesn't exist
    await fs.ensureDir(MODEL_DIR);
    
    // Save the model
    const modelSavePath = `file://${path.join(MODEL_DIR, 'age_model')}`;
    await model.save(modelSavePath);
    console.log(`Age model saved to ${modelSavePath}`);
    
    // Convert to TensorFlow.js web format
    await model.save(`file://${path.join(MODEL_DIR, 'age_model_web')}`);
    console.log(`Web-friendly age model saved to ${path.join(MODEL_DIR, 'age_model_web')}`);
    
    // Clean up to avoid memory leaks
    xs.dispose();
    ys.dispose();
    train.xs.dispose();
    train.ys.dispose();
    validation.xs.dispose();
    validation.ys.dispose();
    
    return true;
  } catch (error) {
    console.error('Error during age model training:', error);
    return false;
  }
}

// Call the training function if this script is run directly
if (require.main === module) {
  trainAgeModel()
    .then(() => console.log('Age model training complete'))
    .catch(err => console.error('Error in age model training:', err));
}

module.exports = {
  trainAgeModel,
  createAgeModel
};