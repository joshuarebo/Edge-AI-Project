import { useState, useEffect, useRef } from 'react';
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
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        console.log('Taking picture...');
        
        // Actual camera capture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
          exif: true
        });
        
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