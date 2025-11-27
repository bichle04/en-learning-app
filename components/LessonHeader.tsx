import { Exercise } from "@/types/lesson";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LessonHeaderProps {
  currentCourse: any;
  currentExercise: Exercise;
  currentExerciseIndex: number;
  totalExercises: number;
  progress: number;
  onBack: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentCourse,
  currentExercise,
  currentExerciseIndex,
  totalExercises,
  progress,
  onBack,
}) => (
  <LinearGradient
    colors={
      currentCourse
        ? [currentCourse.color_start, currentCourse.color_end]
        : ["#FF6B9D", "#FF8C42"]
    }
    style={styles.header}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.headerContent}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>
          {currentCourse?.title || "Lesson"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {currentExercise?.type.replace("-", " ").toUpperCase() || "LESSON"}
        </Text>
      </View>
      <View style={styles.mascotContainer}>
        <Text style={styles.mascot}>🍡</Text>
      </View>
    </View>

    {/* Progress Bar */}
    <View style={styles.progressSection}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {currentExerciseIndex + 1} of {totalExercises}
        </Text>
        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
  },
  mascotContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  mascot: {
    fontSize: 24,
  },
  progressSection: {
    marginTop: 10,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  progressPercent: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
});
