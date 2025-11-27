import React from "react";
import { ScrollView, Text, View } from "react-native";
import {
    getScoreBackgroundColor,
    getScoreBadgeColor,
    sharedFeedbackStyles,
} from "./shared/feedbackStyles";

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

interface GenericFeedbackProps {
  data: {
    score: number;
    bandDescriptors: string[];
    criteria: CriteriaDetail[];
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
      {/* Band Descriptors */}
      <View style={sharedFeedbackStyles.bandSection}>
        <View style={sharedFeedbackStyles.bandHeader}>
          <View style={sharedFeedbackStyles.scoreCircle}>
            <Text style={sharedFeedbackStyles.scoreCircleText}>
              {data.score.toFixed(1)}
            </Text>
          </View>
          <Text style={sharedFeedbackStyles.bandTitle}>Band descriptors</Text>
        </View>
        <View style={sharedFeedbackStyles.bandContent}>
          {data.bandDescriptors.map((descriptor, index) => (
            <View key={index} style={sharedFeedbackStyles.bulletPoint}>
              <Text style={sharedFeedbackStyles.bullet}>•</Text>
              <Text style={sharedFeedbackStyles.bulletText}>{descriptor}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Criteria Details */}
      {data.criteria.map((criterion, index) => (
        <View
          key={index}
          style={[
            sharedFeedbackStyles.criteriaCard,
            { backgroundColor: getScoreBackgroundColor(criterion.score) },
          ]}
        >
          <View style={sharedFeedbackStyles.criteriaHeader}>
            <Text style={sharedFeedbackStyles.criteriaName}>{criterion.name}</Text>
            <View
              style={[
                sharedFeedbackStyles.scoreBadge,
                { backgroundColor: getScoreBadgeColor(criterion.score) },
              ]}
            >
              <Text style={sharedFeedbackStyles.scoreBadgeText}>
                {criterion.score}
              </Text>
            </View>
          </View>
          <Text style={sharedFeedbackStyles.criteriaFeedback}>
            {criterion.feedback}
          </Text>

          {/* Error Sections (if exists) */}
          {criterion.errorSections && criterion.errorSections.length > 0 && (
            <>
              {criterion.errorSections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={sharedFeedbackStyles.errorsSection}>
                  <Text style={sharedFeedbackStyles.errorsSectionTitle}>
                    {section.title}
                  </Text>
                  {section.errors.map((error, errorIndex) => (
                    <View key={errorIndex} style={sharedFeedbackStyles.errorItem}>
                      <Text style={sharedFeedbackStyles.errorCount}>{error.count}</Text>
                      <Text style={sharedFeedbackStyles.errorType}>{error.type}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
        </View>
      ))}

      {/* Note */}
      <View style={sharedFeedbackStyles.noteContainer}>
        <Text style={sharedFeedbackStyles.noteText}>
          * Các chỉ số trên được đánh giá dựa trên việc so sánh kết quả với các bài cơ bản điểm tương đương
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default GenericFeedback;
