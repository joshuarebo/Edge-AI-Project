/**
 * Convert Models for TensorFlow.js
 * 
 * This script converts the trained models to formats suitable for use in 
 * TensorFlow.js and React Native applications.
 */

const fs = require('fs-extra');
const path = require('path');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

// Configuration
const MODEL_DIR = path.join(__dirname, 'models');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'models');

// Ensure output directory exists
fs.ensureDirSync(OUTPUT_DIR);

/**
 * Convert model to web-friendly format
 * @param {string} modelName - Base name of the model
 */
async function convertModel(modelName) {
  try {
    console.log(`Converting ${modelName} model...`);
    
    // Load model
    const modelPath = `file://${path.join(MODEL_DIR, modelName)}`;
    const model = await tf.loadLayersModel(modelPath);
    
    // Convert to web format
    const webOutputPath = `file://${path.join(OUTPUT_DIR, `${modelName}_web`)}`;
    await model.save(webOutputPath);
    
    console.log(`${modelName} model converted and saved to ${webOutputPath}`);
    return true;
  } catch (error) {
    console.error(`Error converting ${modelName} model:`, error);
    return false;
  }
}

/**
 * Copy model metadata for use in the app
 * @param {string} modelName - Base name of the model
 */
async function copyModelMetadata(modelName) {
  try {
    const srcDir = path.join(MODEL_DIR, `${modelName}_web`);
    const destDir = path.join(OUTPUT_DIR, `${modelName}_web`);
    
    await fs.ensureDir(destDir);
    
    // Copy model files
    await fs.copy(srcDir, destDir);
    
    console.log(`${modelName} model metadata copied to ${destDir}`);
    return true;
  } catch (error) {
    console.error(`Error copying ${modelName} model metadata:`, error);
    return false;
  }
}

/**
 * Convert all models
 */
async function convertAllModels() {
  console.log('Starting model conversion process...');
  
  // Check if models directory exists
  if (!(await fs.pathExists(MODEL_DIR))) {
    console.error(`Models directory not found: ${MODEL_DIR}`);
    console.log('Please train the models first using trainAllModels.js');
    return;
  }
  
  try {
    // Convert models
    await convertModel('age_model');
    await convertModel('gender_model');
    await convertModel('expression_model');
    
    // Copy metadata
    await copyModelMetadata('age_model');
    await copyModelMetadata('gender_model');
    await copyModelMetadata('expression_model');
    
    console.log('\nModel conversion complete');
    console.log(`Converted models are available in: ${OUTPUT_DIR}`);
    
    // Create model mapping file for the app
    const modelMapping = {
      age: {
        path: 'models/age_model_web/model.json',
        classes: [
          '0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'
        ]
      },
      gender: {
        path: 'models/gender_model_web/model.json',
        classes: ['Female', 'Male']
      },
      expression: {
        path: 'models/expression_model_web/model.json',
        classes: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
      }
    };
    
    // Write model mapping file
    const mappingPath = path.join(OUTPUT_DIR, 'model_mapping.json');
    await fs.writeJson(mappingPath, modelMapping, { spaces: 2 });
    
    console.log(`Model mapping file created at: ${mappingPath}`);
  } catch (error) {
    console.error('Error during model conversion:', error);
  }
}

// Run the conversion if this script is called directly
if (require.main === module) {
  convertAllModels()
    .then(() => console.log('Conversion process complete'))
    .catch(err => console.error('Error in conversion process:', err));
}

module.exports = {
  convertAllModels
};