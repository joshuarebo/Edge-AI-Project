"""
Model Training Script for Age, Gender, and Expression Recognition

This script demonstrates how to train deep learning models for age, gender, and expression
recognition using TensorFlow/Keras. In a real application, this would be used to train
the models that are later converted to TensorFlow Lite format for mobile deployment.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 30
NUM_CLASSES_EXPRESSION = 7  # angry, disgust, fear, happy, sad, surprise, neutral
LEARNING_RATE = 0.001

# Function to create a base model with MobileNetV2
def create_base_model(input_shape=(IMG_SIZE, IMG_SIZE, 3)):
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    return base_model

# Age model - Regression
def create_age_model():
    base_model = create_base_model()
    
    inputs = Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation='relu')(x)
    outputs = Dense(1, activation='linear')(x)  # Regression for age
    
    model = Model(inputs, outputs)
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='mse',
        metrics=['mae']
    )
    
    return model

# Gender model - Binary classification
def create_gender_model():
    base_model = create_base_model()
    
    inputs = Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation='relu')(x)
    outputs = Dense(2, activation='softmax')(x)  # Binary: [female, male]
    
    model = Model(inputs, outputs)
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Expression model - Multi-class classification
def create_expression_model():
    base_model = create_base_model()
    
    inputs = Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation='relu')(x)
    outputs = Dense(NUM_CLASSES_EXPRESSION, activation='softmax')(x)
    
    model = Model(inputs, outputs)
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Data augmentation and generators
def create_data_generators(data_dir, task):
    # Common augmentation parameters
    datagen_args = dict(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    train_datagen = ImageDataGenerator(
        **datagen_args,
        validation_split=0.2
    )
    
    # Task-specific generator setup
    if task == 'age':
        # For age regression
        train_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'age'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='sparse',  # Will need to convert to actual ages
            subset='training'
        )
        
        validation_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'age'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='sparse',  # Will need to convert to actual ages
            subset='validation'
        )
        
        # Convert class indices to actual ages (example mapping)
        def map_class_to_age(generator):
            # Hypothetical mapping from folder names to ages
            # In a real application, you would have your own mapping
            age_mapping = {
                0: 1,    # 0-2 years
                1: 4,    # 3-5 years
                2: 8,    # 6-10 years
                3: 15,   # 11-20 years
                4: 25,   # 21-30 years
                5: 35,   # 31-40 years
                6: 45,   # 41-50 years
                7: 55,   # 51-60 years
                8: 65    # 60+ years
            }
            
            # This is just a placeholder implementation
            # In a real application, you would modify the generator to yield actual ages
            return generator
        
        train_generator = map_class_to_age(train_generator)
        validation_generator = map_class_to_age(validation_generator)
    
    elif task == 'gender':
        # For gender classification
        train_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'gender'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            classes=['female', 'male'],
            subset='training'
        )
        
        validation_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'gender'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            classes=['female', 'male'],
            subset='validation'
        )
    
    elif task == 'expression':
        # For expression classification
        expression_classes = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        
        train_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'expression'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            classes=expression_classes,
            subset='training'
        )
        
        validation_generator = train_datagen.flow_from_directory(
            os.path.join(data_dir, 'expression'),
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            classes=expression_classes,
            subset='validation'
        )
    
    return train_generator, validation_generator

# Training function
def train_model(model, train_generator, validation_generator, task):
    # Create output directory for models
    os.makedirs('models', exist_ok=True)
    output_path = f'models/{task}_model.h5'
    
    # Callbacks
    checkpoint = ModelCheckpoint(
        output_path,
        monitor='val_loss',
        save_best_only=True,
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=0.00001,
        verbose=1
    )
    
    callbacks = [checkpoint, early_stopping, reduce_lr]
    
    # Train the model
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Plot training history
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title(f'{task.capitalize()} Model Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper right')
    
    metric_key = 'accuracy' if task != 'age' else 'mae'
    if metric_key in history.history:
        plt.subplot(1, 2, 2)
        plt.plot(history.history[metric_key])
        plt.plot(history.history[f'val_{metric_key}'])
        plt.title(f'{task.capitalize()} Model {metric_key.capitalize()}')
        plt.ylabel(metric_key.capitalize())
        plt.xlabel('Epoch')
        plt.legend(['Train', 'Validation'], loc='lower right')
    
    plt.tight_layout()
    plt.savefig(f'models/{task}_training_history.png')
    
    return model, history

# Fine-tuning function (optional second training phase)
def fine_tune_model(model, train_generator, validation_generator, task):
    # Unfreeze some layers for fine-tuning
    if isinstance(model.layers[1], tf.keras.Model):  # If using a base model
        base_model = model.layers[1]
        # Unfreeze the last few layers
        for layer in base_model.layers[-10:]:
            layer.trainable = True
    
    # Recompile with a lower learning rate
    if task == 'age':
        model.compile(
            optimizer=Adam(learning_rate=LEARNING_RATE / 10),
            loss='mse',
            metrics=['mae']
        )
    else:
        model.compile(
            optimizer=Adam(learning_rate=LEARNING_RATE / 10),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
    
    # Train for a few more epochs
    fine_tune_epochs = 10
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=fine_tune_epochs,
        callbacks=[
            EarlyStopping(
                monitor='val_loss',
                patience=3,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=2,
                min_lr=0.000001,
                verbose=1
            )
        ]
    )
    
    # Save the fine-tuned model
    model.save(f'models/{task}_model_fine_tuned.h5')
    
    return model, history

# Main execution block
def main():
    # Create output directory
    os.makedirs('models', exist_ok=True)
    
    # Paths would be set to your actual data directories
    data_dir = 'datasets'  # Path to dataset directory
    
    # Train Age Model
    print("Training Age Model...")
    age_model = create_age_model()
    train_generator, validation_generator = create_data_generators(data_dir, 'age')
    age_model, age_history = train_model(age_model, train_generator, validation_generator, 'age')
    
    # Train Gender Model
    print("Training Gender Model...")
    gender_model = create_gender_model()
    train_generator, validation_generator = create_data_generators(data_dir, 'gender')
    gender_model, gender_history = train_model(gender_model, train_generator, validation_generator, 'gender')
    
    # Train Expression Model
    print("Training Expression Model...")
    expression_model = create_expression_model()
    train_generator, validation_generator = create_data_generators(data_dir, 'expression')
    expression_model, expression_history = train_model(expression_model, train_generator, validation_generator, 'expression')
    
    # Optionally fine-tune models
    # age_model, _ = fine_tune_model(age_model, train_generator, validation_generator, 'age')
    # gender_model, _ = fine_tune_model(gender_model, train_generator, validation_generator, 'gender')
    # expression_model, _ = fine_tune_model(expression_model, train_generator, validation_generator, 'expression')
    
    print("Training complete! Models saved to 'models/' directory.")

if __name__ == "__main__":
    main()
