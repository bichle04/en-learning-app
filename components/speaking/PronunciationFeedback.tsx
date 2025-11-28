import React from "react";
import GenericFeedback from "./GenericFeedback";

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

interface PronunciationFeedbackProps {
  data: {
    score: number;
    evaluation: {
      criteria: string;
      description: string;
    }[];
    errors: {
      original: string;
      suggested: string;
      explanation: string;
    }[];
    feedback: string;
  };
}

const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default PronunciationFeedback;
