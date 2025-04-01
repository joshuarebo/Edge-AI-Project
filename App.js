import React from 'react';
import { View, Text } from 'react-native';

// Super minimal app with no dependencies to avoid timeout issues
export default function App() {
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#ffffff' 
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Basic App
      </Text>
      <Text style={{ marginTop: 10 }}>
        Minimal version to bypass timeout issues
      </Text>
    </View>
  );
}