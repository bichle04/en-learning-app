import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Headphones, Trophy } from "lucide-react-native";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SpeakingModeSelection() {
  const handleModeSelect = (mode: "practice" | "test") => {
    if (mode === "practice") {
      router.push("/speaking/practice" as any);
    } else {
      router.push("/speaking/test" as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1E90FF", "#00BFFF", "#87CEEB"]}
        style={styles.gradient}
      >
        {/* Decorative elements */}
        <View style={[styles.star, { top: 60, left: 20 }]} />
        <View style={[styles.plus, { top: 80, right: 30 }]} />
        <View style={[styles.star, { bottom: 120, left: width * 0.7 }]} />
        <View style={[styles.plus, { bottom: 200, left: 40 }]} />

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select test mode</Text>
            <Text style={styles.subtitle}>
              Choose the mode that suits you best
            </Text>
          </View>

          {/* Mode Cards */}
          <View style={styles.cardsContainer}>
            {/* Practice Mode */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleModeSelect("practice")}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                  <Headphones size={48} color="#FFB800" strokeWidth={2} />
                </View>
              </View>
              <Text style={styles.cardTitle}>Practice</Text>
              <Text style={styles.cardDescription}>
                Practice speaking with instant feedback
              </Text>
            </TouchableOpacity>

            {/* Test Mode */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleModeSelect("test")}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                  <Trophy size={48} color="#FFB800" strokeWidth={2} />
                </View>
              </View>
              <Text style={styles.cardTitle}>Test</Text>
              <Text style={styles.cardDescription}>
                Take a mock test in a virtual test room
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: (width - 64) / 2,
    minHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
  },
  // Decorative elements
  star: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 4,
  },
  plus: {
    position: "absolute",
    width: 16,
    height: 16,
  },
});
