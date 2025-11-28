import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Award, BarChart3, ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { speakingService } from "../../services/speaking.service";

const { width } = Dimensions.get("window");

interface SpeakingResult {
  overallScore: number;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  partScores: {
    part: number;
    score: number;
    label: string;
  }[];
  completedDate: string;
  title?: string;
}

export default function SpeakingResultScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: 'practice' | 'test' }>();
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && type) {
      fetchResult();
    }
  }, [id, type]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const data = await speakingService.getHistoryItem(Number(id), type);
      
      // Map DB data to UI model
      // Note: This mapping assumes a specific structure of the JSON data in DB.
      // You might need to adjust this based on your actual JSON structure.
      const details = type === 'practice' ? data.details : (data.data?.[0] || {});
      
      const mappedResult: SpeakingResult = {
        overallScore: Number(data.overall_score) || 0,
        fluencyScore: details?.fluency || 0,
        lexicalScore: details?.lexical || 0,
        grammarScore: details?.grammar || 0,
        pronunciationScore: details?.pronunciation || 0,
        partScores: [], // Populate if available in details
        completedDate: new Date(data.created_at).toLocaleDateString('vi-VN'),
        title: type === 'practice' ? data.speaking_parts?.title : 'Full Speaking Test'
      };

      setResult(mappedResult);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return "#4CAF50"; // Green
    if (score >= 6.5) return "#1E90FF"; // Blue
    if (score >= 5.0) return "#FFA500"; // Orange
    return "#FF6B6B"; // Red
  };

  const handleViewDetails = () => {
    // Navigate to feedback screen with result ID
    // router.push("/speaking/feedback" as any);
    console.log("View details");
  };

  const handleBackToHome = () => {
    router.replace("/(tabs)" as any);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy kết quả</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1E90FF", "#00BFFF", "#87CEEB"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative elements */}
        <View style={styles.starLeft}>
          <Text style={styles.starText}>⭐</Text>
        </View>
        <View style={styles.starRight}>
          <Text style={styles.starText}>✨</Text>
        </View>

        {/* Result Card */}
        <View style={styles.resultCard}>
          {/* Award Icon */}
          <View style={styles.awardContainer}>
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={styles.awardBadge}
            >
              <Award color="#FFF" size={40} strokeWidth={2.5} />
            </LinearGradient>
          </View>

          {/* Congratulations Header */}
          <Text style={styles.congratsText}>Congratulations!</Text>

          {/* Test Name */}
          <Text style={styles.testName}>{result.title || "Speaking Test Completed"}</Text>

          {/* Overall Score */}
          <View style={styles.overallScoreContainer}>
            <Text style={[styles.overallScore, { color: getScoreColor(result.overallScore) }]}>
              {result.overallScore.toFixed(1)}
            </Text>
            <Text style={styles.overallLabel}>Overall</Text>
          </View>

          {/* Criteria Scores */}
          <View style={styles.criteriaContainer}>
            <ScoreRow
              score={result.fluencyScore}
              label="Fluency and Coherence"
              color={getScoreColor(result.fluencyScore)}
            />
            <ScoreRow
              score={result.lexicalScore}
              label="Lexical Resource"
              color={getScoreColor(result.lexicalScore)}
            />
            <ScoreRow
              score={result.grammarScore}
              label="Grammatical Range & Accuracy"
              color={getScoreColor(result.grammarScore)}
            />
            <ScoreRow
              score={result.pronunciationScore}
              label="Pronunciation"
              color={getScoreColor(result.pronunciationScore)}
            />
          </View>

          {/* Performance by Part - Only show if we have part scores */}
          {result.partScores.length > 0 && (
            <View style={styles.performanceSection}>
                <Text style={styles.performanceTitle}>Performance by Part</Text>
                <View style={styles.partsContainer}>
                {result.partScores.map((partScore) => (
                    <View key={partScore.part} style={styles.partCard}>
                    <BarChart3 color="#1E90FF" size={20} />
                    <Text style={styles.partNumber}>Part {partScore.part}</Text>
                    <Text style={styles.partLabel}>{partScore.label}</Text>
                    </View>
                ))}
                </View>
            </View>
          )}

          {/* Date */}
          <Text style={styles.dateText}>{result.completedDate}</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.detailButton}
          onPress={handleViewDetails}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FFD700", "#FFA500"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.detailButtonGradient}
          >
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
            <ChevronRight color="#FFF" size={24} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

interface ScoreRowProps {
  score: number;
  label: string;
  color: string;
}

const ScoreRow: React.FC<ScoreRowProps> = ({ score, label, color }) => {
  return (
    <View style={styles.scoreRow}>
      <Text style={[styles.scoreValue, { color }]}>{score.toFixed(1)}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  starLeft: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  starRight: {
    position: "absolute",
    top: 100,
    right: 30,
  },
  starText: {
    fontSize: 24,
  },
  resultCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    width: width - 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  awardContainer: {
    marginBottom: 16,
  },
  awardBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  testName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  testTitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  overallScoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  overallScore: {
    fontSize: 56,
    fontWeight: "bold",
    marginBottom: 4,
  },
  overallLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  criteriaContainer: {
    width: "100%",
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "bold",
    width: 50,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  performanceSection: {
    width: "100%",
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontWeight: "600",
  },
  partsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  partCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E90FF",
  },
  partNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  partLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
  },
  poweredBy: {
    fontSize: 10,
    color: "#CCC",
    marginTop: 4,
  },
  detailButton: {
    width: width - 40,
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  detailButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  mascotContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  mascotEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  mascotBubble: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  mascotText: {
    color: "#1E90FF",
    fontSize: 14,
    fontWeight: "600",
  },
});
