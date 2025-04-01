import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useCamera } from '../hooks/useCamera';
import { useTensorFlowModel } from '../hooks/useTensorFlowModel';
import { processImage } from '../utils/faceDetection';
import { colors, spacing, typography, layout } from '../styles/globalStyles';

const CameraComponent = () => {
  // Check for web platform first - camera features limited on web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedTitle}>
            Camera Not Supported on Web
          </Text>
          <Text style={styles.unsupportedText}>
            This feature requires a native mobile device. Please open this app on an iOS or Android device to use the camera features.
          </Text>
          <Text style={styles.infoText}>
            The FacialInsight app uses native camera capabilities and on-device AI for face analysis, which aren't available in web browsers.
          </Text>
        </View>
      </View>
    );
  }

  // Use our custom hooks for mobile platforms
  const { 
    hasPermission, 
    cameraRef, 
    type, 
    flashMode, 
    toggleCameraType, 
    toggleFlashMode, 
    takePicture 
  } = useCamera();
  
  const { models, isModelReady } = useTensorFlowModel();
  
  // Component state
  const [isDetecting, setIsDetecting] = useState(false);
  const [faces, setFaces] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [photo, setPhoto] = useState(null);
  
  // If permission is not granted yet
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  // If permission is denied
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Camera access denied. Please enable camera access in your device settings.
        </Text>
      </View>
    );
  }
  
  // Handle face detection
  const handleFacesDetected = ({ faces }) => {
    if (!isDetecting || isProcessing) return;
    setFaces(faces);
  };
  
  // Process image and analyze with models
  const handleAnalyze = async () => {
    try {
      setIsProcessing(true);
      
      // Take a picture
      const photoData = await takePicture();
      setPhoto(photoData);
      
      // Only process if faces were detected
      if (faces.length > 0) {
        // Process the first detected face
        const result = await processImage(photoData, faces[0], models);
        setAnalysis(result);
      } else {
        setAnalysis({ error: 'No face detected' });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysis({ error: error.message });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Toggle face detection on/off
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      // Reset when turning detection on
      setFaces([]);
      setAnalysis(null);
      setPhoto(null);
    }
  };
  
  // Reset to camera view
  const resetCamera = () => {
    setPhoto(null);
    setAnalysis(null);
    setIsDetecting(true);
  };
  
  // Render face detection boxes
  const renderFaceDetectionBoxes = () => {
    if (!isDetecting || faces.length === 0) return null;
    
    return faces.map((face, index) => {
      // Calculate position and dimensions for the face box
      const { origin, size } = face.bounds;
      
      return (
        <View
          key={index}
          style={[
            styles.faceBox,
            {
              left: origin.x,
              top: origin.y,
              width: size.width,
              height: size.height,
            },
          ]}
        />
      );
    });
  };
  
  // Render analysis results
  const renderAnalysisResults = () => {
    if (!analysis) return null;
    
    if (analysis.error) {
      return (
        <View style={styles.analysisContainer}>
          <Text style={styles.errorText}>{analysis.error}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Analysis Results</Text>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Age:</Text>
          <Text style={styles.resultValue}>{analysis.age}</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Gender:</Text>
          <Text style={styles.resultValue}>{analysis.gender}</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Expression:</Text>
          <Text style={styles.resultValue}>{analysis.expression}</Text>
        </View>
        <Text style={styles.timeText}>
          Processing time: {analysis.processingTime}ms
        </Text>
      </View>
    );
  };
  
  // Main render
  return (
    <View style={styles.container}>
      {!photo ? (
        // Camera view
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flashMode}
          ref={cameraRef}
          onFacesDetected={isDetecting ? handleFacesDetected : undefined}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 100,
            tracking: true,
          }}
        >
          {renderFaceDetectionBoxes()}
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
              <Text style={styles.buttonText}>
                {flashMode === Camera.Constants.FlashMode.off ? 'Flash On' : 'Flash Off'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.detectionButton, isDetecting ? styles.activeButton : {}]} 
              onPress={toggleDetection}
            >
              <Text style={styles.buttonText}>
                {isDetecting ? 'Detection On' : 'Detection Off'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.captureContainer}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleAnalyze}
              disabled={isProcessing || !isDetecting || faces.length === 0}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.captureText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        // Photo and analysis view
        <View style={styles.resultContainer}>
          <Image source={{ uri: photo.uri }} style={styles.resultImage} />
          {renderAnalysisResults()}
          <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
            <Text style={styles.buttonText}>Back to Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  // Web-specific styles
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  unsupportedTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  unsupportedText: {
    fontSize: typography.fontSizes.md,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  // Mobile camera styles
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.sm,
    borderRadius: layout.borderRadius.md,
    marginBottom: spacing.sm,
  },
  detectionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.sm,
    borderRadius: layout.borderRadius.md,
  },
  activeButton: {
    backgroundColor: 'rgba(0, 120, 255, 0.6)',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: 2,
  },
  resultContainer: {
    flex: 1,
    padding: spacing.md,
  },
  resultImage: {
    width: '100%',
    height: '50%',
    borderRadius: layout.borderRadius.lg,
    marginBottom: spacing.md,
  },
  analysisContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  analysisTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.gray[300],
  },
  resultValue: {
    fontSize: typography.fontSizes.md,
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  timeText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[400],
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    padding: spacing.md,
  },
});

export default CameraComponent;