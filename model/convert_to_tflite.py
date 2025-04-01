"""
Model Conversion Script for TensorFlow Lite

This script demonstrates how to convert trained Keras models to TensorFlow Lite format
for deployment on mobile devices. It includes optimization techniques like quantization
to reduce model size and improve inference speed.
"""

import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

def convert_model_to_tflite(model_path, output_path, quantize=False):
    """
    Convert a Keras model to TensorFlow Lite format
    
    Args:
        model_path (str): Path to the Keras model (.h5)
        output_path (str): Path to save the TFLite model
        quantize (bool): Whether to apply quantization
    """
    print(f"Loading model from {model_path}")
    model = load_model(model_path)
    
    # Create TFLite converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Set optimization options
    if quantize:
        print("Applying post-training quantization")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        
        # For full integer quantization, a representative dataset is needed
        def representative_dataset():
            # In a real implementation, this would use actual validation data
            # Here, we just generate some random data of the right shape
            for _ in range(100):
                # Get input shape from model
                input_shape = model.inputs[0].shape
                # Generate random data
                yield [np.random.rand(*input_shape).astype(np.float32)]
        
        converter.representative_dataset = representative_dataset
        converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
        converter.inference_input_type = tf.uint8
        converter.inference_output_type = tf.uint8
    
    # Convert the model
    print("Converting model to TFLite format")
    tflite_model = converter.convert()
    
    # Save the model
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"TFLite model saved to {output_path}")
    
    # Report model size
    tflite_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"TFLite model size: {tflite_size:.2f} MB")
    
    return output_path

def evaluate_tflite_model(tflite_path, test_images, test_labels):
    """
    Evaluate a TFLite model for accuracy and performance
    
    Note: This is a placeholder function and would need to be adapted for actual use
    
    Args:
        tflite_path (str): Path to the TFLite model
        test_images (np.array): Test images
        test_labels (np.array): Test labels
        
    Returns:
        dict: Evaluation metrics
    """
    # Load TFLite model
    interpreter = tf.lite.Interpreter(model_path=tflite_path)
    interpreter.allocate_tensors()
    
    # Get input and output tensors
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Run inference on test images
    correct = 0
    for i, image in enumerate(test_images):
        # Preprocess image to match model input
        input_data = np.expand_dims(image, axis=0).astype(np.float32)
        
        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], input_data)
        
        # Run inference
        interpreter.invoke()
        
        # Get output
        output = interpreter.get_tensor(output_details[0]['index'])
        
        # Get prediction
        prediction = np.argmax(output)
        true_label = np.argmax(test_labels[i])
        
        if prediction == true_label:
            correct += 1
    
    # Calculate accuracy
    accuracy = correct / len(test_images)
    
    return {'accuracy': accuracy}

def main():
    parser = argparse.ArgumentParser(description='Convert Keras models to TensorFlow Lite')
    parser.add_argument('--model-path', type=str, required=True,
                      help='path to Keras model (.h5)')
    parser.add_argument('--output-path', type=str, required=True,
                      help='path to save TFLite model')
    parser.add_argument('--quantize', action='store_true',
                      help='apply post-training quantization')
    
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(args.output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    
    # Convert model
    convert_model_to_tflite(args.model_path, args.output_path, args.quantize)
    
    print("\nConversion complete!")
    print("To use this model in React Native with TensorFlow.js:")
    print("1. Make sure the TensorFlow.js package is installed")
    print("2. Load the model using tf.loadTFLiteModel() function")
    print("3. Preprocess input images to match the model's expected format")

if __name__ == '__main__':
    main()