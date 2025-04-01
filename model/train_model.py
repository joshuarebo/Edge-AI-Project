"""
Model Training Script for Age, Gender, and Expression Recognition

This script demonstrates how to train deep learning models for age, gender, and expression
recognition using TensorFlow/Keras. In a real application, this would be used to train
the models that are later converted to TensorFlow Lite format for mobile deployment.
"""

import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import MobileNetV2

# Configuration
IMG_SIZE = 224  # Standard size for age and gender models
EMOTION_IMG_SIZE = 48  # Smaller size for emotion model
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

# Age ranges for classification
AGE_RANGES = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+']
GENDERS = ['Female', 'Male']
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def create_base_model(input_shape=(IMG_SIZE, IMG_SIZE, 3)):
    """
    Create a base model using MobileNetV2 as feature extractor
    """
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze the base model
    base_model.trainable = False
    
    return base_model

def create_age_model():
    """
    Create the age classification model
    """
    base_model = create_base_model()
    
    # Add classification layers
    x = base_model.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(len(AGE_RANGES), activation='softmax')(x)
    
    # Combine base model and new layers
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def create_gender_model():
    """
    Create the gender classification model
    """
    base_model = create_base_model()
    
    # Add classification layers
    x = base_model.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(len(GENDERS), activation='softmax')(x)
    
    # Combine base model and new layers
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def create_expression_model():
    """
    Create the expression recognition model (custom CNN)
    """
    # Input layer
    inputs = Input(shape=(EMOTION_IMG_SIZE, EMOTION_IMG_SIZE, 1))
    
    # First convolutional block
    x = Conv2D(32, (3, 3), padding='same', activation='relu')(inputs)
    x = BatchNormalization()(x)
    x = Conv2D(32, (3, 3), padding='same', activation='relu')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Dropout(0.25)(x)
    
    # Second convolutional block
    x = Conv2D(64, (3, 3), padding='same', activation='relu')(x)
    x = BatchNormalization()(x)
    x = Conv2D(64, (3, 3), padding='same', activation='relu')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Dropout(0.25)(x)
    
    # Third convolutional block
    x = Conv2D(128, (3, 3), padding='same', activation='relu')(x)
    x = BatchNormalization()(x)
    x = Conv2D(128, (3, 3), padding='same', activation='relu')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Dropout(0.25)(x)
    
    # Fully connected layers
    x = Flatten()(x)
    x = Dense(512, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    
    # Output layer
    predictions = Dense(len(EMOTIONS), activation='softmax')(x)
    
    # Create model
    model = Model(inputs=inputs, outputs=predictions)
    
    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def create_data_generators(data_dir, task):
    """
    Create data generators for training and validation
    
    Args:
        data_dir: Path to the dataset directory
        task: 'age', 'gender', or 'expression'
    
    Returns:
        Tuple of (train_generator, validation_generator)
    """
    # Determine input size and color mode based on task
    if task == 'expression':
        target_size = (EMOTION_IMG_SIZE, EMOTION_IMG_SIZE)
        color_mode = 'grayscale'
    else:  # age or gender
        target_size = (IMG_SIZE, IMG_SIZE)
        color_mode = 'rgb'
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    # Only rescaling for validation
    valid_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Create generators
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=target_size,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        color_mode=color_mode,
        subset='training'
    )
    
    validation_generator = valid_datagen.flow_from_directory(
        data_dir,
        target_size=target_size,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        color_mode=color_mode,
        subset='validation'
    )
    
    # For UTKFace dataset, we need to map filenames to age ranges
    if task == 'age' and 'utkface' in data_dir.lower():
        train_generator = map_class_to_age(train_generator)
        validation_generator = map_class_to_age(validation_generator)
    
    return train_generator, validation_generator

def map_class_to_age(generator):
    """
    Custom mapping for UTKFace dataset where filenames contain age
    This is a placeholder - in a real implementation, this would be more complex
    """
    # This would need to be implemented based on the specific dataset format
    return generator

def train_model(model, train_generator, validation_generator, task):
    """
    Train the model using the provided generators
    
    Args:
        model: Keras model to train
        train_generator: Training data generator
        validation_generator: Validation data generator
        task: 'age', 'gender', or 'expression'
    
    Returns:
        Trained model and training history
    """
    # Create the model output directory
    models_dir = os.path.join('models', task)
    os.makedirs(models_dir, exist_ok=True)
    
    # Define callbacks
    callbacks = [
        ModelCheckpoint(
            os.path.join(models_dir, f'{task}_model_best.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=5,
            min_lr=1e-6,
            verbose=1
        )
    ]
    
    # Train the model
    history = model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Save the final model
    model.save(os.path.join(models_dir, f'{task}_model_final.h5'))
    
    return model, history

def fine_tune_model(model, train_generator, validation_generator, task):
    """
    Fine-tune the model by unfreezing some layers of the base model
    
    Args:
        model: Keras model to fine-tune
        train_generator: Training data generator
        validation_generator: Validation data generator
        task: 'age', 'gender', or 'expression'
    
    Returns:
        Fine-tuned model and training history
    """
    # This function would fine-tune the model if it uses a pre-trained base
    # For simplicity, this is left as a placeholder
    return model, None

def main():
    """
    Main function to train models
    """
    parser = argparse.ArgumentParser(description='Train models for age, gender, and expression recognition')
    parser.add_argument('--task', type=str, choices=['age', 'gender', 'expression', 'all'], default='all',
                      help='which model to train (default: all)')
    parser.add_argument('--data-dir', type=str, required=True,
                      help='path to dataset directory')
    parser.add_argument('--output-dir', type=str, default='models',
                      help='output directory for trained models')
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    tasks = ['age', 'gender', 'expression'] if args.task == 'all' else [args.task]
    
    for task in tasks:
        print(f"\n\n{'='*50}")
        print(f"Training {task.upper()} model")
        print(f"{'='*50}\n")
        
        # Create data generators
        data_dir = os.path.join(args.data_dir, task)
        if not os.path.exists(data_dir):
            print(f"Data directory {data_dir} does not exist. Using parent directory.")
            data_dir = args.data_dir
        
        train_generator, validation_generator = create_data_generators(data_dir, task)
        
        # Create and train model
        if task == 'age':
            model = create_age_model()
        elif task == 'gender':
            model = create_gender_model()
        elif task == 'expression':
            model = create_expression_model()
        
        # Summary
        model.summary()
        
        # Train
        model, history = train_model(model, train_generator, validation_generator, task)
        
        # Fine-tune if applicable
        model, ft_history = fine_tune_model(model, train_generator, validation_generator, task)
        
        print(f"\n{task.upper()} model training complete. Model saved to {os.path.join(args.output_dir, task)}")

if __name__ == '__main__':
    main()