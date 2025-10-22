import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MetricCard from '@/components/MetricCard';

export default function PayoutsScreen() {
  // Mock payout data
  const earnings = {
    currentBalance: 128.50,
    totalEarned: 456.75,
    pendingPayout: 24.50,
    payoutRate: 0.05, // $0.05 per SMS
  };

  const payoutHistory = [
    { id: '1', amount: 45.75, date: '2025-10-15', status: 'completed' },
    { id: '2', amount: 32.50, date: '2025-10-01', status: 'completed' },
    { id: '3', amount: 24.50, date: '2025-09-15', status: 'pending' },
  ];

  const handleWithdraw = () => {
    console.log('Initiating withdrawal...');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Payouts</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Track your earnings and withdrawals
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.metricsContainer}>
        <MetricCard 
          title="Current Balance"
          value={`${earnings.currentBalance.toFixed(2)}`}
          subtitle="Available for withdrawal"
          icon="💰"
        />
        <MetricCard 
          title="Total Earned"
          value={`${earnings.totalEarned.toFixed(2)}`}
          subtitle="All time earnings"
          icon="📈"
        />
      </ThemedView>

      <ThemedView style={styles.metricsContainer}>
        <MetricCard 
          title="Pending Payout"
          value={`${earnings.pendingPayout.toFixed(2)}`}
          subtitle="Processing"
          icon="⏳"
        />
        <MetricCard 
          title="Rate per SMS"
          value={`${earnings.payoutRate.toFixed(2)}`}
          subtitle="Earnings per message"
          icon="📊"
        />
      </ThemedView>

      <ThemedView style={styles.withdrawalSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Withdraw Funds</ThemedText>
        
        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
          <ThemedText type="defaultSemiBold" style={styles.withdrawButtonText}>
            Withdraw to PayPal
          </ThemedText>
        </TouchableOpacity>
        
        <ThemedText style={styles.withdrawalInfo}>
          Minimum withdrawal amount is $5.00
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.historySection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Payout History</ThemedText>
        
        {payoutHistory.length > 0 ? (
          payoutHistory.map((payout) => (
            <ThemedView key={payout.id} style={styles.historyItem}>
              <View style={styles.historyItemContent}>
                <ThemedText type="defaultSemiBold">${payout.amount.toFixed(2)}</ThemedText>
                <ThemedText>{payout.date}</ThemedText>
              </View>
              <ThemedText style={[
                styles.status, 
                payout.status === 'completed' ? styles.statusCompleted : styles.statusPending
              ]}>
                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No payout history yet</ThemedText>
          </ThemedView>
        )}
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
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
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
  withdrawalSection: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  withdrawButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
  },
  withdrawalInfo: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  historySection: {
    padding: 20,
    paddingTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 10,
  },
  historyItemContent: {
    flex: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 4,
  },
  statusCompleted: {
    color: '#34C759',
  },
  statusPending: {
    color: '#FF9500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});