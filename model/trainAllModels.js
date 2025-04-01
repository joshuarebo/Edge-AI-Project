/**
 * Train All Models
 * 
 * This script orchestrates the training of all three models:
 * 1. Age classification
 * 2. Gender classification
 * 3. Expression recognition
 */

const fs = require('fs-extra');
const path = require('path');

const { trainAgeModel } = require('./training/age/trainAgeModel');
const { trainGenderModel } = require('./training/gender/trainGenderModel');
const { trainExpressionModel } = require('./training/expression/trainExpressionModel');

// Create model directory
const MODEL_DIR = path.join(__dirname, 'models');
fs.ensureDirSync(MODEL_DIR);

// Configuration for the training process
const DATA_INSTRUCTIONS = `
==========================================
DATASET PREPARATION INSTRUCTIONS
==========================================

Before running this script, please download and prepare the datasets:

1. UTKFace Dataset (for age and gender models):
   - Download from: https://www.kaggle.com/datasets/jangedoo/utkface-new
   - Extract all images to: model/data/utkface/

2. FER2013 Dataset (for expression model):
   - Download from: https://www.kaggle.com/competitions/challenges-in-representation-learning-facial-expression-recognition-challenge
   - Extract all images to: model/data/fer/

Note: The folder structure should be:
- model/data/utkface/ (containing .jpg files)
- model/data/fer/ (containing .jpg or .png files)
`;

/**
 * Main function to train all models
 */
async function trainAllModels() {
  console.log(DATA_INSTRUCTIONS);
  
  // Check if data directories exist
  const utkfaceDir = path.join(__dirname, 'data', 'utkface');
  const ferDir = path.join(__dirname, 'data', 'fer');
  
  const utkfaceExists = await fs.pathExists(utkfaceDir);
  const ferExists = await fs.pathExists(ferDir);
  
  if (!utkfaceExists) {
    console.error(`UTKFace data directory not found: ${utkfaceDir}`);
    console.log('Please download the UTKFace dataset as per the instructions above.');
    return;
  }
  
  if (!ferExists) {
    console.error(`FER data directory not found: ${ferDir}`);
    console.log('Please download the FER2013 dataset as per the instructions above.');
    return;
  }
  
  // Start the training processes
  console.log('\n=== STARTING MODEL TRAINING ===\n');
  
  try {
    // Train age model
    console.log('\n=== TRAINING AGE MODEL ===\n');
    await trainAgeModel();
    
    // Train gender model
    console.log('\n=== TRAINING GENDER MODEL ===\n');
    await trainGenderModel();
    
    // Train expression model
    console.log('\n=== TRAINING EXPRESSION MODEL ===\n');
    await trainExpressionModel();
    
    console.log('\n=== ALL MODELS TRAINED SUCCESSFULLY ===\n');
    console.log(`Models have been saved to: ${MODEL_DIR}`);
    console.log('You can now use these models in your application.');
  } catch (error) {
    console.error('Error during model training:', error);
  }
}

// Run the training if this script is called directly
if (require.main === module) {
  trainAllModels()
    .then(() => console.log('Training process complete'))
    .catch(err => console.error('Error in training process:', err));
}

module.exports = {
  trainAllModels
};