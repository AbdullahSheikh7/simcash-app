import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import PermissionsModal from '@/components/PermissionsModal';
import { usePermissions } from '@/hooks/usePermissions';

const OnboardingScreen = () => {
  const { requestPermissions } = usePermissions();
  const [showPermissionModal, setShowPermissionModal] = useState(true);

  const handleGrantPermissions = async () => {
    const granted = await requestPermissions();
    setShowPermissionModal(false);
    
    if (granted) {
      // If permissions granted, redirect to dashboard
      router.replace('/(tabs)/index');
    } else {
      // If permissions denied, show modal again
      setShowPermissionModal(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Welcome to SimCash</ThemedText>
        <ThemedText style={styles.description}>
          Earn money by connecting your SIM cards and handling SMS messages
        </ThemedText>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <ThemedText type="defaultSemiBold" style={styles.featureText}>📱 Connect SIMs</ThemedText>
            <ThemedText style={styles.featureDescription}>Easily connect multiple SIM cards</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText type="defaultSemiBold" style={styles.featureText}>💰 Earn Payouts</ThemedText>
            <ThemedText style={styles.featureDescription}>Get paid for every SMS sent</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText type="defaultSemiBold" style={styles.featureText}>📊 Track Stats</ThemedText>
            <ThemedText style={styles.featureDescription}>Monitor earnings and usage</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => setShowPermissionModal(true)}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Get Started
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <PermissionsModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onGrant={handleGrantPermissions}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.8,
  },
  featuresContainer: {
    marginTop: 30,
    width: '100%',
  },
  featureItem: {
    marginBottom: 25,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 18,
    marginBottom: 8,
  },
  featureDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default OnboardingScreen;