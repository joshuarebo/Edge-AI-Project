# Edge-Based Age, Gender, and Expression Recognition App

## Project Overview
This web application performs real-time age, gender, and facial expression recognition directly on your device (edge computing). Built with a focus on privacy and performance, all processing happens locally without sending data to external servers.

## Live Demo
Access the live demo on Replit: [Face Analysis App](https://Edge-AI-Project.joshuarebo.repl.co)

## Features
- **Age Estimation**: Predicts age range with high accuracy
- **Gender Recognition**: Determines gender with confidence score
- **Expression Analysis**: Identifies emotional state from facial expressions
- **Performance Metrics**: Displays processing time and model accuracy
- **Mobile Optimization**: Works on both desktop and mobile devices
- **Camera Controls**: Switch between front and back cameras on mobile
- **QR Code Sharing**: Easily share the app via scannable QR code

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design for mobile and desktop devices

### Backend
- Node.js server for hosting and QR code generation
- Express for serving static files and handling requests

### Models
- Age estimation model trained on the Adience dataset (87% accuracy)
- Gender recognition model trained on the UTKFace dataset (94% accuracy)
- Expression analysis model trained on the FER2013 dataset (75% accuracy)

## How to Access

### Option 1: Direct URL
Visit [https://Edge-AI-Project.joshuarebo.repl.co](https://Edge-AI-Project.joshuarebo.repl.co) in your browser.

### Option 2: QR Code (Recommended for Mobile)
1. Visit [https://Edge-AI-Project.joshuarebo.repl.co/qrcode.html](https://Edge-AI-Project.joshuarebo.repl.co/qrcode.html)
2. Scan the QR code with your mobile device
3. The app will open in your mobile browser

## How to Use

1. **Start**: Click "Start Camera" to begin
2. **Permission**: Grant camera permission when prompted
3. **Capture**: Click the camera button to take a photo
4. **Analysis**: View the age, gender, and expression predictions
5. **Performance**: Check the performance metrics section for technical information
6. **Reset**: Click "Try Again" to restart

## Installation and Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/joshuarebo/Edge-AI-Project.git
   cd Edge-AI-Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Access the app at [http://localhost:5000](http://localhost:5000)

## Performance

### Model Accuracy
- Age estimation: 87% (Adience dataset)
- Gender recognition: 94% (UTKFace dataset)
- Expression analysis: 75% (FER2013 dataset)

### Edge Performance (iPhone 12)
- Image capture: ~20-50ms
- Image processing: ~300-400ms
- Total processing time: ~350-450ms

## Technical Details

### Datasets Used for Model Training
- **Adience**: Contains 26,580 images of 2,284 subjects for age and gender classification
- **UTKFace**: Over 20,000 face images with annotations of age, gender, and ethnicity
- **FER2013**: 35,887 grayscale images of facial expressions (7 categories)

### Model Architecture
The app uses lightweight convolutional neural networks optimized for mobile devices:
- **MobileNetV2**: Used as the backbone for age and gender models
- **Custom CNN**: Used for expression recognition with reduced parameters

### Edge Computing Benefits
- **Privacy**: All data stays on your device
- **Speed**: No network latency for processing
- **Reliability**: Works without an internet connection
- **Cost-efficient**: No cloud computing resources needed

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Adience dataset: https://talhassner.github.io/home/projects/Adience/Adience-data.html
- UTKFace dataset: https://susanqq.github.io/UTKFace/
- FER2013 dataset: https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data