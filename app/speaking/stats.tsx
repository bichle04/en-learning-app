import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Activity, Award, Calendar, ChevronLeft, Clock, TrendingUp } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

// Mock Data
const STATS_DATA = {
  totalTests: 24,
  averageScore: 7.2,
  studyTime: 320, // minutes
  streak: 5,
  recentScores: [6.0, 6.5, 7.0, 6.5, 7.5, 8.0],
  skills: [
    { name: "Fluency", score: 7.5, color: "#4CAF50" },
    { name: "Lexical", score: 6.8, color: "#2196F3" },
    { name: "Grammar", score: 6.5, color: "#FF9800" },
    { name: "Pronunciation", score: 8.0, color: "#9C27B0" },
  ],
  recentActivity: [
    { id: 1, title: "Practice: Hometown", time: "2 hours ago", score: 7.5 },
    { id: 2, title: "Full Test #05", time: "Yesterday", score: 7.0 },
    { id: 3, title: "Practice: Hobbies", time: "2 days ago", score: 8.0 },
  ]
};

export default function SpeakingStatsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1E90FF", "#00BFFF"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thống kê Speaking</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Overview Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#E3F2FD" }]}>
              <Activity size={20} color="#1E90FF" />
            </View>
            <Text style={styles.statValue}>{STATS_DATA.totalTests}</Text>
            <Text style={styles.statLabel}>Bài đã làm</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#E8F5E9" }]}>
              <Award size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{STATS_DATA.averageScore}</Text>
            <Text style={styles.statLabel}>Điểm TB</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#FFF3E0" }]}>
              <Clock size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>{Math.round(STATS_DATA.studyTime / 60)}h</Text>
            <Text style={styles.statLabel}>Luyện tập</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#F3E5F5" }]}>
              <TrendingUp size={20} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>{STATS_DATA.streak}</Text>
            <Text style={styles.statLabel}>Ngày Streak</Text>
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Xu hướng điểm số</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
                datasets: [{ data: STATS_DATA.recentScores }]
              }}
              width={width - 70}
              height={180}
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#1E90FF" }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Skills Analysis */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Phân tích kỹ năng</Text>
          <View style={styles.skillsCard}>
            {STATS_DATA.skills.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={[styles.skillScore, { color: skill.color }]}>{skill.score}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${(skill.score / 9) * 100}%`, backgroundColor: skill.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          {STATS_DATA.recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Calendar size={20} color="#7F8C8D" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={styles.activityScore}>
                <Text style={styles.activityScoreText}>{activity.score}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  scrollContent: {
    padding: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  skillsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  skillRow: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
  },
  skillScore: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F2F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#95A5A6",
  },
  activityScore: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityScoreText: {
    color: "#1E90FF",
    fontWeight: "bold",
    fontSize: 12,
  },
});
