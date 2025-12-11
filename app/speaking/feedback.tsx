import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FluencyFeedback from "../../components/speaking/FluencyFeedback";
import GrammarFeedback from "../../components/speaking/GrammarFeedback";
import LexicalFeedback from "../../components/speaking/LexicalFeedback";
import OverallFeedback from "../../components/speaking/OverallFeedback";
import PronunciationFeedback from "../../components/speaking/PronunciationFeedback";

// Tab types
type FeedbackTab = "overall" | "fluency" | "lexical" | "grammar" | "pronunciation";

interface TabItem {
  key: FeedbackTab;
  label: string;
  shortLabel?: string;
}

const TABS: TabItem[] = [
  { key: "overall", label: "Overall", shortLabel: "Overall" },
  { key: "fluency", label: "Fluency and Coherence", shortLabel: "Fluency" },
  { key: "lexical", label: "Lexical Resource", shortLabel: "Lexical" },
  { key: "grammar", label: "Grammatical Range and Accuracy", shortLabel: "Grammar" },
  { key: "pronunciation", label: "Pronunciation", shortLabel: "Pronunciation" },
];

// TODO: Backend - Replace with actual feedback data from API
interface CriteriaDetail {
  name: string;
  score: string;
  feedback: string;
  errorSections?: Array<{
    title: string;
    errors: Array<{
      type: string;
      count: string;
    }>;
  }>;
}

export interface DetailedFeedback {
  overall_score: number;
  transcript: string;
  details: {
    fluency: {
      score: number;
      evaluation: Array<{
        criteria: string;
        description: string;
      }>;
      errors: Array<{
        original: string;
        suggested: string;
        explanation: string;
      }>;
      feedback: string;
      wpm: number;
    };
    pronunciation: {
      score: number;
      evaluation: Array<{
        criteria: string;
        description: string;
      }>;
      errors: Array<{
        original: string;
        suggested: string;
        explanation: string;
      }>;
      feedback: string;
    };
    grammar: {
      score: number;
      evaluation: Array<{
        criteria: string;
        description: string;
      }>;
      errors: Array<{
        original: string;
        suggested: string;
        explanation: string;
      }>;
      feedback: string;
    };
    vocabulary: {
      score: number;
      evaluation: Array<{
        criteria: string;
        description: string;
      }>;
      errors: Array<{
        original: string;
        suggested: string;
        explanation: string;
      }>;
      feedback: string;
    };
  };
  general_suggestions: string[];
}

export default function SpeakingFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<FeedbackTab>("overall");
  const [feedback, setFeedback] = useState<DetailedFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load feedback from params or use mock data
  useEffect(() => {
    try {
      if (params.feedback && typeof params.feedback === 'string') {
        const parsedFeedback = JSON.parse(params.feedback);
        setFeedback(parsedFeedback);
        console.log("Feedback loaded from API:", parsedFeedback);
      } else {
        // No feedback provided
        console.log("No feedback provided");
      }
    } catch (error) {
      console.error("Error parsing feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.feedback]);

  // Helper function to map API feedback data to component-compatible format
  const mapFeedbackData = (feedback: DetailedFeedback) => {
    return {
      overall: {
        score: feedback.overall_score,
        scores: {
          pronunciation: feedback.details.pronunciation.score,
          fluency: feedback.details.fluency.score,
          grammar: feedback.details.grammar.score,
          vocabulary: feedback.details.vocabulary.score,
        },
        congratulations: "Great job on completing the test!",
        general_suggestions: feedback.general_suggestions.join(' '),
      },
      fluency: {
        score: feedback.details.fluency.score,
        evaluation: feedback.details.fluency.evaluation,
        errors: feedback.details.fluency.errors,
        feedback: feedback.details.fluency.feedback,
        wpm: feedback.details.fluency.wpm,
      },
      lexical: {
        score: feedback.details.vocabulary.score,
        evaluation: feedback.details.vocabulary.evaluation,
        errors: feedback.details.vocabulary.errors,
        feedback: feedback.details.vocabulary.feedback,
      },
      grammar: {
        score: feedback.details.grammar.score,
        evaluation: feedback.details.grammar.evaluation,
        errors: feedback.details.grammar.errors,
        feedback: feedback.details.grammar.feedback,
      },
      pronunciation: {
        score: feedback.details.pronunciation.score,
        evaluation: feedback.details.pronunciation.evaluation,
        errors: feedback.details.pronunciation.errors,
        feedback: feedback.details.pronunciation.feedback,
      },
    };
  };

  const mappedFeedback = feedback ? mapFeedbackData(feedback) : null;

  const handleBack = () => {
    router.back();
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Loading feedback...</Text>
        </View>
      );
    }

    if (!mappedFeedback) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No feedback available</Text>
          <Text style={styles.placeholderSubtext}>Please try again later</Text>
        </View>
      );
    }

    switch (activeTab) {
      case "overall":
        return <OverallFeedback data={mappedFeedback.overall} />;
      case "fluency":
        return <FluencyFeedback data={mappedFeedback.fluency} />;
      case "lexical":
        return <LexicalFeedback data={mappedFeedback.lexical} />;
      case "grammar":
        return <GrammarFeedback data={mappedFeedback.grammar} />;
      case "pronunciation":
        return <PronunciationFeedback data={mappedFeedback.pronunciation} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1E90FF", "#00BFFF"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.shortLabel || tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    position: "relative",
  },
  tabActive: {
    // Active state
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: "#1E90FF",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  pentagonContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  pentagonLabels: {
    position: "relative",
    width: 280,
    height: 280,
    marginTop: -280,
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    lineHeight: 14,
  },
  section: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sectionContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#1E90FF",
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  criteriaCard: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  criteriaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  criteriaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  criteriaName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 6,
  },
  criteriaIcon: {
    fontSize: 14,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  criteriaFeedback: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    lineHeight: 18,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#999",
  },
});
