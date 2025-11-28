import { getSpeakingTopics } from "@/services/speaking";
import { SpeakingPart, SpeakingTopic } from "@/types/speaking";
import { router } from "expo-router";
import { ArrowLeft, BookOpen } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PracticeMode() {
  const [selectedPart, setSelectedPart] = useState<SpeakingPart | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handlePartSelect = (part: SpeakingPart) => {
    setSelectedPart(part);
    setSelectedTopicId(null);
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleStartPractice = () => {
    if (selectedTopicId) {
      router.push({
        pathname: "/speaking/room" as any,
        params: {
          mode: "practice",
          topicId: selectedTopicId,
        },
      });
    }
  };

  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      if (selectedPart) {
        setIsLoading(true);
        const data = await getSpeakingTopics(selectedPart);
        setTopics(data);
        setIsLoading(false);
      } else {
        setTopics([]);
      }
    }
    fetchTopics();
  }, [selectedPart]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Speaking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Part Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Part</Text>
          <View style={styles.partContainer}>
            {[1, 2, 3].map((part) => (
              <TouchableOpacity
                key={part}
                style={[
                  styles.partCard,
                  selectedPart === part && styles.partCardSelected,
                ]}
                onPress={() => handlePartSelect(part as SpeakingPart)}
              >
                <Text
                  style={[
                    styles.partNumber,
                    selectedPart === part && styles.partNumberSelected,
                  ]}
                >
                  Part {part}
                </Text>
                <Text
                  style={[
                    styles.partDescription,
                    selectedPart === part && styles.partDescriptionSelected,
                  ]}
                >
                  {part === 1 && "Introduction"}
                  {part === 2 && "Long Turn"}
                  {part === 3 && "Discussion"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Topic Selection */}
        {selectedPart && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select topic</Text>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  selectedTopicId === topic.id && styles.topicCardSelected,
                ]}
                onPress={() => handleTopicSelect(topic.id)}
              >
                <View style={styles.topicIcon}>
                  <BookOpen
                    size={24}
                    color={selectedTopicId === topic.id ? "#FF6B9D" : "#666"}
                  />
                </View>
                <View style={styles.topicInfo}>
                  <Text
                    style={[
                      styles.topicTitle,
                      selectedTopicId === topic.id && styles.topicTitleSelected,
                    ]}
                  >
                    {topic.title}
                  </Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Start Button */}
      {selectedTopicId && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPractice}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  partContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  partCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  partCardSelected: {
    borderColor: "#FF6B9D",
    backgroundColor: "#FFF5F8",
  },
  partNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
    marginBottom: 4,
  },
  partNumberSelected: {
    color: "#FF6B9D",
  },
  partDescription: {
    fontSize: 12,
    color: "#999999",
  },
  partDescriptionSelected: {
    color: "#FF6B9D",
  },
  topicCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  topicCardSelected: {
    borderColor: "#FF6B9D",
    backgroundColor: "#FFF5F8",
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
    justifyContent: "center",
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  topicTitleSelected: {
    color: "#FF6B9D",
  },
  topicDescription: {
    fontSize: 13,
    color: "#999999",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  startButton: {
    backgroundColor: "#FF6B9D",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
