import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Welcome to SimCash",
    description: "Earn money by connecting your SIM cards and handling SMS messages",
  },
  {
    key: "2",
    title: "Connect SIMs",
    description: "Easily connect multiple SIM cards",
  },
  {
    key: "3",
    title: "Earn Payouts",
    description: "Get paid for every SMS sent",
  },
  {
    key: "4",
    title: "Track Stats",
    description: "Monitor earnings and usage",
  },
];

const OnboardingSlides = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleSkip = () => {
    router.replace("/permissions");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // @ts-ignore
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/permissions");
    }
  };

  const flatListRef = React.useRef(null);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <ThemedText>Skip</ThemedText>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <ThemedText type="title" style={styles.title}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.description}>
              {item.description}
            </ThemedText>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Let's Start" : "Next"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
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

export default OnboardingSlides;
