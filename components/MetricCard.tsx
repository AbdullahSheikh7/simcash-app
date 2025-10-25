import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
}

const { width } = Dimensions.get("window");

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle }) => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="default" style={styles.title}>
          {title}
        </ThemedText>
      </View>
      <ThemedText type="title" style={styles.value}>
        {value}
      </ThemedText>
      {subtitle && (
        <ThemedText type="defaultSemiBold" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    minWidth: 150,
    maxWidth: width / 2.5,
    margin: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    opacity: 0.8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default MetricCard;
