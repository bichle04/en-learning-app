import { StyleSheet } from "react-native";

/**
 * Shared styles for feedback components (Fluency, Lexical, Grammar, Pronunciation)
 * This helps maintain consistency across all feedback screens
 */

export const sharedFeedbackStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  
  // Band/Score section styles
  bandSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 8,
  },
  bandHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  scoreCircleText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bandTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  bandContent: {
    marginTop: 8,
  },
  
  // Bullet points
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
  
  // Criteria card styles
  criteriaCard: {
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
  criteriaName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  criteriaFeedback: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  
  // Score badge
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  
  // Note section
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
  
  // Error section styles
  errorsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  errorsSectionTitle: {
    fontSize: 14,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    color: "#FFF",
    fontWeight: "bold",
    backgroundColor: "#FF6B6B",
    textAlign: "center",
  },
  errorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  errorCount: {
    backgroundColor: "#FFF",
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 60,
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: "center",
  },
  errorType: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  
  // Feedback sections styles
  strengthsSection: {
    backgroundColor: "#E8F5E9", // Light green
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  weaknessesSection: {
    backgroundColor: "#FFF3E0", // Light yellow
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  improvementsSection: {
    backgroundColor: "#E3F2FD", // Light blue
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorsTable: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  errorsTableHeader: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    padding: 8,
  },
  errorsTableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  errorsTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  errorsTableCell: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: "#333",
    borderRightWidth: 1, // Added vertical border
    borderRightColor: "#E0E0E0", // Color for vertical border
  },
  errorsTableCellOriginal: {
    flex: 0.8, // Reduced width for Original column
    padding: 8,
    fontSize: 14,
    color: "#333",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  errorsTableCellSuggested: {
    flex: 1, // Default width for Suggested column
    padding: 8,
    fontSize: 14,
    color: "#333",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  errorsTableCellExplanation: {
    flex: 1.2, // Increased width for Explanation column
    padding: 8,
    fontSize: 14,
    color: "#333",
  },
});

/**
 * Helper function to get score badge color
 */
export const getScoreBadgeColor = (score: string): string => {
  if (score === "Improvements") return "#1E90FF";
  if (score === "Strengths") return "#4CAF50";
  if (score === "Weaknesses") return "#FFA500";
  if (score === "Errors") return "#FF6B6B";
  return "#FF6B6B";
};

/**
 * Helper function to get feedback section color
 */
export const getFeedbackSectionColor = (type: string): string => {
  if (type === "Strengths") return "#E8F5E9"; // Light green
  if (type === "Weaknesses") return "#FFF3E0"; // Light yellow
  if (type === "Improvements") return "#E3F2FD"; // Light blue
  if (type === "Errors") return "#FFEBEE"; // Light red
  return "#F5F5F5"; // Default gray
};

export { sharedFeedbackStyles as feedbackStyles };
