import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, layout, typography } from '../../styles/globalStyles';

export const CameraControls = ({
  onToggleCamera,
  onToggleFlash,
  onAnalyze,
  flashMode,
  cameraType,
  detectedFaces,
  analyzeEnabled,
  isProcessing,
}) => {
  return (
    <View style={styles.container}>
      {/* Face detection status */}
      <View style={styles.detectionStatus}>
        <View
          style={[
            styles.detectionIndicator,
            { backgroundColor: detectedFaces > 0 ? colors.success : colors.error },
          ]}
        />
        <Text style={styles.detectionText}>
          {detectedFaces === 0
            ? 'No faces detected'
            : detectedFaces === 1
            ? '1 face detected'
            : `${detectedFaces} faces detected`}
        </Text>
      </View>

      {/* Camera controls */}
      <View style={styles.controls}>
        {/* Flash toggle */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleFlash}
          disabled={isProcessing}
        >
          <Text style={styles.controlIcon}>
            {flashMode === 'on' ? '⚡️' : flashMode === 'auto' ? '🔄' : '⚡️'}
          </Text>
          <Text style={styles.controlText}>
            {flashMode === 'on' ? 'On' : flashMode === 'auto' ? 'Auto' : 'Off'}
          </Text>
        </TouchableOpacity>

        {/* Analyze button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            !analyzeEnabled && styles.analyzeButtonDisabled,
          ]}
          onPress={onAnalyze}
          disabled={!analyzeEnabled || isProcessing}
        >
          <Text style={styles.analyzeButtonText}>
            {isProcessing ? 'Processing...' : 'Analyze'}
          </Text>
        </TouchableOpacity>

        {/* Camera toggle */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleCamera}
          disabled={isProcessing}
        >
          <Text style={styles.controlIcon}>📷</Text>
          <Text style={styles.controlText}>
            {cameraType === 'front' ? 'Front' : 'Back'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.md,
  },
  detectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.pill,
    alignSelf: 'center',
  },
  detectionIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  detectionText: {
    color: colors.background,
    ...typography.body2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: layout.borderRadius.medium,
    width: 70,
  },
  controlIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  controlText: {
    color: colors.background,
    ...typography.caption,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius.medium,
  },
  analyzeButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  analyzeButtonText: {
    color: colors.background,
    ...typography.button,
  },
});