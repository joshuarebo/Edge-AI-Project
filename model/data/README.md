# Dataset Instructions

This directory is where you should place the datasets needed for training the age, gender, and expression recognition models.

## Required Datasets

### 1. UTKFace Dataset (for age and gender models)

The UTKFace dataset consists of over 20,000 face images with annotations of age, gender, and ethnicity. We'll use this to train our age and gender classification models.

**How to get the data:**
1. Download from Kaggle: [UTKFace Dataset](https://www.kaggle.com/datasets/jangedoo/utkface-new)
2. Extract all the image files into the `utkface` directory

**Expected structure:**
```
model/data/utkface/
├── 1_0_0_20170109142408075.jpg
├── 1_0_0_20170109150557335.jpg
├── ... (many more image files)
```

The filename format is: `[age]_[gender]_[race]_[date&time].jpg`
- Age: is an integer from 0 to 116
- Gender: is either 0 (male) or 1 (female)
- Race: is an integer from 0 to 4 (0=white, 1=black, 2=asian, 3=indian, 4=others)

### 2. FER2013 Dataset (for expression recognition)

The Facial Expression Recognition (FER) dataset consists of 48x48 pixel grayscale face images with various facial expressions.

**How to get the data:**
1. Download from Kaggle: [FER2013](https://www.kaggle.com/competitions/challenges-in-representation-learning-facial-expression-recognition-challenge/data)
2. Extract all the image files into the `fer` directory

**Alternative preparation method:**
If the dataset comes as a CSV file rather than individual images, you'll need to run a preprocessing script to convert it to images. Here's an example script that you can run:

```python
import pandas as pd
import numpy as np
import os
from PIL import Image

# Load the CSV file
data = pd.read_csv('fer2013.csv')

# Ensure the output directory exists
os.makedirs('model/data/fer', exist_ok=True)

# Emotion labels
emotion_map = {
    0: 'angry',
    1: 'disgust', 
    2: 'fear', 
    3: 'happy', 
    4: 'sad', 
    5: 'surprise', 
    6: 'neutral'
}

# Convert each row to an image
for i, row in data.iterrows():
    emotion = emotion_map[row['emotion']]
    pixels = np.array(row['pixels'].split(' '), dtype=np.uint8)
    image = pixels.reshape(48, 48)
    
    # Convert to PIL Image
    img = Image.fromarray(image)
    
    # Save the image
    filename = f"{emotion}_{i}.png"
    img.save(os.path.join('model/data/fer', filename))
    
    if i % 1000 == 0:
        print(f"Processed {i} images")

print("Done!")
```

**Expected structure:**
```
model/data/fer/
├── angry_0.png
├── happy_1.png
├── ... (many more image files)
```

## Data Privacy and Usage

These datasets are for research and educational purposes only. Please respect the licenses and terms of use of the original datasets. Do not use the trained models for any purposes that may infringe on privacy or could be used in harmful applications.

## Dataset Statistics

### UTKFace
- Total images: ~20,000
- Age range: 0 to 116 years
- Gender distribution: Approximately balanced
- Image size: Various (will be resized during training)

### FER2013
- Total images: ~35,000
- 7 emotion categories: angry, disgust, fear, happy, sad, surprise, neutral
- Image size: 48x48 pixels (grayscale)
- Training set: ~28,000 images
- Public test set: ~3,500 images
- Private test set: ~3,500 images