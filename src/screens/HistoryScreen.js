import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Styles
import { colors, commonStyles, spacing, typography, shadows } from '../styles/globalStyles';

// Placeholder for history data
const MOCK_HISTORY = [
  {
    id: '1',
    timestamp: '2025-03-31T10:15:00Z',
    age: { ageRange: '21-30', confidence: 0.87 },
    gender: { gender: 'Female', confidence: 0.92 },
    expression: { expression: 'Happy', confidence: 0.78 },
  },
  {
    id: '2',
    timestamp: '2025-03-30T15:30:00Z',
    age: { ageRange: '31-40', confidence: 0.76 },
    gender: { gender: 'Male', confidence: 0.89 },
    expression: { expression: 'Neutral', confidence: 0.65 },
  },
  {
    id: '3',
    timestamp: '2025-03-29T09:45:00Z',
    age: { ageRange: '11-20', confidence: 0.81 },
    gender: { gender: 'Female', confidence: 0.95 },
    expression: { expression: 'Surprised', confidence: 0.72 },
  },
];

export const HistoryScreen = () => {
  const [history, setHistory] = useState(MOCK_HISTORY);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get color for confidence
  const getConfidenceColor = (confidence) => {
    if (confidence > 0.9) return colors.success;
    if (confidence > 0.7) return colors.primary;
    if (confidence > 0.5) return colors.warning;
    return colors.error;
  };

  // Render a history item
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => alert('Viewing details coming in a future update!')}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Age:</Text>
          <View style={styles.resultValue}>
            <Text style={styles.valueText}>{item.age.ageRange}</Text>
            <View style={styles.confidenceContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${item.age.confidence * 100}%`, backgroundColor: getConfidenceColor(item.age.confidence) }
                ]} 
              />
              <Text style={styles.confidenceText}>{Math.round(item.age.confidence * 100)}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Gender:</Text>
          <View style={styles.resultValue}>
            <Text style={styles.valueText}>{item.gender.gender}</Text>
            <View style={styles.confidenceContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${item.gender.confidence * 100}%`, backgroundColor: getConfidenceColor(item.gender.confidence) }
                ]} 
              />
              <Text style={styles.confidenceText}>{Math.round(item.gender.confidence * 100)}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Expression:</Text>
          <View style={styles.resultValue}>
            <Text style={styles.valueText}>{item.expression.expression}</Text>
            <View style={styles.confidenceContainer}>
              <View 
                style={[
                  styles.confidenceBar, 
                  { width: `${item.expression.confidence * 100}%`, backgroundColor: getConfidenceColor(item.expression.confidence) }
                ]} 
              />
              <Text style={styles.confidenceText}>{Math.round(item.expression.confidence * 100)}%</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Clear history function
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No analysis history yet.</Text>
          <Text style={styles.emptySubtext}>
            Use the camera tab to analyze faces and build your history.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  clearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearButtonText: {
    ...typography.body2,
    color: colors.error,
  },
  listContainer: {
    padding: spacing.md,
  },
  historyItem: {
    ...commonStyles.card,
    marginBottom: spacing.md,
  },
  historyHeader: {
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  timestamp: {
    ...typography.subtitle2,
    color: colors.textLight,
  },
  resultsContainer: {
    marginTop: spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultLabel: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text,
    width: '30%',
  },
  resultValue: {
    width: '70%',
  },
  valueText: {
    ...typography.body1,
    color: colors.text,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  confidenceBar: {
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
    flex: 1,
  },
  confidenceText: {
    ...typography.caption,
    color: colors.textLight,
    width: 35,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textLight,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body1,
    color: colors.textLight,
    textAlign: 'center',
  },
});