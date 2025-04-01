import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage camera functionality
 * @returns {Object} Camera state and methods
 */
export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('front'); // front or back camera
  const [flash, setFlash] = useState('off'); // off, on, auto
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPhoto, setLastPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permissions on mount
  useEffect(() => {
    const getCameraPermissions = async () => {
      // This would be implemented with Expo Camera permissions
      // For now, just simulate a successful permission
      setHasPermission(true);
    };

    getCameraPermissions();
  }, []);

  /**
   * Toggle between front and back camera
   */
  const toggleCameraType = () => {
    setType(current => (current === 'front' ? 'back' : 'front'));
  };

  /**
   * Toggle flash mode
   */
  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
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
        
        // This would use actual camera API in a real implementation
        console.log('Taking picture...');
        
        // Simulate photo capture
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock photo object
        const photo = {
          uri: 'https://example.com/mock-photo.jpg',
          width: 1080,
          height: 1920,
          exif: {},
          base64: null
        };
        
        setLastPhoto(photo);
        setIsProcessing(false);
        return photo;
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsProcessing(false);
        throw error;
      }
    }
  };

  return {
    hasPermission,
    type,
    flash,
    isProcessing,
    lastPhoto,
    cameraRef,
    takePicture,
    toggleCameraType,
    toggleFlash,
    setLastPhoto
  };
};