import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { colors, commonStyles, spacing, typography, layout } from '../../styles/globalStyles';

export const ResultsDisplay = ({ results, onClose, photo }) => {
  // Format confidence percentage
  const formatConfidence = (confidence) => {
    return `${Math.round(confidence * 100)}%`;
  };

  // Get color for confidence
  const getConfidenceColor = (confidence) => {
    if (confidence > 0.9) return colors.success;
    if (confidence > 0.7) return colors.primary;
    if (confidence > 0.5) return colors.warning;
    return colors.error;
  };

  // Get color for age range
  const getAgeColor = (ageRange) => {
    if (ageRange === '0-10') return colors.child;
    if (ageRange === '11-20') return colors.teen;
    if (ageRange === '21-30' || ageRange === '31-40') return colors.young;
    if (ageRange === '41-50' || ageRange === '51-60') return colors.adult;
    return colors.senior;
  };

  // Get color for gender
  const getGenderColor = (gender) => {
    return gender === 'Male' ? colors.male : colors.female;
  };

  // Get color for expression
  const getExpressionColor = (expression) => {
    switch (expression) {
      case 'Happy': return colors.happy;
      case 'Sad': return colors.sad;
      case 'Angry': return colors.angry;
      case 'Surprised': return colors.surprised;
      case 'Fear': return colors.fear;
      case 'Disgust': return colors.disgust;
      default: return colors.neutral;
    }
  };

  // Format processing time
  const formatProcessingTime = (timeInMs) => {
    return `${timeInMs.toFixed(0)} ms`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Results</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* Photo display */}
      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          {results.faceCoordinates && (
            <View
              style={{
                position: 'absolute',
                left: results.faceCoordinates.x,
                top: results.faceCoordinates.y,
                width: results.faceCoordinates.width,
                height: results.faceCoordinates.height,
                borderWidth: 2,
                borderColor: colors.accent,
                borderRadius: 2,
              }}
            />
          )}
        </View>
      )}

      {/* Results section */}
      <View style={styles.resultsContainer}>
        {/* Age result */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Age Range</Text>
          <View style={styles.resultContent}>
            <View style={styles.resultValueContainer}>
              <Text style={[styles.resultValue, { color: getAgeColor(results.age.ageRange) }]}>
                {results.age.ageRange}
              </Text>
              <Text style={styles.confidenceLabel}>
                Confidence: {formatConfidence(results.age.confidence)}
              </Text>
            </View>
            
            <View style={styles.confidenceBarContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${results.age.confidence * 100}%`, backgroundColor: getAgeColor(results.age.ageRange) }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Gender result */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Gender</Text>
          <View style={styles.resultContent}>
            <View style={styles.resultValueContainer}>
              <Text style={[styles.resultValue, { color: getGenderColor(results.gender.gender) }]}>
                {results.gender.gender}
              </Text>
              <Text style={styles.confidenceLabel}>
                Confidence: {formatConfidence(results.gender.confidence)}
              </Text>
            </View>
            
            <View style={styles.confidenceBarContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${results.gender.confidence * 100}%`, backgroundColor: getGenderColor(results.gender.gender) }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Expression result */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Expression</Text>
          <View style={styles.resultContent}>
            <View style={styles.resultValueContainer}>
              <Text style={[styles.resultValue, { color: getExpressionColor(results.expression.expression) }]}>
                {results.expression.expression}
              </Text>
              <Text style={styles.confidenceLabel}>
                Confidence: {formatConfidence(results.expression.confidence)}
              </Text>
            </View>
            
            <View style={styles.confidenceBarContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${results.expression.confidence * 100}%`, backgroundColor: getExpressionColor(results.expression.expression) }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Processing time */}
        <View style={styles.processingTimeContainer}>
          <Text style={styles.processingTimeText}>
            Processing time: {formatProcessingTime(results.processingTime)}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={onClose}
        >
          <Text style={styles.actionButtonText}>New Analysis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => alert('Feature coming soon!')}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Save to History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text,
  },
  photoContainer: {
    margin: spacing.md,
    height: 300,
    borderRadius: layout.borderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  resultsContainer: {
    padding: spacing.md,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resultTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultContent: {
    flexDirection: 'column',
  },
  resultValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultValue: {
    ...typography.h3,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    ...typography.body2,
    color: colors.textLight,
  },
  confidenceBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
  },
  processingTimeContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  processingTimeText: {
    ...typography.caption,
    color: colors.textLight,
  },
  actionsContainer: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: layout.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: spacing.sm,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.background,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});