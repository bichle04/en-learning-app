import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { PenTool, Volume2 } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SpellingProps {
  exercise: Exercise;
  showAnswer: boolean;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
}

export const SpellingExercise: React.FC<SpellingProps> = ({
  exercise,
  showAnswer,
  userAnswer,
  setUserAnswer,
}) => (
  <View style={styles.exerciseContainer}>
    <View style={styles.questionCard}>
      <View style={styles.exerciseHeader}>
        <PenTool size={24} color="#E74C3C" />
        <Text style={styles.exerciseTitle}>Spell the word</Text>
      </View>

      <Text style={styles.spellingDefinition}>{exercise.word.definition}</Text>
      <Text style={styles.pronunciation}>{exercise.word.pronunciation}</Text>

      <TouchableOpacity
        style={styles.audioButton}
        onPress={() => {
          Speech.stop(); 
          Speech.speak(exercise.word.word, {
            language: "en", 
            pitch: 1,
            rate: 1,
          });
        }}
      >
        <Volume2 size={16} color="#FFFFFF" />
        <Text style={styles.audioButtonText}>🔊 Hear pronunciation</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.spellingInput}
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholder="Spell the word..."
        placeholderTextColor="#95A5A6"
        editable={!showAnswer}
        autoCapitalize="none"
      />

      {showAnswer && (
        <View style={styles.answerReveal}>
          <Text style={styles.correctAnswerLabel}>Correct spelling:</Text>
          <Text style={styles.correctAnswerText}>{exercise.correctAnswer}</Text>
        </View>
      )}

      {/* Michi encouragement */}
      <View style={styles.mascotEncouragement}>
        <Text style={styles.encouragementMascot}>🐱</Text>
        <Text style={styles.encouragementText}>
          {!userAnswer
            ? "Michi knows you can spell this! Take your time!"
            : showAnswer
            ? userAnswer.toLowerCase() === exercise.correctAnswer?.toLowerCase()
              ? "Perfect spelling! 🎉"
              : "Good effort! Keep practicing! 💪"
            : "Looking good! Check your spelling when ready!"}
        </Text>
      </View>
    </View>
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
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    minHeight: 500,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 12,
  },
  spellingDefinition: {
    fontSize: 18,
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },
  pronunciation: {
    fontSize: 18,
    color: "#7F8C8D",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  audioButton: {
    backgroundColor: "#FF6B9D",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  audioButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  spellingInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: "#2C3E50",
    borderWidth: 2,
    borderColor: "#ECF0F1",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: 20,
  },
  answerReveal: {
    marginTop: 20,
    alignItems: "center",
  },
  correctAnswerLabel: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  mascotEncouragement: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  encouragementMascot: {
    fontSize: 30,
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 18,
  },
});
