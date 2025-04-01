"""
Model Conversion Script for TensorFlow Lite

This script demonstrates how to convert trained Keras models to TensorFlow Lite format
for deployment on mobile devices. It includes optimization techniques like quantization
to reduce model size and improve inference speed.
"""

import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

# Configuration
MODEL_DIR = 'models'
OUTPUT_DIR = 'tflite_models'
INPUT_SIZE = (224, 224)
QUANTIZE = True  # Whether to apply quantization

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def convert_model_to_tflite(model_path, output_path, quantize=False):
    """
    Convert a Keras model to TensorFlow Lite format
    
    Args:
        model_path (str): Path to the Keras model (.h5)
        output_path (str): Path to save the TFLite model
        quantize (bool): Whether to apply quantization
    """
    # Load the Keras model
    model = load_model(model_path)
    print(f"Loaded model from {model_path}")
    
    # Create a converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Apply optimization if requested
    if quantize:
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        print("Applying quantization...")
        
        # Representative dataset for quantization (optional)
        # This is a placeholder and should be replaced with actual data
        def representative_dataset():
            for _ in range(100):
                data = np.random.rand(1, INPUT_SIZE[0], INPUT_SIZE[1], 3)
                yield [data.astype(np.float32)]
        
        converter.representative_dataset = representative_dataset
        converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
        converter.inference_input_type = tf.uint8
        converter.inference_output_type = tf.uint8
    
    # Convert the model
    tflite_model = converter.convert()
    print(f"Conversion complete.")
    
    # Save the model
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"Model saved to {output_path}")
    
    # Report model size
    model_size = os.path.getsize(output_path) / (1024 * 1024)  # Size in MB
    print(f"TFLite model size: {model_size:.2f} MB")
    
    return model_size

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
    
    # Run inference on test data
    correct_predictions = 0
    inference_times = []
    
    for i in range(len(test_images)):
        # Prepare input data
        input_data = np.expand_dims(test_images[i], axis=0).astype(np.float32)
        
        # Run inference and measure time
        start_time = tf.timestamp()
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])
        end_time = tf.timestamp()
        
        inference_time = (end_time - start_time) * 1000  # ms
        inference_times.append(inference_time)
        
        # Check prediction (depends on the model type)
        # This is a placeholder and should be adapted based on the task
        predicted_label = np.argmax(output_data)
        if predicted_label == test_labels[i]:
            correct_predictions += 1
    
    # Calculate metrics
    accuracy = correct_predictions / len(test_images)
    avg_inference_time = np.mean(inference_times)
    
    metrics = {
        'accuracy': accuracy,
        'avg_inference_time_ms': avg_inference_time,
        'inference_times': inference_times
    }
    
    print(f"Model accuracy: {accuracy:.4f}")
    print(f"Average inference time: {avg_inference_time:.2f} ms")
    
    return metrics

def main():
    # Model paths
    models = {
        'age': os.path.join(MODEL_DIR, 'age_model.h5'),
        'gender': os.path.join(MODEL_DIR, 'gender_model.h5'),
        'expression': os.path.join(MODEL_DIR, 'expression_model.h5')
    }
    
    results = {}
    
    # Convert each model
    for model_name, model_path in models.items():
        # Skip if model doesn't exist (for testing purposes)
        if not os.path.exists(model_path):
            print(f"Warning: {model_path} not found. Skipping.")
            continue
        
        # Output paths for normal and quantized models
        tflite_path = os.path.join(OUTPUT_DIR, f"{model_name}_model.tflite")
        quant_tflite_path = os.path.join(OUTPUT_DIR, f"{model_name}_model_quant.tflite")
        
        # Convert to TFLite (without quantization)
        print(f"\nConverting {model_name} model to TFLite...")
        model_size = convert_model_to_tflite(model_path, tflite_path, quantize=False)
        results[model_name] = {'normal_size': model_size}
        
        # Convert with quantization if enabled
        if QUANTIZE:
            print(f"\nConverting {model_name} model to quantized TFLite...")
            quant_model_size = convert_model_to_tflite(model_path, quant_tflite_path, quantize=True)
            results[model_name]['quantized_size'] = quant_model_size
            results[model_name]['size_reduction'] = (model_size - quant_model_size) / model_size * 100
    
    # Print comparison table
    print("\nModel Size Comparison:")
    print("=" * 60)
    print(f"{'Model':<15} {'Normal (MB)':<15} {'Quantized (MB)':<15} {'Reduction (%)':<15}")
    print("-" * 60)
    
    for model_name, result in results.items():
        normal_size = result.get('normal_size', 0)
        quant_size = result.get('quantized_size', 0)
        reduction = result.get('size_reduction', 0)
        
        print(f"{model_name:<15} {normal_size:<15.2f} {quant_size:<15.2f} {reduction:<15.2f}")
    
    # Plot size comparison
    plt.figure(figsize=(10, 6))
    
    models_list = list(results.keys())
    normal_sizes = [results[m].get('normal_size', 0) for m in models_list]
    quant_sizes = [results[m].get('quantized_size', 0) for m in models_list]
    
    x = np.arange(len(models_list))
    width = 0.35
    
    plt.bar(x - width/2, normal_sizes, width, label='Normal')
    plt.bar(x + width/2, quant_sizes, width, label='Quantized')
    
    plt.xlabel('Model')
    plt.ylabel('Size (MB)')
    plt.title('Model Size Comparison')
    plt.xticks(x, models_list)
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'model_size_comparison.png'))
    
    print(f"\nConversion complete! TFLite models saved to '{OUTPUT_DIR}' directory.")

if __name__ == "__main__":
    main()
