import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface MessageItemProps {
  id: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'received';
  type: 'incoming' | 'outgoing';
  timestamp: string;
  phoneNumber: string;
  onPress?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  content, 
  status, 
  type, 
  timestamp, 
  phoneNumber,
  onPress 
}) => {
  const getStatusColor = () => {
    switch(status) {
      case 'sent': return '#34C759';
      case 'failed': return '#FF3B30';
      case 'pending': return '#FF9500';
      case 'received': return '#007AFF';
      default: return '#888';
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'sent': return 'Sent';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      case 'received': return 'Received';
      default: return status;
    }
  };

  const getTypeIcon = () => {
    return type === 'incoming' ? '📥' : '📤';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ThemedView style={styles.header}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <ThemedText type="defaultSemiBold" style={styles.phoneNumber}>
          {phoneNumber}
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.status}>
          {getStatusText()}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <ThemedText style={styles.messageText}>{content}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.timestamp}>{timestamp}</ThemedText>
        <ThemedText style={styles.type}>{getTypeIcon()}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  phoneNumber: {
    flex: 1,
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  type: {
    fontSize: 16,
  },
});

export default MessageItem;