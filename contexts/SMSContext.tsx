import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { SMS_EVENTS, initializeSMSService, cleanupSMSService, sendSMS, isDefaultSMSApp, requestToBeDefaultSMSApp } from '@/services/smsService';

interface SMSContextType {
  isDefaultSMS: boolean;
  requestDefaultSMS: () => Promise<boolean>;
  sendMessage: (phoneNumber: string, message: string) => Promise<boolean>;
  messages: Array<{
    id: string;
    phoneNumber: string;
    message: string;
    timestamp: string;
    status: 'sent' | 'failed' | 'received';
  }>;
}

const SMSContext = createContext<SMSContextType | undefined>(undefined);

export const useSMS = () => {
  const context = useContext(SMSContext);
  if (!context) {
    throw new Error('useSMS must be used within an SMSServiceProvider');
  }
  return context;
};

interface SMSServiceProviderProps {
  children: ReactNode;
}

export const SMSServiceProvider = ({ children }: SMSServiceProviderProps) => {
  const [isDefaultSMS, setIsDefaultSMS] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    phoneNumber: string;
    message: string;
    timestamp: string;
    status: 'sent' | 'failed' | 'received';
  }>>([]);

  useEffect(() => {
    // Initialize the SMS service
    initializeSMSService();

    // Check if this app is the default SMS app
    const checkDefaultStatus = async () => {
      const status = await isDefaultSMSApp();
      setIsDefaultSMS(status);
    };

    checkDefaultStatus();

    // Listen for SMS events
    const smsSentListener = DeviceEventEmitter.addListener(
      SMS_EVENTS.SMS_SENT,
      (data) => {
        console.log('SMS sent event received:', data);
        // Add sent message to the list
        setMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            phoneNumber: data.phoneNumber,
            message: data.message,
            timestamp: data.timestamp,
            status: 'sent'
          }
        ]);
      }
    );

    const smsFailedListener = DeviceEventEmitter.addListener(
      SMS_EVENTS.SMS_FAILED,
      (data) => {
        console.log('SMS failed event received:', data);
        // Add failed message to the list
        setMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            phoneNumber: data.phoneNumber,
            message: data.message,
            timestamp: data.timestamp,
            status: 'failed'
          }
        ]);
      }
    );

    // In a real app, we would also listen for received SMS
    // This would be handled by the native module

    return () => {
      smsSentListener.remove();
      smsFailedListener.remove();
      cleanupSMSService();
    };
  }, []);

  const requestDefaultSMS = async (): Promise<boolean> => {
    const result = await requestToBeDefaultSMSApp();
    setIsDefaultSMS(result);
    return result;
  };

  const sendMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
    const result = await sendSMS(phoneNumber, message);
    return result;
  };

  const value = {
    isDefaultSMS,
    requestDefaultSMS,
    sendMessage,
    messages,
  };

  return (
    <SMSContext.Provider value={value}>
      {children}
    </SMSContext.Provider>
  );
};