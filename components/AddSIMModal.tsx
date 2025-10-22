import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface AddSIMModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSIM: (simData: { carrier: string; country: string; phoneNumber: string }) => void;
}

const AddSIMModal: React.FC<AddSIMModalProps> = ({ visible, onClose, onAddSIM }) => {
  const [carrier, setCarrier] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleAddSIM = () => {
    if (carrier && country && phoneNumber) {
      onAddSIM({ carrier, country, phoneNumber });
      // Reset form
      setCarrier('');
      setCountry('');
      setPhoneNumber('');
    }
  };

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
              Add New SIM
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Carrier</ThemedText>
              <TextInput
                style={styles.input}
                value={carrier}
                onChangeText={setCarrier}
                placeholder="e.g., Verizon, AT&T"
                placeholderTextColor="#888"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Country</ThemedText>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="e.g., United States"
                placeholderTextColor="#888"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Phone Number</ThemedText>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <ThemedText type="defaultSemiBold">Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.addButton]} 
                onPress={handleAddSIM}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Add SIM
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
    maxHeight: '70%',
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
  },
});

export default AddSIMModal;