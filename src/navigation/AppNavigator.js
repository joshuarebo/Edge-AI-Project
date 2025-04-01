import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../styles/globalStyles';

// Simple tab-based navigation without external navigation libraries
export const AppNavigator = ({ activeTab, setActiveTab, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'home' && styles.activeTab]} 
          onPress={() => setActiveTab('home')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'home' && styles.activeTabText
          ]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'camera' && styles.activeTab]} 
          onPress={() => setActiveTab('camera')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'camera' && styles.activeTabText
          ]}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]} 
          onPress={() => setActiveTab('about')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'about' && styles.activeTabText
          ]}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
});

export default AppNavigator;