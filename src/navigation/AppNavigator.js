import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/globalStyles';

export const AppNavigator = ({ activeTab, setActiveTab, children }) => {
  // Tab item component
  const TabItem = ({ name, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        activeTab === name && styles.activeTabItem,
      ]}
      onPress={() => setActiveTab(name)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text
        style={[
          styles.tabLabel,
          activeTab === name && styles.activeTabLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>

      <View style={styles.tabBar}>
        <TabItem name="history" label="History" icon="📊" />
        <TabItem name="camera" label="Camera" icon="📷" />
        <TabItem name="settings" label="Settings" icon="⚙️" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
  },
  activeTabItem: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});