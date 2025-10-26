import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { usePermissions } from "@/hooks/usePermissions";

const Index = () => {
  const { permissions, loading, checkPermissions, requestPermissions } =
    usePermissions();

  // Determine initial route based on permissions
  const hasAllPermissions =
    permissions.sms && permissions.phoneState && permissions.contacts;

  console.log(permissions);

  useEffect(() => {
    const permissionChecking = async () => {
      await checkPermissions();
      const initialRouteName = hasAllPermissions ? "/(tabs)" : "/onboarding";
      router.replace(initialRouteName);
    };
    permissionChecking();
  }, []);
  return (
    <View>
      <Text>Index</Text>
    </View>
  );
};

export default Index;
