import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { BookOpen, Volume2 } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FillBlankProps {
  exercise: Exercise;
  showAnswer: boolean;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
}

export const FillBlankExercise: React.FC<FillBlankProps> = ({
  exercise,
  showAnswer,
  userAnswer,
  setUserAnswer,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.exerciseContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.questionCard}>
          <View style={styles.exerciseHeader}>
            <BookOpen size={24} color="#9B59B6" />
            <Text style={styles.exerciseTitle}>
              Fill in the blank (type your answer)
            </Text>
          </View>

          <Text style={styles.sentenceText}>{exercise.blankedSentence}</Text>

          {showAnswer ? (
            <View style={styles.answerReveal}>
              {userAnswer.toLowerCase().trim() ===
              exercise.correctAnswer?.toLowerCase() ? (
                <Text style={styles.resultText}>✅ Correct!</Text>
              ) : (
                <Text style={styles.resultTextWrong}>
                  ❌ Your answer: &ldquo;{userAnswer}&rdquo;
                </Text>
              )}
              <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
              <Text style={styles.correctAnswerText}>
                {exercise.correctAnswer}
              </Text>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Type your answer:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  showAnswer &&
                  userAnswer.toLowerCase().trim() ===
                    exercise.correctAnswer?.toLowerCase()
                    ? styles.correctInput
                    : showAnswer && userAnswer.trim() !== ""
                    ? styles.wrongInput
                    : null,
                ]}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Enter the missing word..."
                placeholderTextColor="#BDC3C7"
                editable={!showAnswer}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.ipaHintContainer}>
            <Text style={styles.ipaHintLabel}>Pronunciation hint:</Text>
            <Text style={styles.ipaHintText}>{exercise.ipaHint}</Text>
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
              <Volume2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  sentenceText: {
    fontSize: 20,
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 20,
  },
  ipaHintContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  ipaHintLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 4,
  },
  ipaHintText: {
    fontSize: 18,
    color: "#9B59B6",
    fontWeight: "bold",
    marginBottom: 8,
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
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2C3E50",
    borderWidth: 2,
    borderColor: "#E8E6E8",
    textAlign: "center",
  },
  correctInput: {
    borderColor: "#2ECC71",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  wrongInput: {
    borderColor: "#E74C3C",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  answerReveal: {
    marginTop: 20,
    alignItems: "center",
  },
  correctAnswerLabel: {
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 8,
  },
  correctAnswerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ECC71",
    textAlign: "center",
  },
  resultTextWrong: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E74C3C",
    textAlign: "center",
  },
});
