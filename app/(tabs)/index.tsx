import MetricCard from "@/components/MetricCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  // Mock data for dashboard metrics
  const metrics = {
    activeSIMs: 3,
    messagesToday: 128,
    payout: "$45.75",
    connectionStatus: "Online",
  };

  const statusCards = [
    {
      title: "Active SIMs",
      value: metrics.activeSIMs,
      subtitle: "Connected devices",
      icon: "📱",
      color: "#34C759",
    },
    {
      title: "Messages Today",
      value: metrics.messagesToday,
      subtitle: "Sent & received",
      icon: "💬",
      color: "#007AFF",
    },
    {
      title: "Current Payout",
      value: metrics.payout,
      subtitle: "This month",
      icon: "💰",
      color: "#AF52DE",
    },
    {
      title: "Connection",
      value: metrics.connectionStatus,
      subtitle: "Status",
      icon: "📶",
      color: "#FF9500",
    },
  ];

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Dashboard
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Monitor your SIM activity and earnings
        </ThemedText>
      </ThemedView>

      <ScrollView>
        <ThemedView style={styles.metricsContainer}>
          {statusCards.map((card, index) => (
            <View key={index}>
              <MetricCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
              />
            </View>
          ))}
        </ThemedView>
        <ThemedView style={styles.quickStatsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Stats
          </ThemedText>
          <ThemedView style={styles.statRow}>
            <ThemedText>Total Messages: </ThemedText>
            <ThemedText type="defaultSemiBold">1,248</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statRow}>
            <ThemedText>Active SIMs: </ThemedText>
            <ThemedText type="defaultSemiBold">5</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statRow}>
            <ThemedText>Earnings: </ThemedText>
            <ThemedText type="defaultSemiBold">$128.50</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.incomeContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          <ThemedText type="default">No recent activity to display</ThemedText>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    padding: 16, // Reduced padding since SafeAreaView handles safe areas
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 8, // Reduced padding
  },
  quickStatsContainer: {
    padding: 16, // Reduced padding
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4, // Reduced padding
  },
  incomeContainer: {
    padding: 16, // Reduced padding
  },
});
