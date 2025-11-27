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

interface DetailedFeedback {
  overall: {
    score: number;
    scores: {
      pronunciation: number;
      fluency: number;
      grammar: number;
      lexical: number;
    };
    congratulations: string;
    strengths: string[];
    improvements: string[];
    actionPlan: string;
    nextSteps: string;
  };
  fluency: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
  lexical: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
  grammar: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
  pronunciation: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
  };
}

// TODO: Backend - This mock data will be replaced with actual feedback from server
const MOCK_FEEDBACK: DetailedFeedback = {
  overall: {
    score: 8.0,
    scores: {
      pronunciation: 9.0,
      fluency: 8.0,
      grammar: 8.0,
      lexical: 8.0,
    },
    congratulations: "Chúc mừng bạn đã hoàn thành bài thi Speaking!",
    strengths: [
      "Phát âm của bạn rất tốt, đạt điểm cao nhất trong các tiêu chí.",
      "Ngữ điệu và trọng âm chuẩn xác, ảnh hưởng tích cực đến tiêu chí Pronunciation.",
      "Bạn sử dụng được nhiều từ vựng cao cấp, cụm từ kết nối và từ vựng theo chủ đề phù hợp.",
      "Từ vựng được sử dụng linh hoạt và phù hợp với ngữ cảnh.",
    ],
    improvements: [
      "Bạn chưa nhấn mạnh đúng trọng âm cho một số từ trong câu, khiến phát âm chưa thực sự rõ ràng.",
      "Cấu trúc câu của bạn đôi khi còn đơn giản. Hãy cải thiện bằng cách phân tích và luyện tập thêm các cấu trúc câu phức tạp hơn.",
      "Độ trôi chảy có thể cải thiện thêm bằng cách giảm số lần ngập ngừng khi nói.",
    ],
    actionPlan: "Bạn cần tập trung luyện tập cấu trúc câu phức, sử dụng đa dạng mẫu câu và cải thiện sự liên kết giữa các ý trong bài nói.",
    nextSteps: "Hãy xem chi tiết từng tiêu chí bên dưới (Fluency & Coherence, Lexical Resource, Grammar, Pronunciation) để hiểu rõ hơn về điểm mạnh và điểm cần cải thiện. Sau đó thực hiện action plan để nâng cao kết quả.",
  },
  fluency: {
    score: 8.0,
    bandDescriptors: [
      "Nói trôi chảy, hiếm khi lặp lại ý hoặc tự sửa lại khi mắc lỗi",
      "Sử dụng thông thạo các từ nối cải dã dùng thường đơn điệu, lặp đi lặp lại và chưa tự nhiên.",
      "Phát triển các chủ đề một cách mạch lạc, hợp lý và bám sát câu hỏi",
    ],
    criteria: [
      {
        name: "Linking devices",
        score: "Limited",
        feedback: "Tương cụm từ kết nối bạn sử dụng còn hạn chế, và có những cụm từ nối cải dã dùng thường đơn điệu, lặp đi lặp lại và chưa tự nhiên.",
      },
      {
        name: "Relevance",
        score: "Excellent",
        feedback: "Câu trả lời của bạn thể hiện sự độ liên quan rất cao đối với yêu cầu của câu hỏi.",
      },
      {
        name: "Speak at length",
        score: "Very Good",
        feedback: "Bạn đã hoàn thành xuất sắc việc kéo dài câu trả lời.",
      },
      {
        name: "Range of speech",
        score: "Excellent",
        feedback: "Câu trả lời của bạn có tốc độ nói rất tốt, hầu như không có ngập ngừng hay dùng không từ nhiên.",
      },
    ],
  },
  lexical: {
    score: 8.0,
    bandDescriptors: [
      "Sử dụng vốn từ vựng phong phú, dễ dàng và linh hoạt khi thảo luận về tất cả các chủ đề và truyền đạt ý nghĩa chính xác.",
      "Sử dụng các từ vựng ít phổ biến và thành ngữ một cách khéo léo, mặc dù đôi khi có những sai sót trong cách chọn và sắp xếp từ",
      "Sử dụng kĩ năng diễn đạt cũng một ý bằng các cách khác nhau hiệu quả khi cần thiết",
    ],
    criteria: [
      {
        name: "Collocations",
        score: "Good",
        feedback: "Bạn đã bắt đầu sử dụng cụm từ có định, nhưng số lượng còn rất hạn chế trong phần trả lời.",
      },
      {
        name: "Topic specific words",
        score: "Modest",
        feedback: "Bạn còn thiếu sót trong việc đưa từ vựng theo chủ điểm vào câu trả lời.",
      },
      {
        name: "Word repetition control",
        score: "Good",
        feedback: "Bạn vẫn còn gặp lỗi lặp từ với tần suất đáng kể, trong đó nhiều lần là do không sử dụng đại từ thay thế.",
      },
    ],
  },
  grammar: {
    score: 8.0,
    bandDescriptors: [
      "Sử dụng nhiều và đa dạng các loại cấu trúc một cách linh hoạt",
      "Tạo lên các câu đều không mắc lỗi ngữ pháp, chỉ thỉnh thoảng vẫn sử dụng không phù hợp hoặc có lỗi ngữ pháp nhưng do vô tình mắc phải, không phải là lặp lại liên tục. Có thể có một số ít lỗi hơn một lần",
    ],
    criteria: [
      {
        name: "Complex structures",
        score: "Modest",
        feedback: "Câu trả lời của bạn hầu như không có sự xuất hiện của các cấu trúc phức.",
      },
      {
        name: "Grammatical accuracy",
        score: "Excellent",
        feedback: "Có thể nhận thấy sự thành công đáng kể trong việc hạn chế lỗi ngữ pháp, với tần suất lỗi rất thấp.",
        errorSections: [
          {
            title: "Most frequent grammar errors",
            errors: [
              { type: "Mạo từ", count: "6 Lần" },
              { type: "Giới từ", count: "5 Lần" },
              { type: "Đại từ", count: "1 Lần" },
            ],
          },
        ],
      },
    ],
  },
  pronunciation: {
    score: 9.0,
    bandDescriptors: [
      "Sử dụng đầy đủ các thành tố phát âm để truyền đạt ý nghĩa chính xác và/hoặc các ý nâng âm",
      "Duy trì việc sử dụng linh hoạt các thành tố này xuốt suốt bài nói",
      "Người nghe có thể dễ dàng hiểu quả khi cần thiết",
      "Cách phát âm không ảnh hưởng đến sự hiểu quả của bài nói",
    ],
    criteria: [
      {
        name: "Individual sound",
        score: "Excellent",
        feedback: "Bạn không gặp quá nhiều vấn đề với lối phát âm từ đơn lẻ nhưng vẫn có thể có gặp giảm tần suất mấc lỗi xuyên suốt các tiếu chỉ với sự hoàn hảo.",
        errorSections: [
          {
            title: "Common individual sound errors",
            errors: [
              { type: "/t/", count: "8 Lần" },
              { type: "/r/", count: "7 Lần" },
              { type: "/ə/", count: "6 Lần" },
            ],
          },
          {
            title: "Frequent mispronounced words",
            errors: [
              { type: "a", count: "1 Lần" },
              { type: "um", count: "1 Lần" },
            ],
          },
        ],
      },
    ],
  },
};

export default function SpeakingFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<FeedbackTab>("overall");

  // TODO: Backend - Get feedback from params or fetch from API
  // const { resultId } = params;
  const feedback = MOCK_FEEDBACK;

  const handleBack = () => {
    router.back();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overall":
        return <OverallFeedback data={feedback.overall} />;
      case "fluency":
        return <FluencyFeedback data={feedback.fluency} />;
      case "lexical":
        return <LexicalFeedback data={feedback.lexical} />;
      case "grammar":
        return <GrammarFeedback data={feedback.grammar} />;
      case "pronunciation":
        return <PronunciationFeedback data={feedback.pronunciation} />;
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
        <Text style={styles.headerTitle}>Kết quả</Text>
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
