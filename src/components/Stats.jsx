import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Stats = ({ stats }) => {
  if (!stats || !stats.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No performance data available</Text>
        <Text style={styles.emptySubtext}>Start using the app to collect stats</Text>
      </View>
    );
  }

  // Calculate averages
  const avgInferenceTime = stats.reduce((sum, stat) => sum + stat.inferenceTime, 0) / stats.length;
  const avgFps = stats.length > 0 ? 1000 / avgInferenceTime : 0;
  const avgCpuUtilization = stats.reduce((sum, stat) => sum + (stat.cpuUtilization || 0), 0) / stats.length;
  
  // Calculate max and min inference times
  const maxInferenceTime = Math.max(...stats.map(stat => stat.inferenceTime));
  const minInferenceTime = Math.min(...stats.map(stat => stat.inferenceTime));
  
  // Get the last result for display
  const lastResult = stats[stats.length - 1];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance Metrics</Text>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{avgInferenceTime.toFixed(2)} ms</Text>
            <Text style={styles.metricLabel}>Avg. Inference Time</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{avgFps.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>Avg. FPS</Text>
          </View>
        </View>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{minInferenceTime.toFixed(2)} ms</Text>
            <Text style={styles.metricLabel}>Min Inference</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{maxInferenceTime.toFixed(2)} ms</Text>
            <Text style={styles.metricLabel}>Max Inference</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{avgCpuUtilization.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Avg. CPU Usage</Text>
          </View>
        </View>
      </View>
      
      {lastResult && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last Prediction</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Age:</Text>
            <Text style={styles.resultValue}>{lastResult.age.prediction} years</Text>
            <Text style={styles.confidenceText}>Confidence: {(lastResult.age.confidence * 100).toFixed(1)}%</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Gender:</Text>
            <Text style={styles.resultValue}>{lastResult.gender.prediction}</Text>
            <Text style={styles.confidenceText}>Confidence: {(lastResult.gender.confidence * 100).toFixed(1)}%</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Expression:</Text>
            <Text style={styles.resultValue}>{lastResult.expression.prediction}</Text>
            <Text style={styles.confidenceText}>Confidence: {(lastResult.expression.confidence * 100).toFixed(1)}%</Text>
          </View>
        </View>
      )}
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Statistics</Text>
        <Text style={styles.statText}>Total predictions: {stats.length}</Text>
        <Text style={styles.statText}>Session duration: {formatSessionTime(stats)}</Text>
      </View>
    </ScrollView>
  );
};

// Helper function to format session time
const formatSessionTime = (stats) => {
  if (!stats || stats.length < 2) return '00:00';
  
  const firstTimestamp = stats[0].timestamp;
  const lastTimestamp = stats[stats.length - 1].timestamp;
  const durationMs = lastTimestamp - firstTimestamp;
  
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4630EB',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  resultItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  confidenceText: {
    fontSize: 12,
    color: '#888',
  },
  statText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});

export default Stats;
