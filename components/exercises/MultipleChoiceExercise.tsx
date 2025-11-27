import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { Target, Volume2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MultipleChoiceProps {
  exercise: Exercise;
  showAnswer: boolean;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceProps> = ({
  exercise,
  showAnswer,
  selectedOption,
  setSelectedOption,
}) => (
  <View style={styles.exerciseContainer}>
    <View style={styles.questionCard}>
      <View style={styles.exerciseHeader}>
        <Target size={24} color="#FF6B9D" />
        <Text style={styles.exerciseTitle}>Choose the correct definition</Text>
      </View>

      <Text style={styles.questionWord}>{exercise.word.word}</Text>
      <Text style={styles.pronunciation}>{exercise.word.pronunciation}</Text>

      <TouchableOpacity
        style={styles.audioButton}
        onPress={() => {
          Speech.speak(exercise.word.word, {
            language: "en",
            pitch: 1,
            rate: 1,
          });
        }}
      >
        <Volume2 size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        {exercise.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
              showAnswer &&
                option === exercise.correctAnswer &&
                styles.correctOption,
              showAnswer &&
                selectedOption === option &&
                option !== exercise.correctAnswer &&
                styles.wrongOption,
            ]}
            onPress={() => !showAnswer && setSelectedOption(option)}
            disabled={showAnswer}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
                showAnswer &&
                  option === exercise.correctAnswer &&
                  styles.correctOptionText,
              ]}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
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
  questionWord: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 10,
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
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#FF6B9D",
    backgroundColor: "rgba(255, 107, 157, 0.1)",
  },
  correctOption: {
    borderColor: "#2ECC71",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  wrongOption: {
    borderColor: "#E74C3C",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  optionText: {
    fontSize: 16,
    color: "#2C3E50",
    lineHeight: 22,
  },
  selectedOptionText: {
    color: "#FF6B9D",
    fontWeight: "600",
  },
  correctOptionText: {
    color: "#2ECC71",
    fontWeight: "600",
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
