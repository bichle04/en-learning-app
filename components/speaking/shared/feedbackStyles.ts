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
  },
  scoreBadgeText: {
    color: "#FFF",
    fontSize: 12,
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
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
});

/**
 * Helper function to get score badge color
 */
export const getScoreBadgeColor = (score: string): string => {
  if (score === "Excellent") return "#1E90FF";
  if (score === "Very Good") return "#4CAF50";
  if (score === "Good") return "#FFA500";
  if (score === "Modest") return "#FFA500"; // Same as Good
  if (score === "Limited") return "#FF6B6B";
  return "#FF6B6B";
};

/**
 * Helper function to get score background color (lighter version)
 */
export const getScoreBackgroundColor = (score: string): string => {
  if (score === "Excellent") return "#E3F2FD"; // Light blue
  if (score === "Very Good") return "#E8F5E9"; // Light green
  if (score === "Good") return "#FFF3E0"; // Light orange
  if (score === "Modest") return "#FFF3E0"; // Light orange
  if (score === "Limited") return "#FFEBEE"; // Light red/pink
  return "#F5F5F5"; // Default gray
};
