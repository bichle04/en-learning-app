import React from "react";
import { ScrollView, Text, View } from "react-native";
import {
  getScoreBadgeColor,
  getFeedbackSectionColor,
  sharedFeedbackStyles,
  feedbackStyles,
} from "./shared/feedbackStyles";

// Updated CriteriaDetail interface to match the mock data structure
interface CriteriaDetail {
  criteria: string; // Updated from 'name' to 'criteria'
  description: string; // Updated from 'feedback' to 'description'
}

interface GenericFeedbackProps {
  data: {
    score: number;
    evaluation: CriteriaDetail[]; // Updated from 'criteria' to 'evaluation'
    errors: Array<{
      original: string;
      suggested: string;
      explanation: string;
    }>;
    feedback: string; // Added feedback field
    wpm?: number; // Optional field for fluency
  };
}

/**
 * Generic feedback component used by all feedback tabs
 * (Fluency, Lexical, Grammar, Pronunciation)
 */
const GenericFeedback: React.FC<GenericFeedbackProps> = ({ data }) => {
  return (
    <ScrollView
      style={sharedFeedbackStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Score Section */}
      <View style={sharedFeedbackStyles.bandSection}>
        <View style={sharedFeedbackStyles.bandHeader}>
          <View style={sharedFeedbackStyles.scoreCircle}>
            <Text style={sharedFeedbackStyles.scoreCircleText}>
              {data.score.toFixed(1)}
            </Text>
          </View>
          <Text style={sharedFeedbackStyles.bandTitle}>Feedback Summary</Text>
        </View>
        <Text style={sharedFeedbackStyles.criteriaFeedback}>{data.feedback}</Text>
      </View>

      {/* Evaluation Details */}
      {data.evaluation.map((item, index) => (
        <View
          key={index}
          style={[
            feedbackStyles.criteriaCard,
            { backgroundColor: getFeedbackSectionColor(item.criteria) },
          ]}
        >
          <View style={sharedFeedbackStyles.criteriaHeader}>
            <Text
              style={[
                feedbackStyles.scoreBadge,
                { backgroundColor: getScoreBadgeColor(item.criteria) },
              ]}>{item.criteria}</Text>
          </View>
          <Text style={sharedFeedbackStyles.criteriaFeedback}>{item.description}</Text>
        </View>
      ))}

      {/* Errors Section */}
      {/* <Text style={sharedFeedbackStyles.errorsSectionTitle}>Errors</Text> */}
      {data.errors.length > 0 && (
        <View style={feedbackStyles.errorsTable}>
          <Text style={sharedFeedbackStyles.errorsSectionTitle}>Errors</Text>
          <View style={feedbackStyles.errorsTableHeader}>
            <Text style={[feedbackStyles.errorsTableHeaderText, { flex: 0.8 }]}>Original</Text>
            <Text style={[feedbackStyles.errorsTableHeaderText, { flex: 1 }]}>Suggested</Text>
            <Text style={[feedbackStyles.errorsTableHeaderText, { flex: 1.2 }]}>Explanation</Text>
          </View>
          {data.errors.map((error, index) => (
            <View key={index} style={feedbackStyles.errorsTableRow}>
              <Text style={feedbackStyles.errorsTableCellOriginal}>{error.original}</Text>
              <Text style={feedbackStyles.errorsTableCellSuggested}>{error.suggested}</Text>
              <Text style={feedbackStyles.errorsTableCellExplanation}>{error.explanation}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default GenericFeedback;
