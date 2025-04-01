import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

export const FaceDetectionBox = ({ face, isMainFace = false }) => {
  // Extract face bounds
  const { origin, size } = face.bounds;
  
  // Style for the face detection box
  const faceBoxStyle = {
    position: 'absolute',
    left: origin.x,
    top: origin.y,
    width: size.width,
    height: size.height,
    borderWidth: isMainFace ? 3 : 2,
    borderColor: isMainFace ? colors.accent : colors.primary,
    borderRadius: 2,
  };
  
  return <View style={faceBoxStyle} />;
};