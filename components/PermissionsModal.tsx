import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface PermissionsModalProps {
  visible: boolean;
  onClose: () => void;
  onGrant: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ 
  visible, 
  onClose, 
  onGrant 
}) => {
  const permissionList = [
    {
      title: "SMS Access",
      description: "Send and receive SMS messages through your SIM cards",
      icon: "message"
    },
    {
      title: "Phone State",
      description: "Access your phone's SIM information and carrier details",
      icon: "phone"
    },
    {
      title: "Storage Access",
      description: "Access to save message logs and app data",
      icon: "folder"
    }
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemedView style={styles.contentContainer}>
            <ThemedText type="title" style={styles.title}>
              Enable Permissions
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              SimCash needs these permissions to work properly
            </ThemedText>
            
            <ScrollView style={styles.permissionsList}>
              {permissionList.map((permission, index) => (
                <View key={index} style={styles.permissionItem}>
                  <View style={styles.permissionIcon}>
                    <Text style={styles.iconText}>🔒</Text>
                  </View>
                  <View style={styles.permissionText}>
                    <ThemedText type="defaultSemiBold">{permission.title}</ThemedText>
                    <ThemedText style={styles.permissionDescription}>
                      {permission.description}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <ThemedText type="defaultSemiBold">Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.grantButton]} 
                onPress={onGrant}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Grant Permissions
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  permissionsList: {
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  permissionIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  iconText: {
    fontSize: 20,
  },
  permissionText: {
    flex: 1,
  },
  permissionDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 0.45,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  grantButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
  },
});

export default PermissionsModal;