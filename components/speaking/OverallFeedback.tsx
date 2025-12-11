import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

const { width } = Dimensions.get("window");

interface OverallFeedbackProps {
  data: {
    score: number;
    scores: {
      pronunciation: number;
      fluency: number;
      grammar: number;
      vocabulary: number;
    };
    congratulations: string;
    general_suggestions: string;
  };
}

// Pentagon Chart Component
interface PentagonChartProps {
  scores: { label: string; value: number }[];
  overallScore: number;
}

const PentagonChart: React.FC<PentagonChartProps> = ({ scores, overallScore }) => {
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = 100;
  const maxScore = 9.0;

  // Pentagon points (5 vertices) - starting from top and going clockwise
  const getPoint = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start from top
    const radius = (score / maxScore) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Data points for the score pentagon (5 criteria)
  const dataPoints = [
    getPoint(0, overallScore), // Top - Overall
    getPoint(1, scores[0].value), // Top Right - Fluency
    getPoint(2, scores[1].value), // Bottom Right - Lexical
    getPoint(3, scores[2].value), // Bottom Left - Grammar
    getPoint(4, scores[3].value), // Left - Pronunciation
  ];

  // Background grid pentagons
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <View style={{ alignItems: "center", paddingVertical: 20 }}>
      <Svg width={size} height={size}>
        {/* Background grid pentagons */}
        {gridLevels.map((level, idx) => {
          const gridPoints = Array.from({ length: 5 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const radius = maxRadius * level;
            return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
          }).join(" ");

          return (
            <Polygon
              key={idx}
              points={gridPoints}
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          );
        })}

        {/* Score polygon filled area */}
        <Polygon
          points={dataPoints.map(p => `${p.x},${p.y}`).join(" ")}
          fill="rgba(30, 144, 255, 0.2)"
          stroke="#1E90FF"
          strokeWidth="2.5"
        />

        {/* Score points as circles */}
        {dataPoints.map((point, idx) => (
          <Circle key={idx} cx={point.x} cy={point.y} r="4" fill="#1E90FF" />
        ))}
      </Svg>

      {/* Labels and scores around the pentagon */}
      <View style={styles.pentagonLabels}>
        {/* Top - Overall */}
        <View style={[styles.labelContainer, { top: -10, alignSelf: "center" }]}>
          <Text style={styles.scoreValue}>{overallScore.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Overall</Text>
        </View>

        {/* Top Right - Fluency */}
        <View style={[styles.labelContainer, { top: 70, right: -20 }]}>
          <Text style={styles.scoreValue}>{scores[0].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Fluency and{"\n"}Coherence</Text>
        </View>

        {/* Bottom Right - Lexical */}
        <View style={[styles.labelContainer, { bottom: 50, right: 10 }]}>
          <Text style={styles.scoreValue}>{scores[1].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Lexical{"\n"}Resource</Text>
        </View>

        {/* Bottom Left - Grammar */}
        <View style={[styles.labelContainer, { bottom: 50, left: 10 }]}>
          <Text style={styles.scoreValue}>{scores[2].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Grammatical{"\n"}Range and{"\n"}Accuracy</Text>
        </View>

        {/* Left - Pronunciation */}
        <View style={[styles.labelContainer, { top: 70, left: -20 }]}>
          <Text style={styles.scoreValue}>{scores[3].value.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Pronunciation</Text>
        </View>
      </View>
    </View>
  );
};

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ data }) => {
  return (
    <ScrollView
      style={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Score Pentagon */}
      <View style={styles.pentagonContainer}>
        <PentagonChart
          scores={[
            { label: "Fluency and\nCoherence", value: data.scores.fluency },
            { label: "Lexical\nResource", value: data.scores.vocabulary },
            { label: "Grammatical\nRange and\nAccuracy", value: data.scores.grammar },
            { label: "Pronunciation", value: data.scores.pronunciation },
            { label: "", value: data.score }, // Overall at top
          ]}
          overallScore={data.score}
        />
      </View>

      {/* Congratulations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎉</Text>
          <Text style={styles.sectionTitle}>Congratulation</Text>
        </View>
        <Text style={styles.sectionContent}>{data.congratulations}</Text>
      </View>

      {/* Strengths */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💪</Text>
          <Text style={styles.sectionTitle}>Feedback</Text>
        </View>
        {data.general_suggestions.split(". ").map((point, index) => (
          point.trim().length > 0 && (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point.trim()}.</Text>
            </View>
          )
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: 300,
    height: 300,
    marginTop: -300,
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
});

export default OverallFeedback;
