import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface SIMCardProps {
  id: string;
  carrier: string;
  country: string;
  phoneNumber: string;
  isOnline: boolean;
  messagesSent: number;
  messagesReceived: number;
  onPress?: () => void;
}

const SIMCard: React.FC<SIMCardProps> = ({ 
  carrier, 
  country, 
  phoneNumber, 
  isOnline, 
  messagesSent,
  messagesReceived,
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText type="defaultSemiBold" style={styles.carrier}>
          {carrier}
        </ThemedText>
        <View style={[styles.statusIndicator, { 
          backgroundColor: isOnline ? '#34C759' : '#FF3B30' 
        }]} />
        <ThemedText type="defaultSemiBold" style={styles.status}>
          {isOnline ? 'Online' : 'Offline'}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.cardBody}>
        <ThemedText style={styles.phoneNumber}>{phoneNumber}</ThemedText>
        <ThemedText style={styles.country}>{country}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.cardFooter}>
        <View style={styles.statContainer}>
          <ThemedText style={styles.statValue}>{messagesSent}</ThemedText>
          <ThemedText style={styles.statLabel}>Sent</ThemedText>
        </View>
        <View style={styles.statContainer}>
          <ThemedText style={styles.statValue}>{messagesReceived}</ThemedText>
          <ThemedText style={styles.statLabel}>Received</ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  carrier: {
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  status: {
    fontSize: 12,
    color: '#888',
  },
  cardBody: {
    marginBottom: 12,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  country: {
    fontSize: 14,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  statContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default SIMCard;