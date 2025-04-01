# Edge-Based Age, Gender, and Expression Recognition App

## Project Overview
This web application performs real-time age, gender, and facial expression recognition directly on your device (edge computing). Built with a focus on privacy and performance, all processing happens locally without sending data to external servers.

## Quick Start
There are multiple ways to access this application:

1. **Mobile Phone Access**: 
   Open this link on your mobile phone browser to try the app: [https://joshuarebo.github.io/Edge-AI-Project](https://joshuarebo.github.io/Edge-AI-Project)
   
   - Simply paste the link in your mobile browser
   - Allow camera permissions when prompted
   - Test all features including camera switching and facial analysis
   - View performance metrics on your specific device

2. **Source Code Repository**: [https://github.com/joshuarebo/Edge-AI-Project](https://github.com/joshuarebo/Edge-AI-Project)

## Features
- **Age Estimation**: 
  - Predicts age ranges: 0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+ years
  - High accuracy across all age groups
  - Real-time processing with confidence scores
  - Color-coded age range display
- **Gender Recognition**: 
  - Binary classification (Male/Female)
  - Confidence score display
  - Optimized for diverse facial features
- **Expression Analysis**: 
  - Detects 7 basic emotions: Happy, Sad, Angry, Neutral, Fear, Surprise, Disgust
  - Real-time emotion tracking
  - Confidence scores for each emotion
- **Performance Metrics**: 
  - Real-time processing speed display
  - Model confidence scores
  - Device-specific performance data
- **Mobile Optimization**: 
  - Responsive design for all screen sizes
  - Touch-friendly interface
  - Optimized for mobile processors
- **Camera Controls**: 
  - Front/back camera switching
  - Auto-focus support

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design for mobile and desktop devices
- Progressive Web App (PWA) capabilities
- Touch-optimized UI components

### Backend
- Node.js server for hosting and QR code generation
- Express for serving static files and handling requests
- WebSocket support for real-time updates
- RESTful API endpoints

### Models
- **Age Estimation Model**:
  - Trained on Adience dataset (87% accuracy)
  - 7 distinct age range categories
  - Best performance in 21-30 age range
  - Most challenging in 61+ age range
- **Gender Recognition Model**:
  - Trained on UTKFace dataset (94% accuracy)
  - Binary classification
  - Robust to lighting variations
- **Expression Analysis Model**:
  - Trained on FER2013 dataset (75% accuracy)
  - 7 emotion categories
  - Real-time emotion tracking

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser with camera support
- Minimum 4GB RAM recommended

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/joshuarebo/Edge-AI-Project.git
   cd Edge-AI-Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the app at http://localhost:5000

### GitHub Pages Deployment
For deploying to GitHub Pages:

1. Navigate to repository Settings
2. Scroll to "GitHub Pages" section
3. Select "main" branch as source
4. Click "Save"
5. Wait a few minutes for deployment
6. Access at: https://joshuarebo.github.io/Edge-AI-Project

## Usage Guide

1. **Start**: Click "Start Camera" to begin
2. **Permission**: Grant camera permission when prompted
3. **Capture**: Click the camera button to take a photo
4. **Analysis**: View the age, gender, and expression predictions
5. **Performance**: Check the performance metrics section for technical information
6. **Reset**: Click "Try Again" to restart

## Technical Specifications

### Model Performance
- **Age Estimation**:
  - Overall accuracy: 87% (Adience dataset)
  - 7 distinct age range categories
  - Best performance in 21-30 age range
  - Most challenging in 61+ age range
- **Gender Recognition**:
  - Overall accuracy: 94% (UTKFace dataset)
  - Male detection: 95% accuracy
  - Female detection: 93% accuracy
- **Expression Analysis**:
  - Overall accuracy: 75% (FER2013 dataset)
  - Best performance: 85% for Happy expression
  - Most challenging: 65% for Fear expression

### Edge Performance Metrics
- Image capture: ~20-50ms
- Image processing: ~300-400ms
- Total processing time: ~350-450ms
- Memory usage: ~200-300MB
- CPU utilization: 30-40% on average

### Training Datasets
- **Adience**: 
  - 26,580 images of 2,284 subjects
  - Age and gender classification
  - Diverse ethnic and cultural representation
- **UTKFace**: 
  - Over 20,000 face images
  - Age, gender, and ethnicity annotations
  - High-quality, well-labeled data
- **FER2013**: 
  - 35,887 grayscale images
  - 7 emotion categories
  - Standardized facial expression dataset

### Architecture
- **MobileNetV2**: 
  - Backbone for age and gender models
  - Optimized for mobile devices
  - Efficient feature extraction
- **Custom CNN**: 
  - Expression recognition with reduced parameters
  - Real-time processing optimization
  - Lightweight architecture

### Edge Computing Advantages
- **Privacy**: 
  - Local data processing
  - No data transmission
  - Secure processing
- **Speed**: 
  - Zero network latency
  - Real-time processing
  - Instant results
- **Reliability**: 
  - Offline functionality
  - No server dependency
  - Consistent performance
- **Cost**: 
  - No cloud computing expenses
  - No API costs
  - No data transfer fees

## Contributing
We welcome contributions! Please submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Adience dataset: https://talhassner.github.io/home/projects/Adience/Adience-data.html
- UTKFace dataset: https://susanqq.github.io/UTKFace/
- FER2013 dataset: https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data