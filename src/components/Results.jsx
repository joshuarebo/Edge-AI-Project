import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Results = ({ results, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible, fadeAnim, slideAnim]);

  // If no results or not visible, don't render
  if (!results || !isVisible) {
    return null;
  }
  
  const { age, gender, expression, inferenceTime } = results;
  
  const getExpressionEmoji = (expression) => {
    const expressions = {
      happy: '😃',
      sad: '😢',
      angry: '😠',
      surprise: '😲',
      fear: '😨',
      disgust: '🤢',
      neutral: '😐',
    };
    return expressions[expression.toLowerCase()] || '🤔';
  };

  const getGenderIcon = (gender) => {
    return gender.toLowerCase() === 'male' ? '♂️' : '♀️';
  };

  const renderConfidence = (confidence) => {
    // Convert the confidence to a percentage
    const percentage = Math.round(confidence * 100);
    
    // Define colors based on confidence level
    let color = '#e74c3c'; // red for low confidence
    if (percentage >= 80) {
      color = '#2ecc71'; // green for high confidence
    } else if (percentage >= 60) {
      color = '#f39c12'; // orange for medium confidence
    }
    
    return (
      <Text style={[styles.confidenceText, { color }]}>
        {percentage}% confidence
      </Text>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.resultCard}>
        <Text style={styles.title}>Analysis Results</Text>
        
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Age</Text>
            <Text style={styles.resultValue}>{age.prediction} years</Text>
            {renderConfidence(age.confidence)}
          </View>
        </View>
        
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Gender</Text>
            <Text style={styles.resultValue}>
              {gender.prediction} {getGenderIcon(gender.prediction)}
            </Text>
            {renderConfidence(gender.confidence)}
          </View>
        </View>
        
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Expression</Text>
            <Text style={styles.resultValue}>
              {expression.prediction} {getExpressionEmoji(expression.prediction)}
            </Text>
            {renderConfidence(expression.confidence)}
          </View>
        </View>
        
        <View style={styles.performanceContainer}>
          <Text style={styles.performanceText}>
            Inference time: {inferenceTime.toFixed(2)} ms
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceText: {
    fontSize: 12,
    marginTop: 4,
  },
  performanceContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    alignItems: 'center',
  },
  performanceText: {
    fontSize: 12,
    color: '#888',
  },
});

export default Results;
