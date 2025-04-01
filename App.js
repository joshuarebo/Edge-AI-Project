import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Platform 
} from 'react-native';

// Import our components, hooks, and utilities
import AppNavigator from './src/navigation/AppNavigator';
import CameraComponent from './src/components/Camera';
import { ModelProvider } from './src/context/ModelContext';
import { useTensorFlowModel } from './src/hooks/useTensorFlowModel';
import { commonStyles, colors, spacing, typography, layout } from './src/styles/globalStyles';

// Home screen component
const HomeScreen = ({ onStartPress }) => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Edge-Based Facial Analysis</Text>
      
      {/* Platform compatibility notice for web */}
      {Platform.OS === 'web' && (
        <View style={styles.platformNotice}>
          <Text style={styles.platformNoticeText}>
            You are using the web version of this app. For full functionality including camera access and face detection, please use the iOS or Android app.
          </Text>
        </View>
      )}
      
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
      
      {/* Add platform indicator */}
      <View style={styles.platformIndicator}>
        <Text style={styles.platformIndicatorText}>
          Current Platform: {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={onStartPress}
      >
        <Text style={styles.buttonText}>Start Analysis</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

// Camera screen component
const CameraScreen = ({ onBackPress }) => (
  <View style={styles.cameraContainer}>
    <CameraComponent />
    <TouchableOpacity 
      style={styles.backButton}
      onPress={onBackPress}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
  </View>
);

// About screen component
const AboutScreen = ({ onBackPress }) => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>About This App</Text>
      
      {/* Platform compatibility notice for web */}
      {Platform.OS === 'web' && (
        <View style={styles.platformNotice}>
          <Text style={styles.platformNoticeText}>
            You are using the web version of this app. For full functionality including camera access and face detection, please use the iOS or Android app.
          </Text>
        </View>
      )}
      
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
      
      <Text style={styles.subTitle}>Platform Compatibility:</Text>
      <Text style={styles.bulletPoint}>• iOS: Full functionality</Text>
      <Text style={styles.bulletPoint}>• Android: Full functionality</Text>
      <Text style={styles.bulletPoint}>• Web: Limited functionality (no camera access)</Text>
      
      <View style={styles.platformIndicator}>
        <Text style={styles.platformIndicatorText}>
          Current Platform: {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
        </Text>
      </View>
      
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
  // Platform-specific notice for web
  platformNotice: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.5)',
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  platformNoticeText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[800],
    textAlign: 'center',
  },
  // Platform indicator
  platformIndicator: {
    marginVertical: spacing.sm,
    padding: spacing.xs,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.gray[200],
    alignSelf: 'center',
  },
  platformIndicatorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray[600],
    textAlign: 'center',
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
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.md,
    zIndex: 10,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
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
