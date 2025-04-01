import { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

/**
 * Custom hook to manage camera functionality
 * @returns {Object} Camera state and methods
 */
export const useCamera = () => {
  // Camera ref
  const cameraRef = useRef(null);
  
  // Camera state
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Face detection options
  const faceDetectionOptions = {
    mode: FaceDetector.FaceDetectorMode.fast,
    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
    runClassifications: FaceDetector.FaceDetectorClassifications.all,
    minDetectionInterval: 100,
    tracking: true,
  };
  
  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  /**
   * Toggle between front and back camera
   */
  const toggleCameraType = () => {
    setCameraType(current => 
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  
  /**
   * Toggle flash mode
   */
  const toggleFlashMode = () => {
    setFlashMode(current => {
      if (current === Camera.Constants.FlashMode.off) return Camera.Constants.FlashMode.on;
      if (current === Camera.Constants.FlashMode.on) return Camera.Constants.FlashMode.auto;
      return Camera.Constants.FlashMode.off;
    });
  };
  
  /**
   * Take a picture with the camera
   * @returns {Promise<Object>} The photo data
   */
  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady || isProcessing) {
      return null;
    }
    
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
        exif: false,
      });
      
      setCapturedPhoto(photo);
      return photo;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Handle face detection result
   * @param {Object} faces - Detected faces data
   */
  const handleFacesDetected = ({ faces }) => {
    setDetectedFaces(faces);
  };
  
  /**
   * Handle camera ready state
   */
  const handleCameraReady = () => {
    setIsCameraReady(true);
  };
  
  /**
   * Reset the captured photo
   */
  const resetCapture = () => {
    setCapturedPhoto(null);
  };
  
  /**
   * Get main face from detected faces
   * Returns the largest face or the one closest to the center
   */
  const getMainFace = () => {
    if (detectedFaces.length === 0) return null;
    if (detectedFaces.length === 1) return detectedFaces[0];
    
    // Sort by face size (width * height)
    return detectedFaces.reduce((prev, current) => {
      const prevSize = prev.bounds.size.width * prev.bounds.size.height;
      const currSize = current.bounds.size.width * current.bounds.size.height;
      return prevSize > currSize ? prev : current;
    });
  };
  
  return {
    cameraRef,
    hasPermission,
    cameraType,
    flashMode,
    detectedFaces,
    capturedPhoto,
    isProcessing,
    isCameraReady,
    faceDetectionOptions,
    toggleCameraType,
    toggleFlashMode,
    takePicture,
    handleFacesDetected,
    handleCameraReady,
    resetCapture,
    getMainFace,
  };
};