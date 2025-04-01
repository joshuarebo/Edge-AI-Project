import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CameraComponent from '../components/Camera';
import Results from '../components/Results';
import { useModelContext } from '../context/ModelContext';

const HomeScreen = ({ navigation }) => {
  const [currentResults, setCurrentResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState([]);
  const { isModelReady } = useModelContext();

  useEffect(() => {
    // When we get new results, show them and add to stats
    if (currentResults) {
      setShowResults(true);
      setStats(prevStats => [...prevStats, currentResults]);
      
      // Auto-hide results after 3 seconds
      const timer = setTimeout(() => {
        setShowResults(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentResults]);

  const handleResults = (results) => {
    setCurrentResults(results);
  };

  const goToStats = () => {
    navigation.navigate('Stats', { stats });
  };

  const goToAbout = () => {
    navigation.navigate('About');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goToStats}>
          <Feather name="bar-chart-2" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>FacialInsight</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={goToAbout}>
          <Feather name="info" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cameraContainer}>
        {!isModelReady ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading AI models...</Text>
          </View>
        ) : (
          <CameraComponent onResults={handleResults} />
        )}
      </View>
      
      <Results results={currentResults} isVisible={showResults} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
