import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MetricCard from '@/components/MetricCard';

export default function HomeScreen() {
  // Mock data for dashboard metrics
  const metrics = {
    activeSIMs: 3,
    messagesToday: 128,
    payout: '$45.75',
    connectionStatus: 'Online',
  };

  const statusCards = [
    {
      title: "Active SIMs",
      value: metrics.activeSIMs,
      subtitle: "Connected devices",
      icon: "📱",
      color: "#34C759"
    },
    {
      title: "Messages Today",
      value: metrics.messagesToday,
      subtitle: "Sent & received",
      icon: "💬",
      color: "#007AFF"
    },
    {
      title: "Current Payout",
      value: metrics.payout,
      subtitle: "This month",
      icon: "💰",
      color: "#AF52DE"
    },
    {
      title: "Connection",
      value: metrics.connectionStatus,
      subtitle: "Status",
      icon: "📶",
      color: "#FF9500"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Dashboard</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Monitor your SIM activity and earnings
        </ThemedText>
      </ThemedView>

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
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Stats</ThemedText>
        
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
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
        <ThemedText type="default">No recent activity to display</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  quickStatsContainer: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  incomeContainer: {
    padding: 20,
  },
});
