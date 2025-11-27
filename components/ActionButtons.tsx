import { ExerciseType } from "@/types/lesson";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  exerciseType: ExerciseType;
  showAnswer: boolean;
  selectedOption: string | null;
  userAnswer: string;
  wordOrder: string[];
  currentExerciseIndex: number;
  totalExercises: number;
  onCheck: () => void;
  onRevealAnswer: () => void;
  onAnswerResponse: (isCorrect: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  exerciseType,
  showAnswer,
  selectedOption,
  userAnswer,
  wordOrder,
  currentExerciseIndex,
  totalExercises,
  onCheck,
  onRevealAnswer,
  onAnswerResponse,
  onPrevious,
  onNext,
}) => {
  const isDisabled = () => {
    switch (exerciseType) {
      case "multiple-choice":
        return !selectedOption;
      case "fill-blank":
      case "spelling":
        return !userAnswer.trim();
      case "word-order":
        return wordOrder.length === 0;
      case "word-definition-matching":
        // For matching exercise, we can allow checking even with partial matches
        return false;
      default:
        return false;
    }
  };

  if (!showAnswer) {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.checkButton,
            isDisabled() ? styles.disabledButton : null,
          ]}
          onPress={
            exerciseType === "flashcard" || exerciseType === "listening"
              ? onRevealAnswer
              : onCheck
          }
          disabled={isDisabled()}
        >
          <Text style={styles.checkButtonText}>
            {exerciseType === "flashcard" || exerciseType === "listening"
              ? "Reveal Answer"
              : "Check Answer"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.answerButtons}>
        <TouchableOpacity
          style={[
            styles.answerButton,
            styles.previousButton,
            currentExerciseIndex === 0 ? styles.disabledButton : null,
          ]}
          onPress={onPrevious}
          disabled={currentExerciseIndex === 0}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.answerButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.answerButton, styles.nextButton]}
          onPress={onNext}
          // disabled={currentExerciseIndex >= totalExercises - 1}
        >
          <Text style={styles.answerButtonText}>
            {currentExerciseIndex >= totalExercises - 1 ? "Done" : "Next"}
          </Text>
          <ChevronRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  checkButton: {
    backgroundColor: "#FF6B9D",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  disabledButton: {
    backgroundColor: "#BDC3C7",
  },
  checkButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  answerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal: 6,
  },
  previousButton: {
    backgroundColor: "#95A5A6",
  },
  nextButton: {
    backgroundColor: "#3498DB",
  },
  answerButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});