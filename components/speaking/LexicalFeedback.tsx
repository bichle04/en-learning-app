import React from "react";
import GenericFeedback from "./GenericFeedback";

interface LexicalFeedbackProps {
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

const LexicalFeedback: React.FC<LexicalFeedbackProps> = ({ data }) => {
  return <GenericFeedback data={data} />;
};

export default LexicalFeedback;
