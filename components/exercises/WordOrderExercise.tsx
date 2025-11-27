import { Exercise } from "@/types/lesson";
import { Move } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WordOrderProps {
  exercise: Exercise;
  showAnswer: boolean;
  wordOrder?: string[];
  onAnswerChange?: (answer: string[]) => void;
}

// Component cho từ có animation
interface AnimatedWordChipProps {
  word: string;
  index: number;
  isAnimating: boolean;
  isInAnswer: boolean;
  onPress: () => void;
  disabled: boolean;
}

const AnimatedWordChip: React.FC<AnimatedWordChipProps> = ({
  word,
  isAnimating,
  isInAnswer,
  onPress,
  disabled,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAnimating) {
      // Animation khi di chuyển: scale + fade
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.5,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isAnimating, scaleValue, opacityValue]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}
    >
      <TouchableOpacity
        style={[
          styles.wordChip,
          isInAnswer ? styles.answerWordChip : styles.bankWordChip,
          isAnimating && styles.animatingWordChip,
        ]}
        onPress={onPress}
        disabled={disabled || isAnimating}
      >
        <Text style={styles.wordChipText}>{word}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const WordOrderExercise: React.FC<WordOrderProps> = ({
  exercise,
  showAnswer,
  onAnswerChange,
}) => {
  // Lấy từ từ exercise
  const availableWords =
    exercise.options || exercise.correctAnswer?.split(" ") || [];
  availableWords.sort(() => Math.random() - 0.5);
  // State cho answer box (khung phía trên) và word bank (khung phía dưới)
  const [answerWords, setAnswerWords] = useState<string[]>([]);
  const [bankWords, setBankWords] = useState<string[]>(availableWords);

  // Animation states
  const [animatingWords, setAnimatingWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAnswerWords([]);
    setBankWords(availableWords);
  }, [exercise]);

  // Tạo animation cho từ
  const createWordAnimation = (word: string, fromAnswer: boolean) => {
    setAnimatingWords(prev => new Set(prev).add(word));

    // Sau 300ms sẽ hoàn thành animation và cập nhật state
    setTimeout(() => {
      setAnimatingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word);
        return newSet;
      });
    }, 300);
  };

  // Hàm di chuyển từ từ bank lên answer
  const moveToAnswer = (word: string, index: number) => {
    if (showAnswer) return;

    // Bắt đầu animation
    createWordAnimation(word, false);

    // Delay một chút rồi mới cập nhật state để có hiệu ứng
    setTimeout(() => {
      const newBankWords = bankWords.filter((_, i) => i !== index);
      const newAnswerWords = [...answerWords, word];

      setBankWords(newBankWords);
      setAnswerWords(newAnswerWords);
      onAnswerChange?.(newAnswerWords);
    }, 150);
  };

  // Hàm di chuyển từ từ answer xuống bank
  const moveToBank = (word: string, index: number) => {
    if (showAnswer) return;

    // Bắt đầu animation
    createWordAnimation(word, true);

    // Delay một chút rồi mới cập nhật state để có hiệu ứng
    setTimeout(() => {
      const newAnswerWords = answerWords.filter((_, i) => i !== index);
      const newBankWords = [...bankWords, word];

      setAnswerWords(newAnswerWords);
      setBankWords(newBankWords);
      onAnswerChange?.(newAnswerWords);
    }, 150);
  };

  return (
    <View style={styles.exerciseContainer}>
      <View style={styles.questionCard}>
        <View style={styles.exerciseHeader}>
          <Move size={24} color="#2ECC71" />
          <Text style={styles.exerciseTitle}>Arrange the sentence</Text>
        </View>

        <Text style={styles.instructionText}>
          Tap words to move them between areas and form the correct sentence:
        </Text>

        {/* Answer Box - Khung phía trên */}
        <View style={styles.answerContainer}>
          <Text style={styles.areaTitle}>Your Answer</Text>
          <View style={styles.answerBox}>
            {answerWords.length === 0 ? (
              <Text style={styles.placeholderText}>
                Tap words below to add them here
              </Text>
            ) : (
              answerWords.map((word, index) => (
                <AnimatedWordChip
                  key={`answer-${word}-${index}`}
                  word={word}
                  index={index}
                  isAnimating={animatingWords.has(word)}
                  isInAnswer={true}
                  onPress={() => moveToBank(word, index)}
                  disabled={showAnswer}
                />
              ))
            )}
          </View>
          {answerWords.length > 0 && (
            <Text style={styles.sentencePreview}>
              &ldquo;{answerWords.join(" ")}&rdquo;
            </Text>
          )}
        </View>

        {/* Word Bank - Khung phía dưới */}
        <View style={styles.wordBankContainer}>
          <Text style={styles.areaTitle}>Word Bank</Text>
          <View style={styles.wordBank}>
            {bankWords.map((word, index) => (
              <AnimatedWordChip
                key={`bank-${word}-${index}`}
                word={word}
                index={index}
                isAnimating={animatingWords.has(word)}
                isInAnswer={false}
                onPress={() => moveToAnswer(word, index)}
                disabled={showAnswer}
              />
            ))}
          </View>
        </View>

        {showAnswer && (
          <View style={styles.answerReveal}>
            <Text style={styles.correctAnswerLabel}>Correct sentence:</Text>
            <Text style={styles.correctAnswerText}>
              {exercise.correctAnswer}
            </Text>
            <Text style={styles.resultText}>
              {answerWords.join(" ") === exercise.correctAnswer
                ? "✅ Correct!"
                : "❌ Try again!"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

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
  instructionText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  answerContainer: {
    marginBottom: 20,
    backgroundColor: "#F8FBFF",
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E8F4FD",
    borderStyle: "dashed",
  },
  wordBankContainer: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E6E8",
  },
  areaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
    textAlign: "center",
  },
  answerBox: {
    minHeight: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#BDC3C7",
    fontStyle: "italic",
    textAlign: "center",
  },
  wordChip: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  answerWordChip: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  bankWordChip: {
    backgroundColor: "#F8F9FA",
    borderColor: "#E8E6E8",
  },
  wordChipText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  sentencePreview: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8F4FD",
  },
  answerReveal: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#F0F8F0",
    borderRadius: 12,
    padding: 16,
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
    textAlign: "center",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  instructions: {
    backgroundColor: "#E8F8F5",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#27AE60",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
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
  animatingWordChip: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
    elevation: 6,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
