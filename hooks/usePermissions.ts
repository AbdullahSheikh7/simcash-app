import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

type PermissionStatus = "granted" | "limited";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState({
    sms: false,
    phoneState: false,
    storage: false,
    contacts: false,
  });

  const [loading, setLoading] = useState(true);

  const requestPermissions = async () => {
    try {
      // Request SMS permissions
      const [readSmsStatus, receiveSmsStatus, sendSmsStatus] =
        await Promise.all([
          request(PERMISSIONS.ANDROID.READ_SMS),
          request(PERMISSIONS.ANDROID.RECEIVE_SMS),
          request(PERMISSIONS.ANDROID.SEND_SMS),
        ]);

      // Request phone state permissions
      const phoneStateStatus = await request(
        PERMISSIONS.ANDROID.READ_PHONE_STATE
      );

      // Request storage permissions
      const contactsStatus = await request(PERMISSIONS.ANDROID.READ_CONTACTS);

      const [readStorageStatus, writeStorageStatus] = await Promise.all([
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
        request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE),
      ]);

      const allSmsGranted =
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          readSmsStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          receiveSmsStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          sendSmsStatus as PermissionStatus
        );

      const allPhoneGranted = [RESULTS.GRANTED, RESULTS.LIMITED].includes(
        phoneStateStatus as PermissionStatus
      );

      const allStorageGranted =
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          readStorageStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          writeStorageStatus as PermissionStatus
        );

      const contactsGranted = [RESULTS.GRANTED, RESULTS.LIMITED].includes(
        contactsStatus as PermissionStatus
      );

      setPermissions({
        sms: allSmsGranted,
        phoneState: allPhoneGranted,
        storage: allStorageGranted,
        contacts: contactsGranted,
      });

      setLoading(false);
      return (
        allSmsGranted && allPhoneGranted && allStorageGranted && contactsGranted
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setLoading(false);
      return false;
    }
  };

  const checkPermissions = async () => {
    try {
      // Check SMS permissions
      const [readSmsStatus, receiveSmsStatus, sendSmsStatus] =
        await Promise.all([
          check(PERMISSIONS.ANDROID.READ_SMS),
          check(PERMISSIONS.ANDROID.RECEIVE_SMS),
          check(PERMISSIONS.ANDROID.SEND_SMS),
        ]);

      // Check phone state permissions
      const phoneStateStatus = await check(
        PERMISSIONS.ANDROID.READ_PHONE_STATE
      );

      // Check storage permissions
      const [readStorageStatus, writeStorageStatus] = await Promise.all([
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
        check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE),
      ]);

      const contactsStatus = await check(PERMISSIONS.ANDROID.READ_CONTACTS);

      const allSmsGranted =
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          readSmsStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          receiveSmsStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          sendSmsStatus as PermissionStatus
        );

      const allPhoneGranted = [RESULTS.GRANTED, RESULTS.LIMITED].includes(
        phoneStateStatus as PermissionStatus
      );

      const allStorageGranted =
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          readStorageStatus as PermissionStatus
        ) &&
        [RESULTS.GRANTED, RESULTS.LIMITED].includes(
          writeStorageStatus as PermissionStatus
        );

      const contactsGranted = [RESULTS.GRANTED, RESULTS.LIMITED].includes(
        contactsStatus as PermissionStatus
      );

      setPermissions({
        sms: allSmsGranted,
        phoneState: allPhoneGranted,
        storage: allStorageGranted,
        contacts: contactsGranted,
      });

      setLoading(false);
      return (
        allSmsGranted && allPhoneGranted && allStorageGranted && contactsGranted
      );
    } catch (error) {
      console.error("Error checking permissions:", error);
      setLoading(false);
      return false;
    }
  };

  const showPermissionDialog = () => {
    Alert.alert(
      "Permissions Required",
      "SimCash requires SMS and phone permissions to function properly. These permissions are needed to send and receive SMS messages through your SIM cards.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Settings", onPress: () => {} },
      ]
    );
  };

  useEffect(() => {
    const checkInitialPermissions = async () => {
      await checkPermissions();
    };

    checkInitialPermissions();
  }, []);

  return {
    permissions,
    loading,
    requestPermissions,
    checkPermissions,
    showPermissionDialog,
  };
};
