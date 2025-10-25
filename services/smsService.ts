// SMS service for SimCash app
// This service handles integration with native SMS functionality and backend

import { DeviceEventEmitter } from "react-native";
import { createMMKV, type MMKV } from "react-native-mmkv";

// Define event types for SMS events
export const SMS_EVENTS = {
  SMS_RECEIVED: "sms_received",
  SMS_SENT: "sms_sent",
  SMS_FAILED: "sms_failed",
  SMS_STATUS_UPDATE: "sms_status_update",
};

// Function to initialize and return storage instance
let storageInstance: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!storageInstance) {
    try {
      storageInstance = createMMKV();
    } catch (error) {
      console.error("Failed to initialize MMKV storage:", error);
      // Fallback storage implementation
      const fallbackStorage: Record<string, any> = {};
      storageInstance = {
        getString: (key: string) => fallbackStorage[key] || null,
        set: (key: string, value: any) => {
          fallbackStorage[key] = value;
        },
        getBoolean: (key: string) => fallbackStorage[key] || false,
        delete: (key: string) => {
          delete fallbackStorage[key];
        },
        clearAll: () => {
          Object.keys(fallbackStorage).forEach(
            (key) => delete fallbackStorage[key]
          );
        },
        getAllKeys: () => Object.keys(fallbackStorage),
      } as MMKV;
    }
  }
  return storageInstance;
};

// Function to send SMS via native module or mock
export const sendSMS = async (
  phoneNumber: string,
  message: string,
  simId?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        console.log(
          `Sending SMS to ${phoneNumber} via SIM ${
            simId || "default"
          }: ${message}`
        );

        // In a real implementation, this would call the native module
        // const result = NativeModules.SmsModule.sendSms(phoneNumber, message);

        // For now, simulate success 80% of the time
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
          console.log("SMS sent successfully");
          DeviceEventEmitter.emit(SMS_EVENTS.SMS_SENT, {
            phoneNumber,
            message,
            timestamp: new Date().toISOString(),
            simId,
          });
          resolve(true);
        } else {
          console.log("SMS failed to send");
          DeviceEventEmitter.emit(SMS_EVENTS.SMS_FAILED, {
            phoneNumber,
            message,
            timestamp: new Date().toISOString(),
            simId,
            error: "Failed to send message",
          });
          resolve(false);
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
        DeviceEventEmitter.emit(SMS_EVENTS.SMS_FAILED, {
          phoneNumber,
          message,
          timestamp: new Date().toISOString(),
          simId,
          error: (error as Error).message,
        });
        resolve(false);
      }
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  });
};

// Function to get device phone number
export const getDevicePhoneNumber = async (): Promise<string | null> => {
  // In a real implementation, this would retrieve the device's phone number
  // const phoneNumber = NativeModules.SmsModule.getDevicePhoneNumber();
  // For now, return a mock value
  const storage = getStorage();
  return storage.getString("device_phone_number") || "+1 (555) 000-0000";
};

// Function to check if the app is default SMS app
export const isDefaultSMSApp = async (): Promise<boolean> => {
  // In a real implementation, this would check if the app is the default SMS app
  // const isDefault = NativeModules.SmsModule.isDefaultSmsApp();
  // For now, return a mock value
  const storage = getStorage();
  return storage.getBoolean("is_default_sms_app") || false;
};

// Function to request to be the default SMS app
export const requestToBeDefaultSMSApp = async (): Promise<boolean> => {
  // In a real implementation, this would prompt the user to make the app the default SMS app
  // const success = NativeModules.SmsModule.requestDefaultSmsApp();
  console.log("Requesting to be default SMS app");
  return true; // Mock success
};

// Function to get SIM card information
export const getSIMInfo = async (): Promise<
  { carrier: string; country: string; phoneNumber: string; simId: string }[]
> => {
  // In a real implementation, this would retrieve SIM card information
  // const simInfo = NativeModules.SmsModule.getSimInfo();
  // For now, return mock data
  return [
    {
      carrier: "Verizon",
      country: "US",
      phoneNumber: "+1 (555) 123-4567",
      simId: "1",
    },
    {
      carrier: "AT&T",
      country: "US",
      phoneNumber: "+1 (555) 987-6543",
      simId: "2",
    },
  ];
};

// Initialize the SMS service
export const initializeSMSService = () => {
  // In a real implementation, this would initialize the native SMS listening service
  console.log("SMS service initialized");

  // Register for incoming SMS if permissions allow
  // This would be done via a native module
};

// Cleanup function
export const cleanupSMSService = () => {
  // In a real implementation, this would clean up the native SMS listening service
  console.log("SMS service cleaned up");
};

// Function to handle SMS status updates from backend
export const handleSMSStatusUpdate = (
  messageId: string,
  status: "pending" | "sent" | "failed" | "received"
) => {
  DeviceEventEmitter.emit(SMS_EVENTS.SMS_STATUS_UPDATE, {
    messageId,
    status,
    timestamp: new Date().toISOString(),
  });
};

// Function to save received SMS to storage
export const saveReceivedSMS = (phoneNumber: string, message: string) => {
  const storage = getStorage();
  const receivedMessages = JSON.parse(
    storage.getString("received_messages") || "[]"
  );
  const newMessage = {
    id: `received_${Date.now()}`,
    phoneNumber,
    message,
    timestamp: new Date().toISOString(),
    status: "received" as const,
  };
  receivedMessages.push(newMessage);
  storage.set("received_messages", JSON.stringify(receivedMessages));
};
