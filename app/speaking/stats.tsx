import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Activity, Award, Calendar, ChevronLeft, Clock, TrendingUp } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../../contexts/AuthContext";
import { speakingService } from "../../services/speaking.service";

const { width } = Dimensions.get("window");

export default function SpeakingStatsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await speakingService.getUserStats(user.id);
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không thể tải dữ liệu thống kê</Text>
      </View>
    );
  }

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
            <Text style={styles.statValue}>{stats.totalTests}</Text>
            <Text style={styles.statLabel}>Bài đã làm</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#E8F5E9" }]}>
              <Award size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{stats.averageScore}</Text>
            <Text style={styles.statLabel}>Điểm TB</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#FFF3E0" }]}>
              <Clock size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.studyTime / 60)}h</Text>
            <Text style={styles.statLabel}>Luyện tập</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: "#F3E5F5" }]}>
              <TrendingUp size={20} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Ngày Streak</Text>
          </View>
        </View>

        {/* Progress Chart */}
        {stats.recentScores.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Xu hướng điểm số</Text>
            <View style={styles.chartCard}>
              <LineChart
                data={{
                  labels: stats.recentScores.map((_: any, i: number) => `L${i + 1}`),
                  datasets: [{ data: stats.recentScores }]
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
        )}

        {/* Skills Analysis */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Phân tích kỹ năng</Text>
          <View style={styles.skillsCard}>
            {stats.skills.map((skill: any, index: number) => (
              <View key={index} style={styles.skillRow}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={[styles.skillScore, { color: skill.color }]}>{skill.score.toFixed(1)}</Text>
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
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity: any) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <Calendar size={20} color="#7F8C8D" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View style={styles.activityScore}>
                  <Text style={styles.activityScoreText}>{activity.score.toFixed(1)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#999', textAlign: 'center', marginTop: 10 }}>Chưa có hoạt động nào</Text>
          )}
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
