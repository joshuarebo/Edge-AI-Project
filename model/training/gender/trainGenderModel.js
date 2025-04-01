/**
 * Train Gender Classification Model
 * 
 * This script trains a convolutional neural network for gender classification
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
  extractGenderLabel,
  IMG_SIZE,
  BATCH_SIZE
} = require('../../scripts/dataProcessing');

// Configuration
const DATA_DIR = path.join(__dirname, '../../data/utkface');
const MODEL_DIR = path.join(__dirname, '../../models');
const EPOCHS = 25;
const LEARNING_RATE = 0.001;

// Gender model has 2 classes (male/female)
const NUM_CLASSES = 2;

/**
 * Create the gender classification model
 */
function createGenderModel() {
  const model = tf.sequential();
  
  // Base feature extraction layers
  model.add(tf.layers.conv2d({
    inputShape: [IMG_SIZE, IMG_SIZE, 3],
    filters: 32,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Classification layers
  model.add(tf.layers.flatten());
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
 * Train the gender model with the given data
 */
async function trainGenderModel() {
  console.log('Starting gender model training...');
  
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
      false, // Keep color for gender model
      extractGenderLabel
    );
    
    // Split data
    console.log('Splitting into train/validation sets...');
    const { train, validation } = splitTrainValidation(xs, ys);
    
    console.log(`Training samples: ${train.xs.shape[0]}`);
    console.log(`Validation samples: ${validation.xs.shape[0]}`);
    
    // Create model
    console.log('Creating model...');
    const model = createGenderModel();
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
    const modelSavePath = `file://${path.join(MODEL_DIR, 'gender_model')}`;
    await model.save(modelSavePath);
    console.log(`Gender model saved to ${modelSavePath}`);
    
    // Convert to TensorFlow.js web format
    await model.save(`file://${path.join(MODEL_DIR, 'gender_model_web')}`);
    console.log(`Web-friendly gender model saved to ${path.join(MODEL_DIR, 'gender_model_web')}`);
    
    // Clean up to avoid memory leaks
    xs.dispose();
    ys.dispose();
    train.xs.dispose();
    train.ys.dispose();
    validation.xs.dispose();
    validation.ys.dispose();
    
    return true;
  } catch (error) {
    console.error('Error during gender model training:', error);
    return false;
  }
}

// Call the training function if this script is run directly
if (require.main === module) {
  trainGenderModel()
    .then(() => console.log('Gender model training complete'))
    .catch(err => console.error('Error in gender model training:', err));
}

module.exports = {
  trainGenderModel,
  createGenderModel
};