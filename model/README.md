# Model Training and Integration Guide

This directory contains scripts for training and integrating machine learning models for age, gender, and facial expression recognition in the FacialInsight application.

## Directory Structure

```
model/
├── data/                   # Datasets for training
│   ├── utkface/            # UTKFace dataset for age and gender
│   └── fer/                # FER2013 dataset for expressions
├── scripts/                # Utility scripts for data processing
├── training/               # Training scripts for individual models
│   ├── age/
│   ├── gender/
│   └── expression/
├── models/                 # Trained model files (created after training)
├── trainAllModels.js       # Script to train all models
├── convertModels.js        # Script to convert models for React Native
└── README.md               # This file
```

## Prerequisites

1. Node.js installed (version 14+)
2. TensorFlow.js dependencies installed:
   ```
   npm install @tensorflow/tfjs @tensorflow/tfjs-node fs-extra jimp
   ```

## Datasets

Before training, you need to download and prepare the datasets:

### 1. UTKFace Dataset (for age and gender models)

1. Download from: https://www.kaggle.com/datasets/jangedoo/utkface-new
2. Extract all images to: `model/data/utkface/`

### 2. FER2013 Dataset (for expression model)

1. Download from: https://www.kaggle.com/competitions/challenges-in-representation-learning-facial-expression-recognition-challenge
2. Extract all images to: `model/data/fer/`

## Training Models

### Option 1: Train All Models

Run the following command to train all three models:

```
node model/trainAllModels.js
```

This will train age, gender, and expression models in sequence. The training process may take several hours depending on your hardware.

### Option 2: Train Individual Models

You can train models individually:

```
# Train age model
node model/training/age/trainAgeModel.js

# Train gender model
node model/training/gender/trainGenderModel.js

# Train expression model
node model/training/expression/trainExpressionModel.js
```

## Converting Models for React Native

After training, convert the models for use in React Native:

```
node model/convertModels.js
```

This will:
1. Convert the models to TensorFlow.js format
2. Copy the model files to the app's assets directory
3. Create a model mapping file for easy reference in the app

## Integration with the App

The converted models will be available in the `assets/models/` directory. The React Native app can load these models using TensorFlow.js.

## Model Details

### Age Model
- Architecture: CNN based on MobileNet
- Input: 224x224x3 RGB images
- Output: 7 age ranges (0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+)

### Gender Model
- Architecture: Lightweight CNN
- Input: 224x224x3 RGB images
- Output: 2 classes (Male, Female)

### Expression Model
- Architecture: Specialized CNN for facial expressions
- Input: 48x48x1 grayscale images
- Output: 7 emotions (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)

## Troubleshooting

- **Memory Issues**: If you encounter memory errors during training, try reducing the batch size in `model/scripts/dataProcessing.js`
- **Dataset Format**: Ensure images are in supported formats (JPG, PNG)
- **Model Loading Errors**: Check that the model paths in `model_mapping.json` are correct