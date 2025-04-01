import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FacialInsight</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            An edge-based application for real-time age, gender, and facial expression recognition
            that runs entirely on your device without sending data to external servers.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            FacialInsight uses deep learning models optimized for mobile devices to analyze faces in real-time:
          </Text>
          
          <View style={styles.featureItem}>
            <Feather name="user" size={20} color="#4630EB" style={styles.icon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Age Estimation</Text>
              <Text style={styles.featureDescription}>
                Predicts the approximate age based on facial features
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="users" size={20} color="#4630EB" style={styles.icon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Gender Recognition</Text>
              <Text style={styles.featureDescription}>
                Identifies gender based on facial characteristics
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="smile" size={20} color="#4630EB" style={styles.icon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Expression Analysis</Text>
              <Text style={styles.featureDescription}>
                Recognizes 7 basic facial expressions: happy, sad, angry, surprise, fear, disgust, and neutral
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.paragraph}>
            All processing happens on your device. No images or personal data are sent to external servers.
            The app works completely offline after installation.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <Text style={styles.paragraph}>
            Built with React Native, Expo, and TensorFlow Lite. The models are optimized for mobile performance
            while maintaining reasonable accuracy.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datasets</Text>
          <Text style={styles.paragraph}>
            Models were trained using the following public datasets:
          </Text>
          <Text style={styles.listItem}>• Adience Dataset (age and gender)</Text>
          <Text style={styles.listItem}>• AffectNet (facial expressions)</Text>
          
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('https://talhassner.github.io/home/projects/Adience/Adience-data.html')}
          >
            <Text style={styles.linkText}>Learn more about the Adience Dataset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('http://mohammadmahoor.com/affectnet/')}
          >
            <Text style={styles.linkText}>Learn more about AffectNet</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitations</Text>
          <Text style={styles.paragraph}>
            While the app strives for accuracy, results may vary based on lighting conditions, 
            camera quality, face angle, and other factors. The age estimation is approximate
            and may have a margin of error.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 FacialInsight</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34, // Same width as the back button for alignment
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  version: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 5,
    lineHeight: 20,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#4630EB',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default AboutScreen;
