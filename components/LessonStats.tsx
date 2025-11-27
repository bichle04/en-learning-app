import {
  CircleCheck as CheckCircle,
  Star,
  Circle as XCircle,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LessonStatsProps {
  correctAnswers: number;
  wrongAnswers: number;
}

export const LessonStats: React.FC<LessonStatsProps> = ({
  correctAnswers,
  wrongAnswers,
}) => (
  <View style={styles.statsContainer}>
    <View style={styles.statItem}>
      <CheckCircle size={16} color="#2ECC71" />
      <Text style={styles.statText}>{correctAnswers}</Text>
    </View>
    <View style={styles.statItem}>
      <XCircle size={16} color="#E74C3C" />
      <Text style={styles.statText}>{wrongAnswers}</Text>
    </View>
    <View style={styles.statItem}>
      <Star size={16} color="#F39C12" />
      <Text style={styles.statText}>
        {Math.round(
          correctAnswers + wrongAnswers > 0
            ? (correctAnswers / (correctAnswers + wrongAnswers)) * 100
            : 0
        )}
        %
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "600",
    marginLeft: 6,
  },
});
