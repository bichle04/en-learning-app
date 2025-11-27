import { BREAK_TIME, FULL_TEST_QUESTIONS, SPEAKING_QUESTIONS } from "@/data/speaking-mock-data";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Pause, Volume2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// States for the speaking room
type RoomState = 
  | "idle"           // Initial state - waiting to start
  | "playing-audio"  // Playing question audio
  | "break"          // 10s break between parts
  | "preparing"      // Part 2 only - 1 min preparation
  | "recording"      // Recording user's answer
  | "finished";      // Question completed

export default function SpeakingRoom() {
  const params = useLocalSearchParams();
  const mode = params.mode as "practice" | "test";
  const topicId = params.topicId as string;

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [roomState, setRoomState] = useState<RoomState>("idle");
  const [prepTimeLeft, setPrepTimeLeft] = useState(0);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  
  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Recording state (for backend integration)
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  // Get questions based on mode
  const questions =
    mode === "test"
      ? FULL_TEST_QUESTIONS
      : SPEAKING_QUESTIONS.filter((q) => q.topicId === topicId);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Check if moving to a new part (for break time)
  const isNewPart = currentQuestionIndex > 0 && 
    questions[currentQuestionIndex - 1]?.part !== currentQuestion?.part;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Timer effect for preparation, speaking, and break
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (roomState === "break" && breakTimeLeft > 0) {
      interval = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            setRoomState("idle");
            setShowBreakModal(false); // Hide modal when break ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (roomState === "preparing" && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto start recording after preparation
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (roomState === "recording" && speakTimeLeft > 0) {
      interval = setInterval(() => {
        setSpeakTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto stop recording when time is up
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [roomState, prepTimeLeft, speakTimeLeft, breakTimeLeft]);

  // ========================================
  // BACKEND INTEGRATION POINTS
  // ========================================

  /**
   * Play audio file for the question
   * BACKEND TODO: Replace with actual audio file URL from API
   * - Load audio from server based on currentQuestion.audioUrl
   * - Handle audio loading errors
   * - Update progress if needed
   */
  const playAudio = async () => {
    try {
      setIsAudioPlaying(true);
      setRoomState("playing-audio");
      
      // BACKEND: Replace this with actual audio file from API
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/correct.mp3"), // Temporary mock file
        { shouldPlay: true },
        onAudioPlaybackStatusUpdate
      );
      
      setSound(audioSound);
      await audioSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      // BACKEND: Handle error - maybe show error message to user
      handleAudioFinished(); // Continue anyway
    }
  };

  /**
   * Audio playback status callback
   * Auto-start recording or preparation when audio finishes
   */
  const onAudioPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      handleAudioFinished();
    }
  };

  /**
   * Handle audio finished - start next phase
   */
  const handleAudioFinished = () => {
    setIsAudioPlaying(false);
    
    // Part 2 has preparation time
    if (currentQuestion.part === 2 && currentQuestion.prepTime > 0) {
      setRoomState("preparing");
      setPrepTimeLeft(currentQuestion.prepTime);
    } else {
      // Part 1 & 3: Auto start recording immediately
      startRecording();
    }
  };

  /**
   * Start recording user's answer
   * BACKEND TODO: Implement actual audio recording
   * - Use expo-av Audio.Recording
   * - Save recording file
   * - Handle permissions
   */
  const startRecording = async () => {
    try {
      setRoomState("recording");
      setSpeakTimeLeft(currentQuestion.speakTime);
      
      // BACKEND: Start actual recording here
      console.log("🎤 START RECORDING - Part", currentQuestion.part);
      
      // BACKEND TODO: Example implementation
      // const { recording } = await Audio.Recording.createAsync(
      //   Audio.RecordingOptionsPresets.HIGH_QUALITY
      // );
      // Store recording reference for later use
      
    } catch (error) {
      console.error("Error starting recording:", error);
      // BACKEND: Handle recording permission/error
    }
  };

  /**
   * Stop recording user's answer
   * BACKEND TODO: Stop recording and save file
   * - Stop Audio.Recording
   * - Get recording URI
   * - Upload to server if needed
   */
  const stopRecording = async () => {
    try {
      setRoomState("finished");
      
      // BACKEND: Stop actual recording here
      console.log("⏹️ STOP RECORDING - Part", currentQuestion.part);
      
      // BACKEND TODO: Example implementation
      // await recording.stopAndUnloadAsync();
      // const uri = recording.getURI();
      // setRecordingUri(uri);
      // uploadRecording(uri); // Send to server
      
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  /**
   * Move to next question or finish test
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      
      // Check if entering a new part - add break time
      if (currentQuestion.part !== nextQuestion.part) {
        setCurrentQuestionIndex(nextIndex);
        setRoomState("break");
        setBreakTimeLeft(BREAK_TIME);
        setShowBreakModal(true); // Show modal to hide next part content
      } else {
        setCurrentQuestionIndex(nextIndex);
        setRoomState("idle");
      }
      
      // Reset states
      setPrepTimeLeft(0);
      setSpeakTimeLeft(0);
      setRecordingUri(null);
    } else {
      // BACKEND: Navigate to results with all recordings
      // Pass recordingUris array to result screen
      router.push("/speaking/result" as any);
    }
  };

  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getInstructionText = () => {
    switch (roomState) {
      case "idle":
        return "Nhấn nút phát để bắt đầu";
      case "playing-audio":
        return "Đang phát câu hỏi...";
      case "break":
        return `Nghỉ giữa giờ - Part ${currentQuestion.part}`;
      case "preparing":
        return "Thời gian chuẩn bị";
      case "recording":
        return "Đang ghi âm...";
      case "finished":
        return "Đã hoàn thành!";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1E90FF", "#00BFFF", "#87CEEB"]}
        style={styles.gradient}
      >
        {/* Decorative elements */}
        <View style={[styles.star, { top: 60, left: 20 }]} />
        <View style={[styles.plus, { top: 100, right: 30 }]} />
        <View style={[styles.star, { bottom: 150, left: width * 0.75 }]} />
        <View style={[styles.plus, { bottom: 250, left: 30 }]} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.partInfo}>
            <Text style={styles.partText}>
              Part {currentQuestion.part} - {currentQuestionIndex + 1}/{questions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Question Card */}
          <View style={styles.questionCard}>
            {/* Audio/Play Button */}
            <TouchableOpacity
              style={[
                styles.audioButton,
                roomState === "playing-audio" && styles.audioButtonPlaying,
              ]}
              onPress={playAudio}
              disabled={roomState !== "idle"}
            >
              <View style={styles.audioIconContainer}>
                {roomState === "playing-audio" ? (
                  <Pause size={40} color="#FFFFFF" />
                ) : (
                  <Volume2 size={40} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>

            {/* Question Text - Only show for Part 2 */}
            {currentQuestion.part === 2 && currentQuestion.question ? (
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            ) : (
              <Text style={styles.audioOnlyText}>
                {currentQuestion.part === 1 && "The examiner will ask you questions"}
                {currentQuestion.part === 3 && "Discussion with the examiner"}
              </Text>
            )}

            {/* Mascot */}
            <Text style={styles.mascot}>🎙️</Text>
          </View>

          {/* Timer/Status Display */}
          <View style={styles.timerContainer}>
            {/* Remove break display from main UI - now in modal */}
            
            {roomState === "preparing" && (
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>Thời gian chuẩn bị</Text>
                <Text style={styles.timerValue}>{formatTime(prepTimeLeft)}</Text>
              </View>
            )}
            
            {roomState === "recording" && (
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>Thời gian còn lại</Text>
                <Text style={styles.timerValue}>{formatTime(speakTimeLeft)}</Text>
              </View>
            )}
            
            {roomState === "finished" && (
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>Đã hoàn thành!</Text>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < questions.length - 1
                      ? "Câu tiếp theo"
                      : "Xem kết quả"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Info Section */}
        <View style={styles.bottomSection}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusIcon}>
              {roomState === "recording" ? "🔴" : "👤"}
            </Text>
            <Text style={styles.statusText}>{getInstructionText()}</Text>
          </View>

          {/* Recording Indicator */}
          {roomState === "recording" && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Đang ghi âm</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Break Time Modal - Covers the screen to hide next part content */}
      <Modal
        visible={showBreakModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}} // Prevent closing by back button
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF6B9D", "#FF8C42"]}
            style={styles.breakModalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative stars */}
            <View style={[styles.modalStar, { top: 40, left: 30 }]} />
            <View style={[styles.modalStar, { top: 80, right: 40 }]} />
            <View style={[styles.modalStar, { bottom: 100, left: 50 }]} />
            <View style={[styles.modalStar, { bottom: 60, right: 30 }]} />

            <Text style={styles.breakEmoji}>☕</Text>
            <Text style={styles.breakTitle}>Thời gian nghỉ</Text>
            <Text style={styles.breakSubtitle}>
              Bạn đã hoàn thành Part {questions[currentQuestionIndex - 1]?.part || currentQuestion.part}
            </Text>
            
            <View style={styles.breakTimerBox}>
              <Text style={styles.breakTimerValue}>{formatTime(breakTimeLeft)}</Text>
            </View>

            <Text style={styles.breakMessage}>
              Chuẩn bị tinh thần cho Part {currentQuestion.part}! 💪
            </Text>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  partInfo: {
    flex: 1,
    alignItems: "center",
  },
  partText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  audioButton: {
    marginBottom: 20,
  },
  audioButtonPlaying: {
    opacity: 0.7,
  },
  audioIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 15,
    color: "#333333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  audioOnlyText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 16,
  },
  mascot: {
    fontSize: 48,
  },
  timerContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  timerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
    minWidth: 200,
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF0000",
    marginRight: 8,
  },
  recordingText: {
    fontSize: 13,
    color: "#FF0000",
    fontWeight: "600",
  },
  // Decorative elements
  star: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 4,
  },
  plus: {
    position: "absolute",
    width: 16,
    height: 16,
  },
  // Break Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  breakModalContent: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalStar: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 6,
  },
  breakEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  breakTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  breakSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 32,
    textAlign: "center",
  },
  breakTimerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 48,
    marginBottom: 24,
  },
  breakTimerValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  breakMessage: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
  },
});
