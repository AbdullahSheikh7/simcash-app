import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import SIMCard from '@/components/SIMCard';
import AddSIMModal from '@/components/AddSIMModal';
import { useState } from 'react';

export default function SIMsScreen() {
  // Mock SIM data
  const [sims, setSims] = useState([
    {
      id: '1',
      carrier: 'Verizon',
      country: 'United States',
      phoneNumber: '+1 (555) 123-4567',
      isOnline: true,
      messagesSent: 128,
      messagesReceived: 95
    },
    {
      id: '2',
      carrier: 'AT&T',
      country: 'United States',
      phoneNumber: '+1 (555) 987-6543',
      isOnline: true,
      messagesSent: 87,
      messagesReceived: 64
    },
    {
      id: '3',
      carrier: 'T-Mobile',
      country: 'United States',
      phoneNumber: '+1 (555) 456-7890',
      isOnline: false,
      messagesSent: 42,
      messagesReceived: 31
    }
  ]);

  const [showAddSIMModal, setShowAddSIMModal] = useState(false);

  const handleAddSIM = () => {
    setShowAddSIMModal(true);
  };

  const handleAddSIMConfirm = (simData: { carrier: string; country: string; phoneNumber: string }) => {
    const newSIM = {
      id: (sims.length + 1).toString(),
      ...simData,
      isOnline: false, // New SIMs start as offline
      messagesSent: 0,
      messagesReceived: 0
    };
    
    setSims([...sims, newSIM]);
    setShowAddSIMModal(false);
  };

  const handleSIMPress = (simId: string) => {
    // Navigate to SIM details screen
    console.log(`SIM ${simId} pressed`);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>SIM Management</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Manage your connected SIM cards
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddSIM}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            + Add SIM
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.simsList}>
        {sims.length > 0 ? (
          sims.map(sim => (
            <SIMCard
              key={sim.id}
              id={sim.id}
              carrier={sim.carrier}
              country={sim.country}
              phoneNumber={sim.phoneNumber}
              isOnline={sim.isOnline}
              messagesSent={sim.messagesSent}
              messagesReceived={sim.messagesReceived}
              onPress={() => handleSIMPress(sim.id)}
            />
          ))
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No SIMs connected yet</ThemedText>
            <ThemedText>Tap the button above to add a SIM</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <AddSIMModal
        visible={showAddSIMModal}
        onClose={() => setShowAddSIMModal(false)}
        onAddSIM={handleAddSIMConfirm}
      />
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
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  simsList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});