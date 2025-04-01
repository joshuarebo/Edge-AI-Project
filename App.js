import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';

// Import our components, hooks, and utilities
import AppNavigator from './src/navigation/AppNavigator';
import { ModelProvider } from './src/context/ModelContext';
import { useTensorFlowModel } from './src/hooks/useTensorFlowModel';
import { commonStyles, colors, spacing, typography } from './src/styles/globalStyles';

// Home screen component
const HomeScreen = ({ onStartPress }) => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Edge-Based Facial Analysis</Text>
      <Text style={styles.description}>
        This app uses on-device AI to analyze faces for:
      </Text>
      <View style={styles.featureContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Age</Text>
          <Text style={styles.featureDescription}>Estimates age range</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Gender</Text>
          <Text style={styles.featureDescription}>Predicts gender</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Expression</Text>
          <Text style={styles.featureDescription}>Recognizes emotions</Text>
        </View>
      </View>
      <Text style={styles.privacyText}>
        Privacy-First: All processing happens on your device - your data stays private.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={onStartPress}
      >
        <Text style={styles.buttonText}>Start Analysis</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

// Camera screen component (placeholder for now)
const CameraScreen = ({ onBackPress }) => (
  <View style={styles.cameraPlaceholder}>
    <Text style={styles.placeholderText}>Camera functionality coming soon</Text>
    <Text style={styles.placeholderSubText}>We're working on implementing camera access</Text>
    <TouchableOpacity 
      style={[styles.button, {marginTop: 30}]}
      onPress={onBackPress}
    >
      <Text style={styles.buttonText}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);

// About screen component
const AboutScreen = ({ onBackPress }) => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.description}>
        FacialInsight is an edge-based AI application that processes all data on your device.
        No images are sent to any servers, ensuring your privacy.
      </Text>
      <Text style={styles.subTitle}>Features:</Text>
      <Text style={styles.bulletPoint}>• Real-time face detection</Text>
      <Text style={styles.bulletPoint}>• Age estimation</Text>
      <Text style={styles.bulletPoint}>• Gender recognition</Text>
      <Text style={styles.bulletPoint}>• Facial expression analysis</Text>
      <Text style={styles.subTitle}>Privacy-focused:</Text>
      <Text style={styles.description}>
        All processing happens on your device, not in the cloud.
        Your images never leave your phone.
      </Text>
      <TouchableOpacity 
        style={[styles.button, {marginTop: 30}]}
        onPress={onBackPress}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

// Model loading status component
const ModelStatus = ({ isLoading, error }) => {
  if (error) {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.errorText}>Error loading models: {error}</Text>
      </View>
    );
  }
  
  if (isLoading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading AI models...</Text>
      </View>
    );
  }
  
  return null;
};

// Main app component
const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { isLoading, error, isModelReady } = useTensorFlowModel();
  
  // Render different screens based on the active tab
  const renderContent = () => {
    // If models are loading, show the loading screen
    if (isLoading || error) {
      return <ModelStatus isLoading={isLoading} error={error} />;
    }
    
    // Otherwise, render the appropriate screen
    switch (activeTab) {
      case 'home':
        return <HomeScreen onStartPress={() => setActiveTab('camera')} />;
      case 'camera':
        return <CameraScreen onBackPress={() => setActiveTab('home')} />;
      case 'about':
        return <AboutScreen onBackPress={() => setActiveTab('home')} />;
      default:
        return <Text>Unknown tab</Text>;
    }
  };
  
  return (
    <AppNavigator activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AppNavigator>
  );
};

// Root component with providers
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ModelProvider>
        <MainApp />
      </ModelProvider>
    </SafeAreaProvider>
  );
}

// Styles for our components
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.dark,
  },
  description: {
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.md,
    lineHeight: 22,
    color: colors.gray[700],
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  featureItem: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 10,
    margin: 5,
    ...commonStyles.card,
  },
  featureTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  featureDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[600],
  },
  privacyText: {
    fontSize: typography.fontSizes.sm,
    fontStyle: 'italic',
    color: colors.gray[600],
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.secondary,
  },
  placeholderText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  placeholderSubText: {
    fontSize: typography.fontSizes.md,
    color: colors.gray[300],
    textAlign: 'center',
  },
  subTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.dark,
  },
  bulletPoint: {
    fontSize: typography.fontSizes.md,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
    color: colors.gray[700],
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.gray[600],
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    padding: spacing.md,
  },
});
