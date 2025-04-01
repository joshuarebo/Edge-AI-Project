import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks
import { useCamera } from '../hooks/useCamera';
import { useTensorFlowModel } from '../hooks/useTensorFlowModel';

// Components
import { FaceDetectionBox } from '../components/Camera/FaceDetectionBox';
import { CameraControls } from '../components/Camera/CameraControls';
import { ResultsDisplay } from '../components/Results/ResultsDisplay';

// Utils
import { processImage } from '../utils/faceDetection';

// Styles
import { colors, commonStyles, spacing } from '../styles/globalStyles';

export const CameraScreen = () => {
  // State
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analyzeEnabled, setAnalyzeEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Hooks
  const { 
    cameraRef, 
    hasPermission, 
    cameraType, 
    flashMode, 
    detectedFaces,
    capturedPhoto,
    isProcessing,
    toggleCameraType,
    toggleFlashMode,
    takePicture,
    handleFacesDetected,
    handleCameraReady,
    resetCapture,
    getMainFace,
    faceDetectionOptions
  } = useCamera();
  
  const {
    models,
    isModelLoading,
    modelError,
    predict,
    isPredicting
  } = useTensorFlowModel();
  
  // Enable/disable analyze button based on face detection
  useEffect(() => {
    setAnalyzeEnabled(detectedFaces.length > 0);
  }, [detectedFaces]);
  
  // Handle analyze button press
  const handleAnalyze = async () => {
    if (isProcessing || isAnalyzing || !analyzeEnabled) return;
    
    try {
      setIsAnalyzing(true);
      
      // Take a picture
      const photo = await takePicture();
      if (!photo) {
        throw new Error('Failed to take picture');
      }
      
      // Get the main face
      const mainFace = getMainFace();
      if (!mainFace) {
        throw new Error('No face detected');
      }
      
      // Process the image through the AI models
      console.log('Processing image through models...');
      const results = await processImage(photo, mainFace, models);
      
      // Set the results
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error analyzing face:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Reset the analysis
  const resetAnalysis = () => {
    setAnalysisResults(null);
    resetCapture();
  };
  
  // If models are loading, show a loading screen
  if (isModelLoading) {
    return (
      <View style={commonStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading AI models...</Text>
      </View>
    );
  }
  
  // If there's a model error, show an error screen
  if (modelError) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={styles.errorText}>Error loading models:</Text>
        <Text style={styles.errorDetail}>{modelError}</Text>
      </View>
    );
  }
  
  // If camera permissions are not granted, show an error message
  if (hasPermission === false) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={styles.errorText}>Camera access is required to use this app.</Text>
      </View>
    );
  }
  
  // If we have an analysis result, show it
  if (analysisResults) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ResultsDisplay 
          results={analysisResults} 
          onClose={resetAnalysis}
          photo={capturedPhoto}
        />
      </SafeAreaView>
    );
  }
  
  // Otherwise, show the camera view
  return (
    <View style={commonStyles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={faceDetectionOptions}
        onCameraReady={handleCameraReady}
      >
        <View style={styles.overlay}>
          {/* Face detection boxes */}
          {detectedFaces.map(face => (
            <FaceDetectionBox 
              key={face.faceID || Math.random().toString()} 
              face={face}
              isMainFace={face === getMainFace()}
            />
          ))}
          
          {/* Camera controls */}
          <View style={styles.controlsContainer}>
            <CameraControls
              onToggleCamera={toggleCameraType}
              onToggleFlash={toggleFlashMode}
              flashMode={flashMode}
              cameraType={cameraType}
              detectedFaces={detectedFaces.length}
              onAnalyze={handleAnalyze}
              analyzeEnabled={analyzeEnabled}
              isProcessing={isProcessing || isAnalyzing}
            />
          </View>
        </View>
      </Camera>
      
      {/* Processing indicator */}
      {(isProcessing || isAnalyzing) && (
        <View style={commonStyles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.background} />
          <Text style={styles.processingText}>
            {isAnalyzing ? 'Analyzing face...' : 'Processing...'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    textAlign: 'center',
    margin: spacing.md,
  },
  errorDetail: {
    color: colors.textLight,
    fontSize: 14,
    textAlign: 'center',
    margin: spacing.md,
  },
  processingText: {
    color: colors.background,
    fontSize: 16,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});