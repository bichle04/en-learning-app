import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft, ChevronRight, Clock, FileText, Mic, Filter } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { speakingService } from "../../services/speaking.service";
import { SpeakingHistory, SpeakingTestHistory } from "../../types/database";

// Combined type for display
type HistoryItem = 
  | (SpeakingHistory & { type: 'practice' }) 
  | (SpeakingTestHistory & { type: 'test' });

export default function SpeakingHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "test" | "practice">("all");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await speakingService.getAllHistory(user.id);
      setHistoryData(data);
    } catch (error) {
      console.error("Failed to fetch speaking history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = historyData.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return "#4CAF50"; // Green
    if (score >= 6.5) return "#1E90FF"; // Blue
    if (score >= 5.0) return "#FFA500"; // Orange
    return "#FF6B6B"; // Red
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isTest = item.type === "test";
    const title = isTest 
      ? "Full Speaking Test" 
      : (item as SpeakingHistory).speaking_parts?.title || "Speaking Practice";
    
    const score = item.overall_score ? Number(item.overall_score) : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
            router.push({
                pathname: "/speaking/result",
                params: { id: item.id, type: item.type }
            });
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: isTest ? '#E3F2FD' : '#E8F5E9' }]}>
          {isTest ? (
            <FileText size={24} color="#1E90FF" />
          ) : (
            <Mic size={24} color="#4CAF50" />
          )}
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {title}
            </Text>
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(score) }]}>
              <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.metaInfo}>
              <Calendar size={14} color="#7F8C8D" />
              <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
            </View>
            <View style={styles.metaInfo}>
              <Clock size={14} color="#7F8C8D" />
              <Text style={styles.metaText}>{formatTime(item.created_at)}</Text>
            </View>
          </View>
        </View>
        
        <ChevronRight size={20} color="#BDC3C7" />
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Lịch sử luyện tập</Text>
          <View style={{ width: 28 }} /> 
        </View>
      </LinearGradient>

      <View style={styles.filterContainer}>
        {(["all", "test", "practice"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              filter === tab && styles.filterTabActive,
            ]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[
                styles.filterText,
                filter === tab && styles.filterTextActive,
              ]}
            >
              {tab === "all" ? "Tất cả" : tab === "test" ? "Thi thử" : "Luyện tập"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Filter size={48} color="#BDC3C7" />
              <Text style={styles.emptyText}>Chưa có dữ liệu lịch sử</Text>
            </View>
          }
        />
      )}
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterTabActive: {
    backgroundColor: "#1E90FF",
    borderColor: "#1E90FF",
  },
  filterText: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFF",
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#95A5A6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
