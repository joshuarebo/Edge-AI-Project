import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Styles
import { colors, commonStyles, spacing, typography, shadows } from '../styles/globalStyles';

// Main settings component
export const SettingsScreen = () => {
  // State for settings options
  const [settings, setSettings] = useState({
    // Camera settings
    saveAnalysisResults: true,
    highAccuracyMode: false,
    showConfidenceValues: true,
    
    // Privacy settings
    allowUsageStats: false,
    
    // App settings
    darkMode: false,
    notificationsEnabled: true,
  });

  // Handle toggle changes
  const handleToggle = (key) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };

  // Handle app reset
  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app? This will clear all history and restore default settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset settings to defaults
            setSettings({
              saveAnalysisResults: true,
              highAccuracyMode: false,
              showConfidenceValues: true,
              allowUsageStats: false,
              darkMode: false,
              notificationsEnabled: true,
            });
            
            // Here we would also clear history and other data
            Alert.alert('Reset Complete', 'The app has been reset to default settings.');
          }
        }
      ]
    );
  };

  // Handle model reload
  const handleReloadModels = () => {
    Alert.alert(
      'Reload AI Models',
      'This will download the latest versions of the AI models. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reload', 
          onPress: () => {
            // Here we would trigger reloading the models
            Alert.alert('Models Reloaded', 'AI models have been reloaded successfully.');
          }
        }
      ]
    );
  };

  // Render a setting item with a toggle
  const renderToggleSetting = (title, description, value, key) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.background : colors.background}
      />
    </View>
  );

  // Render a button setting
  const renderButtonSetting = (title, description, onPress, buttonText, destructive = false) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.settingButton,
          destructive && styles.destructiveButton
        ]}
        onPress={onPress}
      >
        <Text style={[
          styles.settingButtonText,
          destructive && styles.destructiveButtonText
        ]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Camera Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera</Text>
          
          {renderToggleSetting(
            'Save Analysis Results',
            'Store face analysis results in history',
            settings.saveAnalysisResults,
            'saveAnalysisResults'
          )}
          
          {renderToggleSetting(
            'High Accuracy Mode',
            'Use more accurate models (slower processing)',
            settings.highAccuracyMode,
            'highAccuracyMode'
          )}
          
          {renderToggleSetting(
            'Show Confidence Values',
            'Display confidence percentages with results',
            settings.showConfidenceValues,
            'showConfidenceValues'
          )}
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          {renderToggleSetting(
            'Anonymous Usage Stats',
            'Help improve the app by sending anonymous usage data',
            settings.allowUsageStats,
            'allowUsageStats'
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          {renderToggleSetting(
            'Dark Mode',
            'Use dark color theme (requires app restart)',
            settings.darkMode,
            'darkMode'
          )}
          
          {renderToggleSetting(
            'Notifications',
            'Enable app notifications',
            settings.notificationsEnabled,
            'notificationsEnabled'
          )}
        </View>

        {/* Advanced Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          
          {renderButtonSetting(
            'Reload AI Models',
            'Download the latest AI models',
            handleReloadModels,
            'Reload'
          )}
          
          {renderButtonSetting(
            'Reset App',
            'Clear all data and restore default settings',
            handleReset,
            'Reset',
            true
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appTitle}>FacialInsight</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Edge-based age, gender, and facial expression recognition application
              using TensorFlow.js and React Native.
            </Text>
            
            <View style={styles.separator} />
            
            <Text style={styles.copyright}>
              © 2025 FacialInsight Team
            </Text>
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => alert('Privacy Policy')}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => alert('Terms of Service')}
            >
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginVertical: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text,
  },
  settingDescription: {
    ...typography.body2,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  settingButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.small,
    backgroundColor: colors.primary,
  },
  settingButtonText: {
    ...typography.button,
    color: colors.background,
  },
  destructiveButton: {
    backgroundColor: colors.error,
  },
  destructiveButtonText: {
    color: colors.background,
  },
  aboutContainer: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.medium,
    ...shadows.small,
  },
  appTitle: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
  },
  appVersion: {
    ...typography.subtitle2,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  appDescription: {
    ...typography.body1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  copyright: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  linkButton: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  linkText: {
    ...typography.body2,
    color: colors.primary,
    textAlign: 'center',
  },
});