import { Exercise } from "@/types/lesson";
import * as Speech from "expo-speech";
import { Headphones, Volume2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListeningProps {
  exercise: Exercise;
  showAnswer: boolean;
}

export const ListeningExercise: React.FC<ListeningProps> = ({
  exercise,
  showAnswer,
}) => (
  <View style={styles.exerciseContainer}>
    <View style={styles.questionCard}>
      <View style={styles.exerciseHeader}>
        <Headphones size={24} color="#F39C12" />
        <Text style={styles.exerciseTitle}>Listen and repeat</Text>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          Speech.stop(); 
          Speech.speak(exercise.word.word, {
            language: "en", 
            pitch: 1,
            rate: 1,
          });
        }}
      >
        <Volume2 size={48} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.listeningInstruction}>
        Listen carefully and try to repeat the word
      </Text>

      <Text style={styles.listeningWord}>
        {showAnswer ? exercise.word.word : "???"}
      </Text>
      <Text style={styles.pronunciation}>
        {showAnswer ? exercise.word.pronunciation : "Listen carefully"}
      </Text>

      {showAnswer && (
        <View style={styles.listeningDetails}>
          <Text style={styles.definition}>{exercise.word.definition}</Text>
          <Text style={styles.example}>{exercise.word.example}</Text>
        </View>
      )}

      {/* Mochi & Michi encouragement */}
      <View style={styles.mascotEncouragement}>
        <Text style={styles.encouragementMascot}>🍡🐱</Text>
        <Text style={styles.encouragementText}>
          {!showAnswer
            ? "Listen closely! Mochi & Michi are listening too!"
            : "Great listening! Practice makes perfect! 🎵"}
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
  playButton: {
    backgroundColor: "#F39C12",
    borderRadius: 50,
    padding: 30,
    alignSelf: "center",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  listeningInstruction: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 20,
  },
  listeningWord: {
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
  listeningDetails: {
    marginTop: 30,
    alignItems: "center",
  },
  definition: {
    fontSize: 18,
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },
  example: {
    fontSize: 16,
    color: "#7F8C8D",
    fontStyle: "italic",
    lineHeight: 22,
    textAlign: "center",
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
