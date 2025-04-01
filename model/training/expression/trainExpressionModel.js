/**
 * Train Expression Recognition Model
 * 
 * This script trains a convolutional neural network for facial expression recognition
 * using the FER2013 dataset.
 */

const fs = require('fs-extra');
const path = require('path');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const {
  processImagesFromDir,
  splitTrainValidation,
  createDataGenerator,
  extractEmotionLabel,
  EMOTION_IMG_SIZE,
  BATCH_SIZE
} = require('../../scripts/dataProcessing');

// Configuration
const DATA_DIR = path.join(__dirname, '../../data/fer');
const MODEL_DIR = path.join(__dirname, '../../models');
const EPOCHS = 50;
const LEARNING_RATE = 0.001;

// Expression model has 7 classes (emotions)
const NUM_CLASSES = 7;

/**
 * Create the expression recognition model
 */
function createExpressionModel() {
  const model = tf.sequential();
  
  // Input layer - note we use grayscale images (1 channel) for FER dataset
  model.add(tf.layers.conv2d({
    inputShape: [EMOTION_IMG_SIZE, EMOTION_IMG_SIZE, 1],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));
  
  // Second convolutional block
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));
  
  // Third convolutional block
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));
  
  // Flatten and dense layers
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.5 }));
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
 * Train the expression model with the given data
 */
async function trainExpressionModel() {
  console.log('Starting expression model training...');
  
  // Check if data directory exists
  if (!(await fs.pathExists(DATA_DIR))) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    console.log('Please download the FER2013 dataset and extract it to this directory.');
    return;
  }
  
  try {
    // Process images
    console.log('Processing images...');
    const { xs, ys } = await processImagesFromDir(
      DATA_DIR, 
      EMOTION_IMG_SIZE, 
      true, // Use grayscale for expression model
      extractEmotionLabel
    );
    
    // Split data
    console.log('Splitting into train/validation sets...');
    const { train, validation } = splitTrainValidation(xs, ys);
    
    console.log(`Training samples: ${train.xs.shape[0]}`);
    console.log(`Validation samples: ${validation.xs.shape[0]}`);
    
    // Create model
    console.log('Creating model...');
    const model = createExpressionModel();
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
    const modelSavePath = `file://${path.join(MODEL_DIR, 'expression_model')}`;
    await model.save(modelSavePath);
    console.log(`Expression model saved to ${modelSavePath}`);
    
    // Convert to TensorFlow.js web format
    await model.save(`file://${path.join(MODEL_DIR, 'expression_model_web')}`);
    console.log(`Web-friendly expression model saved to ${path.join(MODEL_DIR, 'expression_model_web')}`);
    
    // Clean up to avoid memory leaks
    xs.dispose();
    ys.dispose();
    train.xs.dispose();
    train.ys.dispose();
    validation.xs.dispose();
    validation.ys.dispose();
    
    return true;
  } catch (error) {
    console.error('Error during expression model training:', error);
    return false;
  }
}

// Call the training function if this script is run directly
if (require.main === module) {
  trainExpressionModel()
    .then(() => console.log('Expression model training complete'))
    .catch(err => console.error('Error in expression model training:', err));
}

module.exports = {
  trainExpressionModel,
  createExpressionModel
};