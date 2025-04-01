import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import { CameraScreen } from './src/screens/CameraScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Context
import { ModelProvider } from './src/context/ModelContext';

// Styles
import { colors } from './src/styles/globalStyles';

export default function App() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('camera');

  // Render the active screen based on the tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'camera':
        return <CameraScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <CameraScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <ModelProvider>
        <StatusBar style="auto" backgroundColor={colors.background} />
        <AppNavigator activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderScreen()}
        </AppNavigator>
      </ModelProvider>
    </SafeAreaProvider>
  );
}