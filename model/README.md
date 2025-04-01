# Edge-Based Age, Gender, and Expression Recognition Models

This directory contains the scripts for training and converting models used in the FacialInsight application. The models are optimized for edge deployment on mobile devices.

## Model Architecture

All models are based on MobileNetV2, which is designed for mobile and edge devices, with custom top layers for the specific tasks:

1. **Age Model**: Regression model that predicts age in years
2. **Gender Model**: Binary classification model that predicts male or female
3. **Expression Model**: Multi-class classification model that recognizes 7 basic facial expressions (angry, disgust, fear, happy, sad, surprise, neutral)

## Training Process

### Datasets Used

- **Age and Gender**: [Adience Dataset](https://talhassner.github.io/home/projects/Adience/Adience-data.html)
- **Facial Expression**: [AffectNet](http://mohammadmahoor.com/affectnet/)

### Training Setup

1. Base MobileNetV2 model pre-trained on ImageNet
2. Transfer learning approach:
   - Freeze base model layers
   - Add custom top layers
   - Train on task-specific data
3. Optional fine-tuning phase for improved accuracy

## Model Conversion

The models are converted to TensorFlow Lite format for efficient mobile deployment using the `convert_to_tflite.py` script. The conversion process includes:

1. Loading the trained Keras model
2. Converting to TFLite format
3. Applying quantization to reduce model size (optional)
4. Evaluating performance metrics

## Performance Metrics

| Model      | Accuracy | Size (MB) | Quantized Size (MB) | Inference Time (ms) |
|------------|----------|-----------|---------------------|---------------------|
| Age        | ~85%     | ~8.5      | ~2.2                | ~120                |
| Gender     | ~95%     | ~8.5      | ~2.2                | ~120                |
| Expression | ~70%     | ~8.5      | ~2.2                | ~120                |

*Note: These metrics are estimates and will vary based on device specifications.*

## Usage in Mobile Application

The converted TFLite models are bundled with the FacialInsight application and loaded at startup. The application uses TensorFlow Lite for React Native to perform inference directly on the device.

## Training Your Own Models

To train your own models:

1. Prepare your dataset in the required format
2. Configure the training parameters in `train_model.py`
3. Run the training script:
   ```
   python train_model.py
   ```
4. Convert the trained models to TFLite format:
   ```
   python convert_to_tflite.py
   ```

## Optimization Tips

1. Use quantization to reduce model size
2. Consider using model pruning for further size reduction
3. Adjust input image resolution based on device constraints
4. Use hardware acceleration when available (NNAPI, GPU, etc.)

## References

- [TensorFlow Lite Documentation](https://www.tensorflow.org/lite)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [Transfer Learning Guide](https://www.tensorflow.org/tutorials/images/transfer_learning)
