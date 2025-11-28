import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Star,
  Target,
  TrendingUp,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useUserStats } from "../../hooks/useUserStats";

export default function HomeScreen() {
  const { user } = useAuth();
  const { stats, loading } = useUserStats();

  const navigateToCourses = () => {
    router.push("/(tabs)/courses");
  };

  // Sử dụng dữ liệu từ stats hoặc fallback values nếu đang loading hoặc user chưa đăng nhập
  const currentStreak = stats.currentStreak;
  const wordsToReview = stats.wordsToReview;
  const todayProgress = stats.todayProgress;
  const totalWords = stats.totalWords;

  // Hiển thị loading hoặc dữ liệu mặc định khi chưa có user
  const displayStreak = user ? currentStreak : 0;
  const displayReview = user ? wordsToReview : 0;
  const displayProgress = user ? todayProgress : 0;
  const displayTotal = user ? totalWords : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={["#FF6B9D", "#FF8C42"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning! 🌅</Text>
            <Text style={styles.username}>Ready to learn with Mochi?</Text>
          </View>
          <View style={styles.mascotContainer}>
            <Text style={styles.mascot}>🐱</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Golden Time Section */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color="#FF6B9D" style={{ marginBottom: 8 }} />
          <Text style={styles.sectionTitle}>Golden Time ⏰</Text>
        </View>

        <TouchableOpacity
          style={styles.goldenTimeCard}
          onPress={navigateToReview}
        >
          <LinearGradient
            colors={["#FFD700", "#FFA500"]}
            style={styles.goldenTimeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.goldenTimeContent}>
              <View style={styles.goldenTimeInfo}>
                <Text style={styles.goldenTimeTitle}>Perfect Review Time!</Text>
                <Text style={styles.goldenTimeSubtitle}>
                  {displayReview} words ready for review
                </Text>
                <Text style={styles.goldenTimeTime}>
                  Best time: Now - 2:00 PM
                </Text>
              </View>
              <View style={styles.goldenTimeIcon}>
                <Text style={styles.goldenTimeMascot}>🧠✨</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{"Today's Progress"}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Star size={20} color="#FF6B9D" />
            </View>
            <Text style={styles.statNumber}>{displayStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target size={20} color="#9B59B6" />
            </View>
            <Text style={styles.statNumber}>{displayProgress}%</Text>
            <Text style={styles.statLabel}>Daily Goal</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={20} color="#2ECC71" />
            </View>
            <Text style={styles.statNumber}>{displayTotal}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: "#FF6B9D" }]}
            onPress={navigateToCourses}
          >
            <Text style={styles.quickActionIcon}>📚</Text>
            <Text style={styles.quickActionText}>Browse Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: "#9B59B6" }]}
            onPress={() => router.push("/(tabs)/notebook")}
          >
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionText}>My Notebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: "#FF8C42" }]}
            onPress={() => router.push("/speaking" as any)}
          >
            <Text style={styles.quickActionIcon}>🎙️</Text>
            <Text style={styles.quickActionText}>Speaking Room</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Motivational Section */}
      <View style={styles.motivationSection}>
        <View style={styles.motivationCard}>
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>Keep it up! 🎉</Text>
            <Text style={styles.motivationText}>
              You{"'"}re doing amazing! Michi believes in you! Remember:
              consistency is key to mastering vocabulary.
            </Text>
          </View>
          <Text style={styles.motivationMascot}>🐱</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  username: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 4,
  },
  mascotContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 10,
  },
  mascot: {
    fontSize: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 8,
    marginBottom: 8,
  },
  goldenTimeCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  goldenTimeGradient: {
    padding: 20,
  },
  goldenTimeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goldenTimeInfo: {
    flex: 1,
  },
  goldenTimeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  goldenTimeSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 2,
  },
  goldenTimeTime: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  goldenTimeIcon: {
    marginLeft: 15,
  },
  goldenTimeMascot: {
    fontSize: 40,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionCard: {
    flexBasis: "48%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  motivationSection: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  motivationMascot: {
    fontSize: 40,
    marginLeft: 15,
  },
});
