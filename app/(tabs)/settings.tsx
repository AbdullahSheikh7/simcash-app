import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = React.useState(colorScheme === 'dark');
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the theme preference
  };
  
  const handleLogout = () => {
    console.log('Logging out...');
    // In a real app, this would clear the auth token and redirect to login
  };
  
  const settingsOptions = [
    { id: 'account', title: 'Account Details', subtitle: 'Manage your profile' },
    { id: 'devices', title: 'Connected Devices', subtitle: 'Manage SIM connections' },
    { id: 'privacy', title: 'Privacy & Security', subtitle: 'Manage your privacy settings' },
    { id: 'notifications', title: 'Notifications', subtitle: 'Configure app notifications' },
    { id: 'backup', title: 'Backup & Sync', subtitle: 'Manage data backup settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Manage your account and preferences
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingsContainer}>
        {settingsOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionItem}>
            <View style={styles.optionContent}>
              <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                {option.title}
              </ThemedText>
              <ThemedText style={styles.optionSubtitle}>
                {option.subtitle}
              </ThemedText>
            </View>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.themeSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
        
        <View style={styles.themeOption}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.themeOption}>
          <ThemedText>Auto Sync</ThemedText>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={autoSync ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.accountSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  settingsContainer: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 10,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  chevron: {
    fontSize: 20,
    opacity: 0.5,
  },
  themeSection: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  accountSection: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});