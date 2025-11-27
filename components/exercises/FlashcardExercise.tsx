import { Exercise } from "@/types/lesson";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { Volume2 } from "lucide-react-native";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FlashcardProps {
  exercise: Exercise;
  currentCourse: any;
  showAnswer: boolean;
  flipAnim: Animated.Value;
  slideAnim: Animated.Value;
  setShowAnswer: (show: boolean) => void;
}

export const FlashcardExercise: React.FC<FlashcardProps> = ({
  exercise,
  currentCourse,
  showAnswer,
  flipAnim,
  slideAnim,
  setShowAnswer,
}) => (
  <View style={styles.exerciseContainer}>
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ translateX: slideAnim }] }]}
    >
      {/* Front of card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          {
            transform: [
              {
                rotateY: flipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["#FFFFFF", "#F8F9FA"] as const}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.wordTitle}>{exercise.word.word}</Text>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => {
                Speech.stop(); 
                Speech.speak(exercise.word.word, {
                  language: "en", 
                  pitch: 1,
                  rate: 1,
                });
              }}
            >
              <Volume2 size={24} color="#FF6B9D" />
            </TouchableOpacity>
            <Text style={styles.pronunciation}>
              {exercise.word.pronunciation}
            </Text>
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap to reveal definition</Text>
              <Text style={styles.tapHintEmoji}>👆</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Back of card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            transform: [
              {
                rotateY: flipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["180deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            currentCourse
              ? [currentCourse.color_start, currentCourse.color_end]
              : ["#9B59B6", "#8E44AD"]
          }
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.wordTitleBack}>{exercise.word.word}</Text>
            <Text style={styles.definition}>{exercise.word.definition}</Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Example:</Text>
              <Text style={styles.example}>{exercise.word.example}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {exercise.word.difficulty}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>

    {/* Tap to flip overlay */}
    {!showAnswer && (
      <TouchableOpacity
        style={styles.flipOverlay}
        onPress={() => {
          Animated.timing(flipAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
          setShowAnswer(true);
        }}
        activeOpacity={1}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  exerciseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: "100%",
    height: 400,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backfaceVisibility: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 30,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wordTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 16,
  },
  wordTitleBack: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  soundButton: {
    backgroundColor: "rgba(255, 107, 157, 0.1)",
    borderRadius: 25,
    padding: 12,
    marginBottom: 16,
  },
  pronunciation: {
    fontSize: 18,
    color: "#7F8C8D",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  definition: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 30,
  },
  exampleContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.9,
  },
  example: {
    fontSize: 16,
    color: "#FFFFFF",
    fontStyle: "italic",
    lineHeight: 22,
  },
  difficultyBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  difficultyText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tapHint: {
    alignItems: "center",
  },
  tapHintText: {
    fontSize: 16,
    color: "#95A5A6",
    marginBottom: 8,
  },
  tapHintEmoji: {
    fontSize: 24,
  },
  flipOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
});
