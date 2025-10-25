import MessageItem from "@/components/MessageItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function MessagesScreen() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "sent" | "failed" | "received"
  >("all");

  // Mock message data
  const messages = [
    {
      id: "1",
      content: "Hello, this is a test message",
      status: "sent" as const,
      type: "outgoing" as const,
      timestamp: "2025-10-21 10:30 AM",
      phoneNumber: "+1 (555) 123-4567",
    },
    {
      id: "2",
      content: "Thanks for your purchase!",
      status: "received" as const,
      type: "incoming" as const,
      timestamp: "2025-10-21 09:45 AM",
      phoneNumber: "+1 (555) 987-6543",
    },
    {
      id: "3",
      content: "Your order has been shipped",
      status: "pending" as const,
      type: "outgoing" as const,
      timestamp: "2025-10-21 09:30 AM",
      phoneNumber: "+1 (555) 456-7890",
    },
    {
      id: "4",
      content: "Verification code: 123456",
      status: "failed" as const,
      type: "outgoing" as const,
      timestamp: "2025-10-21 09:15 AM",
      phoneNumber: "+1 (555) 123-4567",
    },
  ];

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.status === filter);

  const handleResendMessage = (messageId: string) => {
    console.log(`Resending message: ${messageId}`);
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Message Control
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          View and manage your SMS logs
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "pending" && styles.activeFilter,
          ]}
          onPress={() => setFilter("pending")}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "pending" && styles.activeFilterText,
            ]}
          >
            Pending
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "sent" && styles.activeFilter,
          ]}
          onPress={() => setFilter("sent")}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "sent" && styles.activeFilterText,
            ]}
          >
            Sent
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "failed" && styles.activeFilter,
          ]}
          onPress={() => setFilter("failed")}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "failed" && styles.activeFilterText,
            ]}
          >
            Failed
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "received" && styles.activeFilter,
          ]}
          onPress={() => setFilter("received")}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "received" && styles.activeFilterText,
            ]}
          >
            Received
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView>
        <ThemedView style={styles.messagesContainer}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                id={message.id}
                content={message.content}
                status={message.status}
                type={message.type}
                timestamp={message.timestamp}
                phoneNumber={message.phoneNumber}
                onPress={() =>
                  message.status === "failed" && handleResendMessage(message.id)
                }
              />
            ))
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>
                No {filter === "all" ? "" : filter + " "}messages yet
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 4,
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
});
