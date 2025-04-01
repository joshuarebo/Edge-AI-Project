import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';

/**
 * Custom hook to manage camera functionality
 * @returns {Object} Camera state and methods
 */
export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPhoto, setLastPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permissions on mount
  useEffect(() => {
    // Skip permission request on web as it will be handled in the Camera component
    if (Platform.OS === 'web') {
      console.log('Web platform detected - camera may have limited functionality');
      setHasPermission(false);
      return;
    }
    
    const getCameraPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.error('Error requesting camera permissions:', err);
        setHasPermission(false);
      }
    };

    getCameraPermissions();
  }, []);

  /**
   * Toggle between front and back camera
   */
  const toggleCameraType = () => {
    setType(current => 
      current === Camera.Constants.Type.front 
        ? Camera.Constants.Type.back 
        : Camera.Constants.Type.front
    );
  };

  /**
   * Toggle flash mode
   */
  const toggleFlashMode = () => {
    setFlashMode(current => {
      if (current === Camera.Constants.FlashMode.off) 
        return Camera.Constants.FlashMode.on;
      if (current === Camera.Constants.FlashMode.on) 
        return Camera.Constants.FlashMode.auto;
      return Camera.Constants.FlashMode.off;
    });
  };

  /**
   * Take a picture with the camera
   * @returns {Promise<Object>} The photo data
   */
  const takePicture = async () => {
    // Prevent taking pictures on web platform
    if (Platform.OS === 'web') {
      console.warn('Camera functionality not available on web platform');
      throw new Error('Camera functionality not available on web platform');
    }
    
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        console.log('Taking picture...');
        
        // Actual camera capture with platform-specific options
        const options = {
          quality: 0.8,
          base64: false,
          skipProcessing: Platform.OS === 'android', // Skip processing on Android for better performance
          exif: true,
          // Add iOS-specific options
          ...(Platform.OS === 'ios' ? {
            orientation: 'portrait',
            fixOrientation: true,
          } : {})
        };
        
        const photo = await cameraRef.current.takePictureAsync(options);
        
        console.log('Picture taken:', photo.uri);
        setLastPhoto(photo);
        setIsProcessing(false);
        return photo;
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsProcessing(false);
        throw error;
      }
    } else {
      if (!cameraRef.current) {
        console.error('Camera reference is not available');
      }
      if (isProcessing) {
        console.log('Camera is already processing');
      }
      throw new Error('Cannot take picture at this time');
    }
  };

  return {
    hasPermission,
    type,
    flashMode,
    isProcessing,
    lastPhoto,
    cameraRef,
    takePicture,
    toggleCameraType,
    toggleFlashMode,
    setLastPhoto
  };
};