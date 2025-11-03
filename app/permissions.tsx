import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePermissions } from "@/hooks/usePermissions";

const PermissionsScreen = () => {
  const { requestPermissions } = usePermissions();

  const handleGrantPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      router.replace("/(tabs)");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Allow Permissions
        </ThemedText>
        <ThemedText style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. We also
          need to access your contacts.
        </ThemedText>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleGrantPermissions}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Grant Permissions
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.8,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PermissionsScreen;
