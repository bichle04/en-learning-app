import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
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

// TODO: Backend - This mock data will be replaced with actual feedback from server
const MOCK_FEEDBACK: DetailedFeedback = {
  overall_score: 6.0,
  transcript:
    "Hello, my name is Woop, and this is the example how I can use this recorder to test my API. And I feel this build works well, and I hope that it will help everyone to use this feature too.",
  details: {
    fluency: {
      score: 6.0,
      evaluation: [
        {
          criteria: "Strengths",
          description:
            "The speaker maintains a steady pace and is able to convey the main message clearly. The speaking rate of 116.96 WPM is within a reasonable range for natural speech.",
        },
        {
          criteria: "Weaknesses",
          description:
            "The speech lacks variety in sentence structure and complexity, which can make it sound somewhat monotonous. There is also a minor issue with coherence as the transition between ideas is not very smooth.",
        },
        {
          criteria: "Improvements",
          description:
            "To improve, the speaker could work on using a wider range of sentence structures and incorporating more complex ideas. Additionally, using linking words or phrases could help in making the speech more coherent and fluid.",
        },
      ],
      errors: [
        {
          original: "this is the example how I can use this recorder",
          suggested: "this is an example of how I can use this recorder",
          explanation:
            "The phrase 'this is the example how' is awkward and lacks clarity. Using 'an example of how' is more grammatically correct and clearer.",
        },
      ],
      feedback:
        "The speaker demonstrates a basic level of fluency and coherence, with a clear message and a steady speaking rate. However, the speech could benefit from more varied sentence structures and smoother transitions between ideas. Addressing these areas would enhance the overall fluency and coherence of the speech.",
      wpm: 116.96,
    },
    pronunciation: {
      score: 6.0,
      evaluation: [
        {
          criteria: "Strengths",
          description:
            "The speaker demonstrates a clear understanding of the basic sounds of English and can be understood without much effort. The speech is generally intelligible.",
        },
        {
          criteria: "Weaknesses",
          description:
            "There are some issues with word stress and intonation that may affect the natural flow of speech. Additionally, there might be some influence of the speaker's native language on certain sounds.",
        },
        {
          criteria: "Improvements",
          description:
            "The speaker should focus on practicing word stress and intonation patterns typical of English. Listening to native speakers and mimicking their pronunciation can be beneficial. Additionally, working on specific sounds that are influenced by the speaker's native language can help improve clarity.",
        },
      ],
      errors: [
        {
          original: "Woop",
          suggested: "[wuːp]",
          explanation:
            "The name 'Woop' might be pronounced with a non-standard vowel sound. Ensuring the vowel sound is clear and matches the intended pronunciation can help.",
        },
        {
          original: "example",
          suggested: "[ɪɡˈzæmpəl]",
          explanation:
            "The word 'example' might be mispronounced with incorrect stress or vowel sounds. The stress should be on the second syllable, and the vowel sounds should be clear.",
        },
        {
          original: "recorder",
          suggested: "[rɪˈkɔːrdər]",
          explanation:
            "The word 'recorder' might be pronounced with incorrect stress or vowel sounds. The stress should be on the second syllable, and the 'r' sounds should be clear.",
        },
      ],
      feedback:
        "The speaker's pronunciation is generally understandable, but there are areas that need improvement to achieve a more natural and fluent delivery. Focusing on word stress, intonation, and specific vowel and consonant sounds will enhance clarity and comprehensibility.",
    },
    grammar: {
      score: 6.0,
      evaluation: [
        {
          criteria: "Strengths",
          description:
            "The speaker demonstrates a basic command of English grammar, with the ability to construct simple sentences that convey the intended message. The use of conjunctions like 'and' and 'that' shows an attempt to connect ideas.",
        },
        {
          criteria: "Weaknesses",
          description:
            "There are noticeable errors in article usage and sentence structure, which can impede clarity. The sentence structure is somewhat repetitive, lacking variety and complexity.",
        },
        {
          criteria: "Improvements",
          description:
            "The speaker should focus on improving article usage and sentence variety. Practicing more complex sentence structures and ensuring subject-verb agreement will enhance clarity and coherence.",
        },
      ],
      errors: [
        {
          original: "this is the example how I can use this recorder",
          suggested: "this is an example of how I can use this recorder",
          explanation:
            "The article 'the' is incorrectly used here. 'An' is needed before 'example' because it is a singular, countable noun. Additionally, 'of' is required to correctly form the phrase 'example of how'.",
        },
      ],
      feedback:
        "The speaker shows a basic understanding of English grammar, but there are several areas for improvement. The use of articles and prepositions needs attention, and the speaker should work on varying sentence structures to enhance grammatical range. Overall, the message is understandable, but more complex structures and accurate grammar usage would improve the score.",
    },
    vocabulary: {
      score: 5.0,
      evaluation: [
        {
          criteria: "Strengths",
          description:
            "The speaker uses basic vocabulary accurately and appropriately for the context. The message is clear and understandable.",
        },
        {
          criteria: "Weaknesses",
          description:
            "The vocabulary is quite limited and lacks variety. There is a reliance on simple words and phrases, which does not demonstrate a wide range of vocabulary.",
        },
        {
          criteria: "Improvements",
          description:
            "To improve, the speaker should incorporate more varied and sophisticated vocabulary. Using synonyms and more precise language can enhance the lexical resource.",
        },
      ],
      errors: [
        {
          original: "this is the example how I can use",
          suggested: "this is an example of how I can use",
          explanation:
            "The phrase 'this is the example how I can use' is awkward and incorrect. 'An example of how' is a more natural and grammatically correct expression.",
        },
        {
          original: "this build works well",
          suggested: "this setup functions effectively",
          explanation:
            "'Build' is more commonly used in technical contexts related to software development. 'Setup' or 'configuration' might be more appropriate here, and 'functions effectively' is a more advanced way to express that something works well.",
        },
      ],
      feedback:
        "The speaker demonstrates a basic level of vocabulary suitable for everyday communication. However, to achieve a higher score, it is important to use a wider range of vocabulary, including more complex and precise words. The speaker should also focus on using idiomatic expressions and collocations to enhance the naturalness and sophistication of their language.",
    },
  },
  general_suggestions: [
    "Work on using a wider range of sentence structures to avoid monotony and improve coherence.",
    "Practice word stress and intonation patterns to enhance pronunciation clarity.",
    "Focus on improving article usage and sentence variety to enhance grammatical accuracy.",
    "Incorporate more varied and sophisticated vocabulary to demonstrate a wider lexical range.",
  ],
};

export default function SpeakingFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<FeedbackTab>("overall");

  // TODO: Backend - Get feedback from params or fetch from API
  // const { resultId } = params;
  const feedback = MOCK_FEEDBACK;

  // Helper function to map API feedback data to component-compatible format
  const mapFeedbackData = (feedback: DetailedFeedback) => {
    return {
      overall: {
        score: feedback.overall_score,
        scores: {
          pronunciation: feedback.details.pronunciation.score,
          fluency: feedback.details.fluency.score,
          grammar: feedback.details.grammar.score,
          lexical: feedback.details.vocabulary.score,
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

  const mappedFeedback = mapFeedbackData(MOCK_FEEDBACK);

  const handleBack = () => {
    router.back();
  };

  const renderTabContent = () => {
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

// Export MOCK_FEEDBACK separately for use in other files
export { MOCK_FEEDBACK };
