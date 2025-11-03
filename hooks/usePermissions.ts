import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { check, request, RESULTS, PERMISSIONS } from "react-native-permissions";
import { NativeModules } from "react-native";

const { DefaultSmsModule } = NativeModules; // 👈 from your Kotlin native module

type PermissionState = {
  sms: boolean;
  phone: boolean;
  contacts: boolean;
  isDefault: boolean;
};

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    sms: false,
    phone: false,
    contacts: false,
    isDefault: false,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Check all permissions & default app status
  const checkPermissions = async (): Promise<boolean> => {
    try {
      const [readSms, receiveSms, sendSms] = await Promise.all([
        check(PERMISSIONS.ANDROID.READ_SMS),
        check(PERMISSIONS.ANDROID.RECEIVE_SMS),
        check(PERMISSIONS.ANDROID.SEND_SMS),
      ]);
      const phone = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);
      const contacts = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      // const isDefault = await DefaultSmsModule.isDefaultSmsApp();
      const isDefault = false;

      const smsGranted = [readSms, receiveSms, sendSms].every(
        (s) => s === RESULTS.GRANTED || s === RESULTS.LIMITED
      );
      const phoneGranted =
        phone === RESULTS.GRANTED || phone === RESULTS.LIMITED;
      const contactsGranted =
        contacts === RESULTS.GRANTED || contacts === RESULTS.LIMITED;

      setPermissions({
        sms: smsGranted,
        phone: phoneGranted,
        contacts: contactsGranted,
        isDefault,
      });
      setLoading(false);

      return smsGranted && phoneGranted && contactsGranted && isDefault;
    } catch (err) {
      console.error("Permission check failed:", err);
      setLoading(false);
      return false;
    }
  };

  // 🔹 Request all permissions + trigger default app dialog
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const [readSms, receiveSms, sendSms] = await Promise.all([
        request(PERMISSIONS.ANDROID.READ_SMS),
        request(PERMISSIONS.ANDROID.RECEIVE_SMS),
        request(PERMISSIONS.ANDROID.SEND_SMS),
      ]);
      const phone = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
      const contacts = await request(PERMISSIONS.ANDROID.READ_CONTACTS);

      const smsGranted = [readSms, receiveSms, sendSms].every(
        (s) => s === RESULTS.GRANTED || s === RESULTS.LIMITED
      );
      const phoneGranted =
        phone === RESULTS.GRANTED || phone === RESULTS.LIMITED;
      const contactsGranted =
        contacts === RESULTS.GRANTED || contacts === RESULTS.LIMITED;

      // 👇 Trigger default SMS app dialog from Kotlin native module
      const isDefault = await DefaultSmsModule.requestDefaultSmsApp();

      setPermissions({
        sms: smsGranted,
        phone: phoneGranted,
        contacts: contactsGranted,
        isDefault,
      });
      setLoading(false);

      return smsGranted && phoneGranted && contactsGranted && isDefault;
    } catch (err) {
      console.error("Permission request failed:", err);
      setLoading(false);
      return false;
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      "Permissions Required",
      "SimCash requires SMS, phone, and contacts access to send and receive messages properly. Please allow these and set SimCash as your default SMS app.",
      [{ text: "OK" }]
    );
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    loading,
    checkPermissions,
    requestPermissions,
    showPermissionAlert,
  };
};
